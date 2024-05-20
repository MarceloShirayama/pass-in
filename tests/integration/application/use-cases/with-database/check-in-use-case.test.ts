import { PostgresAdapter } from "@infra/database";
import { CheckInUseCase } from "@application/use-cases";
import { RepositoriesFactory } from "@infra/factories";
import { User, Event, EventUser } from "@domain/entities";
import { ConflictError } from "@shared/error";

describe('CheckInUserInEventUseCase with database repository', () => {
  const inputRegisterUser = {
    name: 'any name',
    email: 'any_email@mail.com',
    username: 'any username',
    password: 'anyPassword*1'
  }

  const inputRegisterEvent = {
    title: 'any title',
    details: 'any details',
    maximumAttendees: 10
  }
  const {
    eventRepository, eventUserRepository, userRepository, checkInRepository
  } = RepositoriesFactory.database
  const connection = new PostgresAdapter()
  const user = User.create(inputRegisterUser)
  const event = Event.create(inputRegisterEvent)
  const eventUser = EventUser.create(
    { eventId: event.props.id!, userId: user.props.id! }
  )

  beforeEach(async () => {
    await userRepository.save(user)
    await eventRepository.save(event)
    await eventUserRepository.save(eventUser)
  })
  afterEach(async () => {
    await connection.query(
      /*sql*/`
        DELETE FROM tb_user
        WHERE username = $1 
      `, [user.props.username.value]
    )
    await connection.query(
      /*sql*/`
        DELETE FROM tb_event
        WHERE title = $1
      `, [event.props.title.value]
    )
    await connection.query(
      /*sql*/`
        DELETE FROM tb_event_user
        WHERE user_id = $1
      `, [user.props.id]
    )
  })

  it('should be able to check in an user in an event', async () => {
    const useCase = new CheckInUseCase(
      checkInRepository, eventUserRepository
    )
    const output = await useCase.execute({
      eventId: event.props.id,
      userId: user.props.id
    })
    expect(output).toHaveProperty('eventId', event.props.id)
    expect(output).toHaveProperty('userId', user.props.id)
  })

  it('should return an error if attendee not registered in event', async () => {
    const inputRegisterOtherEvent = {
      title: 'other title',
      details: 'other details',
      maximumAttendees: 10
    }
    const otherEvent = Event.create(inputRegisterOtherEvent)
    await eventRepository.save(otherEvent)
    const useCase = new CheckInUseCase(
      checkInRepository, eventUserRepository
    )
    expect(() => useCase.execute({
      eventId: otherEvent.props.id,
      userId: user.props.id
    })).rejects.toThrowError(
      new ConflictError("attendee not registered in this event")
    )
    await connection.query(
      /*sql*/`
        DELETE FROM tb_event
        WHERE title = $1
      `, [otherEvent.props.title.value]
    )
  })

  it('should return an error if user already checked in event', async () => {
    const useCase = new CheckInUseCase(
      checkInRepository, eventUserRepository
    )
    await useCase.execute({
      eventId: event.props.id,
      userId: user.props.id
    })
    expect(() => useCase.execute({
      eventId: event.props.id,
      userId: user.props.id
    })).rejects.toThrowError(
      new ConflictError("attendee already checked in event")
    )
  })
})
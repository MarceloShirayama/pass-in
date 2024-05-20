import { PostgresAdapter } from "@infra/database";
import { RegisterAttendeeInEventUseCase } from "@application/use-cases";
import { RepositoriesFactory } from "@infra/factories";
import { User, Event } from "@domain/entities";
import { ConflictError } from "@shared/error";


describe('RegisterAttendeeInEventUseCase with database repository', () => {
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

  const { eventRepository, eventUserRepository, userRepository } = RepositoriesFactory.database
  const connection = new PostgresAdapter()
  const user = User.create(inputRegisterUser)
  const event = Event.create(inputRegisterEvent)

  beforeEach(async () => {
    await userRepository.save(user)
    await eventRepository.save(event)
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
  });

  it('should be able to register an attendee in an event with valid input', async () => {
    const useCase = new RegisterAttendeeInEventUseCase(
      eventUserRepository,
      eventRepository
    )
    const output = await useCase.execute({
      userId: user.props.id,
      eventId: event.props.id
    })
    expect(output).toHaveProperty('eventId', event.props.id)
    expect(output).toHaveProperty('userId', user.props.id)
  })

  it('should return an error if user already registered in event', async () => {
    const useCase = new RegisterAttendeeInEventUseCase(
      eventUserRepository,
      eventRepository
    )
    await useCase.execute({
      userId: user.props.id,
      eventId: event.props.id
    })
    expect(() => useCase.execute({
      userId: user.props.id,
      eventId: event.props.id
    })).rejects.toThrowError(
      new ConflictError("attendee is already registered for this event")
    )
  })
})

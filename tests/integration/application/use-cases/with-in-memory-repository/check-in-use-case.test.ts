import { EventUser } from "@domain/entities";
import { ConflictError } from "@shared/error";
import { CheckInUseCase } from "@application/use-cases";
import {
  inMemoryEventRepository,
  inMemoryCheckInRepository,
  inMemoryUserRepository,
  inMemoryEventUserRepository
} from "@infra/repositories";


describe('CheckInUserInEventUseCase', async () => {
  const eventUserRepository = inMemoryEventUserRepository;
  const eventRepository = inMemoryEventRepository;
  const checkInRepository = inMemoryCheckInRepository;
  const userRepository = inMemoryUserRepository;
  const useCase = new CheckInUseCase(checkInRepository, eventUserRepository);
  const userRegistered = await userRepository.findByUsername('attendee')
  const eventRegistered = await eventRepository.findByTitle('Event example')
  const eventUser = EventUser.create({
    eventId: eventRegistered?.props.id!,
    userId: userRegistered?.props.id!
  })

  afterEach(async () => {
    await checkInRepository.clear();
    await eventUserRepository.clear();
  });

  it('should be able to check in an user in an event', async () => {
    await eventUserRepository.save(eventUser)
    const output = await useCase.execute({
      eventId: eventRegistered!.props.id,
      userId: userRegistered!.props.id
    })
    expect(output).toHaveProperty('eventId', eventRegistered!.props.id)
    expect(output).toHaveProperty('userId', userRegistered!.props.id)
  })

  it('should return an error if user not registered in event', async () => {
    expect(() => useCase.execute({
      eventId: eventRegistered!.props.id,
      userId: userRegistered!.props.id
    })).rejects.toThrowError(new ConflictError("attendee not registered in this event"))
  })

  it('should return an error if user already checked in event', async () => {
    await eventUserRepository.save(eventUser)
    await useCase.execute({
      eventId: eventRegistered!.props.id,
      userId: userRegistered!.props.id
    })
    expect(() => useCase.execute({
      eventId: eventRegistered!.props.id,
      userId: userRegistered!.props.id
    })).rejects.toThrowError(
      new ConflictError("attendee already checked in event")
    )
  })
})
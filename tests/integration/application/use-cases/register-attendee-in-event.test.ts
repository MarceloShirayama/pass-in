import { RegisterAttendeeInEventUseCase } from "@application/use-cases";
import {
  inMemoryEventUserRepository,
  inMemoryEventRepository,
  inMemoryUserRepository
} from "@infra/repositories";
import { ConflictError, InvalidParamError } from "@shared/error";

describe('RegisterAttendeeInEventUseCase', async () => {
  const eventUserRepo = inMemoryEventUserRepository
  const eventRepo = inMemoryEventRepository
  const userRepo = inMemoryUserRepository
  const useCase = new RegisterAttendeeInEventUseCase(
    eventUserRepo,
    eventRepo,
    userRepo
  );
  const userRegistered = await userRepo.findByUsername('attendee')
  const eventRegistered = await eventRepo.findByTitle('Event example')

  beforeEach(async () => {
    await eventUserRepo.clear();
  });

  it('should be able to register an attendee in an event', async () => {
    const output = await useCase.execute({
      eventId: eventRegistered!.props.id,
      userId: userRegistered!.props.id
    })
    expect(output).toHaveProperty('eventId', eventRegistered!.props.id)
    expect(output).toHaveProperty('userId', userRegistered!.props.id)
  })

  it('should return an error if user already registered in event', async () => {
    await useCase.execute({
      eventId: eventRegistered!.props.id,
      userId: userRegistered!.props.id
    })

    expect(() => useCase.execute({
      eventId: eventRegistered!.props.id,
      userId: userRegistered!.props.id
    })).rejects.toThrowError(
      new ConflictError("attendee is already registered for this event")
    )
  })

  it('should return an error if event not found', async () => {
    expect(() => useCase.execute({
      eventId: 'any id',
      userId: userRegistered!.props.id
    })).rejects.toThrowError(
      new InvalidParamError("event not found")
    )
  })

  it('should return an error if user not found', async () => {
    expect(() => useCase.execute({
      eventId: eventRegistered!.props.id,
      userId: 'any id'
    })).rejects.toThrowError(
      new InvalidParamError("user not found")
    )
  })
})
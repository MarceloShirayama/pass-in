import { InvalidParamError } from "@/shared/error";
import { EventUserRepository, EventRepository, UserRepository } from "@application/repositories";

type Input = {
  eventId: string
  userId: string
}

type Output = {
  eventId: string
  userId: string
}

export class RegisterAttendeeInEventUseCase {
  constructor(
    private readonly eventUserRepository: EventUserRepository,
    private readonly eventRepository: EventRepository,
    private readonly userRepository: UserRepository
  ) { }

  async execute({ eventId, userId }: Input): Promise<Output> {
    const user = await this.userRepository.findById(userId)
    if (!user) throw new InvalidParamError("user not found")
    const event = await this.eventRepository.findById(eventId)
    if (!event) throw new InvalidParamError("event not found")
    await this.eventUserRepository.save({ eventId, userId })
    return {
      eventId,
      userId
    }
  }
}
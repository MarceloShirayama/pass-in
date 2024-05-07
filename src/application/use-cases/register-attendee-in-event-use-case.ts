import { NotFoundError } from "@/shared/error";
import { EventRepository, EventUserRepository } from "@application/repositories";

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
    private readonly eventRepository: EventRepository
  ) { }

  async execute({ eventId, userId }: Input): Promise<Output> {
    const event = await this.eventRepository.findById(eventId)
    if (!event) throw new NotFoundError("event not found")
    await this.eventUserRepository.save({ eventId, userId })
    return {
      eventId,
      userId
    }
  }
}
import { CheckIn } from "@domain/entities";
import { CheckInRepository, EventUserRepository } from "@application/repositories";
import { ConflictError } from "@shared/error";

type Input = {
  eventId: string
  userId: string
}

type Output = {
  eventId: string
  userId: string
}

export class CheckInUseCase {
  constructor(
    private checkInRepository: CheckInRepository,
    private eventUserRepository: EventUserRepository
  ) { }

  async execute({ eventId, userId }: Input): Promise<Output> {
    const eventUser = await this.eventUserRepository.findByUserIdAndEventId({ userId, eventId })
    if (!eventUser) throw new ConflictError("attendee not registered in this event")
    const alreadyChecked = await this.checkInRepository.findByUserIdAndEventId({ userId, eventId })
    if (alreadyChecked) throw new ConflictError("attendee already checked in event")
    const checkIn = CheckIn.create({ eventId, userId })
    await this.checkInRepository.save(checkIn)
    return {
      eventId,
      userId
    }
  }
}
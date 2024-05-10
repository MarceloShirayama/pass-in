import { ConflictError, NotFoundError } from "@shared/error";
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
    const eventUserWithEventId = await this.eventUserRepository.findAllByEventId(eventId)
    const numberOfAttendeesRegisteredInEvent = eventUserWithEventId.length
    const eventIsFull = (
      event.props.maximumAttendees?.value &&
      numberOfAttendeesRegisteredInEvent >= event.props.maximumAttendees.value
    )
    if (eventIsFull) throw new ConflictError("event is full")
    const alreadyExistsEventUser = await this.eventUserRepository.findByUserIdAndEventId({ userId, eventId })
    if (alreadyExistsEventUser) {
      throw new ConflictError("attendee is already registered for this event")
    }
    await this.eventUserRepository.save({ eventId, userId })
    return {
      eventId,
      userId
    }
  }
}
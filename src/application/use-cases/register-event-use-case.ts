import { ConflictError } from "@/shared/error";
import { CreateEventIn, Event } from "@domain/entities";
import { EventRepository } from "../repositories";

type RegisterEventIn = CreateEventIn

export type RegisterEventOut = {
  id: string
  title: string
  slug: string
  details?: string
  maximumAttendees?: number
  createdAt: string
}

export class RegisterEventUseCase {
  constructor(
    private readonly eventRepository: EventRepository
  ) { }

  async execute(input: RegisterEventIn): Promise<RegisterEventOut> {
    const alreadyExistsEventWithSameTitle = await this.eventRepository
      .findByTitle(input.title as string)

    if (alreadyExistsEventWithSameTitle) {
      throw new ConflictError("title already exists")
    }
    const event = Event.create(input)
    await this.eventRepository.save(event)
    return {
      id: event.props.id,
      title: event.props.title.value,
      slug: event.props.slug,
      details: event.props.details?.value,
      maximumAttendees: event.props.maximumAttendees?.value,
      createdAt: event.props.createdAt
    }
  }
}

import { InvalidParamError, NotFoundError } from "@/shared/error";
import { EventRepository } from "@application/repositories";
import { Event } from "@domain/entities";

export type ViewEventIn = {
  id?: unknown
  title?: unknown
}

export type ViewEventOut = {
  id: string
  title: string
  slug: string
  details?: string
  maximumAttendees?: number
  createdAt: string
}

export class ViewEventUseCase {
  constructor(
    private eventRepository: EventRepository
  ) { }

  async execute(input: ViewEventIn): Promise<ViewEventOut | null> {
    let event: Event | null

    if (input.id) {
      event = await this.eventRepository.findById(input.id)
    } else {
      event = await this.eventRepository.findByTitle(input.title)
    }
    return !event ? null : {
      id: event.props.id,
      title: event.props.title.value,
      slug: event.props.slug,
      details: event.props.details?.value,
      maximumAttendees: event.props.maximumAttendees?.value,
      createdAt: event.props.createdAt
    }
  }
}
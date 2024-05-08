import { InternalServerError, NotFoundError } from "@shared/error";
import { UserRepository, EventUserRepository, EventRepository } from "@application/repositories";

type Events = {
  title: string
  slug: string
  details?: string
}

type ViewAttendeeBadgeOut = {
  badge: {
    name: string
    email: string
    username: string
    events: Events[]
  }
}

export class ViewAttendeeBadgeUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly eventUserRepository: EventUserRepository,
    private readonly eventRepository: EventRepository
  ) { }

  async execute(attendeeId: string): Promise<ViewAttendeeBadgeOut> {
    let events: Events[] = []
    const attendee = await this.userRepository.findById(attendeeId)
    if (!attendee) throw new NotFoundError('Attendee not found')

    const eventsUser = await this.eventUserRepository.findAllByUserId(attendeeId)

    if (eventsUser.length > 0) {
      for (const eventUser of eventsUser) {
        const eventId = eventUser.props.eventId
        const event = await this.eventRepository.findById(eventId)
        if (!event) throw new InternalServerError(`event id ${eventId} not found`)
        events.push({
          title: event.props.title.value,
          slug: event.props.slug,
          details: event.props.details?.value
        })
      }
    }

    return {
      badge: {
        name: attendee.props.name.value,
        email: attendee.props.email.value,
        username: attendee.props.username.value,
        events
      }
    }
  }
}
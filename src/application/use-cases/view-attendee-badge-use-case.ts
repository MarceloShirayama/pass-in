import { InternalServerError, NotFoundError } from "@shared/error";
import { UserRepository, EventUserRepository, EventRepository } from "@application/repositories";

type ViewAttendeeBadgeOut = {
  badge: {
    name: string
    email: string
    username: string
    events: {
      title: string
    }[]
  }
}

export class ViewAttendeeBadgeUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly eventUserRepository: EventUserRepository,
    private readonly eventRepository: EventRepository
  ) { }

  async execute(attendeeId: string): Promise<ViewAttendeeBadgeOut> {
    const attendee = await this.userRepository.findById(attendeeId)
    if (!attendee) throw new NotFoundError('Attendee not found')

    const eventsUser = await this.eventUserRepository.findAllByUserId(attendeeId)
    if (eventsUser.length === 0) throw new NotFoundError('Events not found')

    const eventsId = eventsUser.map(eventUser => eventUser.props.eventId)

    const events = await Promise.all(eventsId.map(async eventId => {
      const event = await this.eventRepository.findById(eventId)
      if (!event) throw new InternalServerError(`Event ${eventId} not found`)
      return {
        title: event.props.title.value
      }
    }))

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
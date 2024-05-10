import { EventUser } from "@domain/entities";
import { EventUserRepository } from "@application/repositories";
import { ConflictError } from "@/shared/error";

class InMemoryEventUserRepository implements EventUserRepository {
  #eventUser: EventUser[] = []

  async save(eventUser: EventUser): Promise<void> {
    this.#eventUser.push(eventUser)
  }
  async findAllByUserId(userId: string): Promise<EventUser[]> {
    const eventUser = this.#eventUser.filter(
      eventUser => eventUser.props.userId === userId
    )
    return eventUser
  }
  async findAllByEventId(eventId: string): Promise<EventUser[]> {
    const eventUser = this.#eventUser.filter(
      eventUser => eventUser.props.eventId === eventId
    )
    return eventUser
  }
  async findByUserIdAndEventId(
    { userId, eventId }: { userId: string, eventId: string }
  ): Promise<EventUser | null> {
    const eventUser = this.#eventUser.find(
      eventUser => (
        eventUser.props.userId === userId &&
        eventUser.props.eventId === eventId
      )
    )
    if (!eventUser) {
      return null
    }
    return eventUser
  }

  async clear(): Promise<void> {
    this.#eventUser = []
  }
}

export const inMemoryEventUserRepository = new InMemoryEventUserRepository()
import { EventRepository } from "@/application/repositories";
import { Event } from "@domain/entities";

class InMemoryEventRepository implements EventRepository {
  private events: Event[] = []

  async save(event: Event): Promise<void> {
    this.events.push(event)
  }

  async findByTitle(title: unknown): Promise<Event | null> {
    const event = this.events.find(event => event.props.title.value === title)
    if (!event) {
      return null
    }
    return event
  }

  async findById(id: unknown): Promise<Event | null> {
    const event = this.events.find(event => event.props.id === id)
    if (!event) {
      return null
    }
    return event
  }

  async clear(): Promise<void> {
    this.events = []
  }
}

export const inMemoryEventRepository = new InMemoryEventRepository()
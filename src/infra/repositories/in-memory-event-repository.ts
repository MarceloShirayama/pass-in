import { EventRepository } from "@/application/repositories";
import { Event } from "@domain/entities";

class InMemoryEventRepository implements EventRepository {
  private events: Event[] = []

  async save(event: Event): Promise<void> {
    this.events.push(event)
  }

  async findByTitle(title: string): Promise<Event | null> {
    const event = this.events.find(event => event.props.title.value === title)
    if (!event) {
      return null
    }
    return event
  }
}

export const inMemoryEventRepository = new InMemoryEventRepository()
import { Event } from "@domain/entities";

export type EventRepository = {
  save(event: Event): Promise<void>
  findByTitle(id: string): Promise<Event | null>
}
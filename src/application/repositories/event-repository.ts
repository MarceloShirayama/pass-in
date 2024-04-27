import { Event } from "@domain/entities";

export type EventRepository = {
  save(event: Event): Promise<void>
  findByTitle(title: string): Promise<Event | null>
  findById(id: string): Promise<Event | null>
}
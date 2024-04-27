import { Event } from "@domain/entities";

export type EventRepository = {
  save(event: Event): Promise<void>
  findByTitle(title: unknown): Promise<Event | null>
  findById(id: unknown): Promise<Event | null>
}
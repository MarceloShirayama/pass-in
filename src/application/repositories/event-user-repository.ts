import { EventUser } from "@domain/entities"

export type EventUserRepository = {
  save(eventUser: EventUser): Promise<void>
  findAllByUserId(userId: string): Promise<EventUser[]>
  findAllByEventId(eventId: string): Promise<EventUser[]>
  findByUserIdAndEventId({ userId, eventId }: { userId: string, eventId: string }): Promise<EventUser | null>
}
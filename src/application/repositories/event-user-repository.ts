import { EventUser } from "@domain/entities"

export type EventUserRepository = {
  save({ eventId, userId }: { eventId: string, userId: string }): Promise<void>
  findAllByUserId(userId: string): Promise<EventUser[]>
  findAllByEventId(eventId: string): Promise<EventUser[]>
  findByUserIdAndEventId({ userId, eventId }: { userId: string, eventId: string }): Promise<EventUser | null>
}
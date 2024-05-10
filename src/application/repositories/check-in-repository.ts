import { CheckIn } from "@domain/entities";

export type CheckInRepository = {
  save(input: CheckIn): Promise<void>
  findAllByUserId(userId: string): Promise<CheckIn[]>
  findAllByEventId(eventId: string): Promise<CheckIn[]>
  findByUserIdAndEventId({ userId, eventId }: { userId: string, eventId: string }): Promise<CheckIn | null>
}
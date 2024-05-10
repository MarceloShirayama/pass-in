import { CheckIn } from "@domain/entities";
import { CheckInRepository } from "@application/repositories";

class InMemoryCheckInRepository implements CheckInRepository {
  #checkIns: CheckIn[] = []

  async save(input: CheckIn): Promise<void> {
    this.#checkIns.push(input)
  }
  async findAllByUserId(userId: string): Promise<CheckIn[]> {
    const checkIn = this.#checkIns.filter(
      checkIn => checkIn.props.userId === userId
    )
    return checkIn
  }
  async findAllByEventId(eventId: string): Promise<CheckIn[]> {
    const checkIn = this.#checkIns.filter(
      checkIn => checkIn.props.eventId === eventId
    )
    return checkIn
  }
  async findByUserIdAndEventId({ userId, eventId }: { userId: string; eventId: string; }): Promise<CheckIn | null> {
    const checkIn = this.#checkIns.find(
      checkIn => (
        checkIn.props.userId === userId &&
        checkIn.props.eventId === eventId
      )
    )
    if (!checkIn) {
      return null
    }
    return checkIn
  }

  async clear(): Promise<void> {
    this.#checkIns = []
  }
}

export const inMemoryCheckInRepository = new InMemoryCheckInRepository()
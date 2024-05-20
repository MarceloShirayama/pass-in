import { CheckInRepository } from "@application/repositories";
import { CheckIn } from "@domain/entities";
import { Connection } from "@infra/database";

export class CheckInDatabaseRepository implements CheckInRepository {
  constructor(private readonly connection: Connection) { }

  async save(checkIn: CheckIn): Promise<void> {
    const { event_id, user_id, created_at } = this.#fromDomainToDatabase(checkIn)
    await this.connection.query(
      /*sql*/`
        INSERT INTO tb_check_in
        (event_id, user_id, created_at)
        VALUES ($1, $2, $3)
      `,
      [event_id, user_id, created_at]
    )
  }

  async findAllByUserId(userId: string): Promise<CheckIn[]> {
    const checkInData = await this.connection.query(
      /*sql*/`
        SELECT * FROM tb_check_in
        WHERE user_id = $1
      `,
      [userId]
    )
    return checkInData.map(checkIn => this.#fromDatabaseToDomain(checkIn))
  }

  async findAllByEventId(eventId: string): Promise<CheckIn[]> {
    const checkInData = await this.connection.query(
      /*sql*/`
        SELECT * FROM tb_check_in
        WHERE event_id = $1
      `,
      [eventId]
    )
    return checkInData.map(checkIn => this.#fromDatabaseToDomain(checkIn))
  }

  async findByUserIdAndEventId({ userId, eventId }: { userId: string; eventId: string; }): Promise<CheckIn | null> {
    const [checkInData] = await this.connection.query(
      /*sql*/`
        SELECT * FROM tb_check_in
        WHERE user_id = $1
        AND event_id = $2
      `,
      [userId, eventId]
    )
    if (!checkInData) return null
    return this.#fromDatabaseToDomain(checkInData)
  }

  #fromDatabaseToDomain(data: any): CheckIn {
    return CheckIn.restore({
      eventId: data.event_id,
      userId: data.user_id,
      createdAt: data.created_at
    })
  }

  #fromDomainToDatabase(data: CheckIn): any {
    return {
      event_id: data.props.eventId,
      user_id: data.props.userId,
      created_at: data.props.createdAt
    }
  }
}
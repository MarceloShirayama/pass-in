import { EventUserRepository } from "@application/repositories";
import { EventUser } from "@domain/entities";
import { Connection } from "@infra/database";

export class EventUserDatabaseRepository implements EventUserRepository {

  constructor(private readonly connection: Connection) { }

  async save(eventUser: EventUser): Promise<void> {
    const { event_id, user_id, created_at } = this.#fromDomainToDatabase(eventUser)
    await this.connection.query(
      /*sql*/`
        INSERT INTO tb_event_user
        (event_id, user_id, created_at)
        VALUES ($1, $2, $3)
      `,
      [event_id, user_id, created_at]
    )
  }

  async findAllByUserId(userId: string): Promise<EventUser[]> {
    const eventUserData = await this.connection.query(
      /*sql*/`
        SELECT * FROM tb_event_user
        WHERE user_id = $1
      `,
      [userId]
    )
    return eventUserData.map(eventUser => this.#fromDatabaseToDomain(eventUser))
  }

  async findAllByEventId(eventId: string): Promise<EventUser[]> {
    const eventUserData = await this.connection.query(
      /*sql*/`
        SELECT * FROM tb_event_user
        WHERE event_id = $1
      `,
      [eventId]
    )
    return eventUserData.map(eventUser => this.#fromDatabaseToDomain(eventUser))
  }

  async findByUserIdAndEventId({ userId, eventId }: { userId: string, eventId: string }): Promise<EventUser | null> {
    const [eventUserData] = await this.connection.query(
      /*sql*/`
        SELECT * FROM tb_event_user
        WHERE user_id = $1
        AND event_id = $2
      `,
      [userId, eventId]
    )
    if (!eventUserData) return null
    return this.#fromDatabaseToDomain(eventUserData)
  }

  #fromDatabaseToDomain(eventUserData: any): EventUser {
    return EventUser.restore({
      userId: eventUserData.user_id,
      eventId: eventUserData.event_id,
      createdAt: eventUserData.created_at
    })
  }

  #fromDomainToDatabase(eventUser: EventUser): any {
    return {
      user_id: eventUser.props.userId,
      event_id: eventUser.props.eventId,
      created_at: eventUser.props.createdAt
    }
  }
}
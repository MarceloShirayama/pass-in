import { Event } from "@/domain/entities";
import { EventRepository } from "@application/repositories";
import { Connection } from "@infra/database";

export class EventDatabaseRepository implements EventRepository {
  constructor(private readonly connection: Connection) { }

  async save(event: Event): Promise<void> {
    const {
      event_id, title, details, maximum_attendees, slug, created_at
    } = this.#fromDomainToDatabase(event)

    await this.connection.query(
      /*sql*/`
        INSERT INTO tb_event
        (event_id, title, details, maximum_attendees, slug, created_at)
        VALUES ($1, $2, $3, $4, $5, $6)
      `,
      [event_id, title, details, maximum_attendees, slug, created_at]
    )
  }
  async findByTitle(title: unknown): Promise<Event | null> {
    const [userData] = await this.connection.query(
      /*sql*/`
        SELECT * FROM tb_event
        WHERE title = $1
      `,
      [title]
    )

    if (!userData) {
      return null
    }
    return this.#fromDatabaseToDomain(userData)
  }
  async findById(id: unknown): Promise<Event | null> {
    const [userData] = await this.connection.query(
      /*sql*/`
        SELECT * FROM tb_event
        WHERE event_id = $1
      `,
      [id]
    )

    if (!userData) {
      return null
    }
    return this.#fromDatabaseToDomain(userData)
  }

  #fromDatabaseToDomain(eventData: any) {
    return Event.restore({
      id: eventData.event_id,
      title: eventData.title,
      details: eventData.details,
      maximumAttendees: eventData.maximum_attendees,
      createdAt: eventData.created_at
    })
  }

  #fromDomainToDatabase(event: Event) {
    const { id, title, details, maximumAttendees, slug, createdAt } = event.props
    return {
      event_id: id,
      title: title.value,
      details: details?.value,
      maximum_attendees: maximumAttendees?.value,
      slug,
      created_at: createdAt
    }
  }
}
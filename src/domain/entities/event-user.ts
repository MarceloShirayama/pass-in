import { randomUUID } from "node:crypto";

type EventUserProps = {
  eventId: string
  userId: string
  createdAt: string
}

type CreateEventUser = {
  eventId: string
  userId: string
}
export class EventUser {
  #eventId: string
  #userId: string
  #createdAt: string

  private constructor(
    props: EventUserProps
  ) {
    this.#eventId = props.eventId
    this.#userId = props.userId
    this.#createdAt = props.createdAt
  }

  static create(props: CreateEventUser) {
    const id = randomUUID()
    return new EventUser({
      eventId: props.eventId,
      userId: props.userId,
      createdAt: new Date().toISOString()
    })
  }

  static restore(props: EventUserProps) {
    return new EventUser(props)
  }

  get props() {
    return {
      eventId: this.#eventId,
      userId: this.#userId,
      createdAt: this.#createdAt
    }
  }
}
import { randomUUID } from "node:crypto";
import { StringVO, EmailVO } from "@domain/value-objects";

type AttendeeProps = {
  id: string
  name: StringVO
  email: EmailVO
  eventId: string
  createdAt: string
}

type CreateAttendeeIn = {
  name: string
  email: string
  eventId: string
}

export class Attendee {
  #id: string
  #name: StringVO
  #email: EmailVO
  #eventId: string
  #createdAt: string

  constructor(props: AttendeeProps) {
    this.#id = props.id
    this.#name = props.name
    this.#email = props.email
    this.#eventId = props.eventId
    this.#createdAt = props.createdAt
  }

  get props() {
    return {
      id: this.#id,
      name: this.#name,
      email: this.#email,
      eventId: this.#eventId,
      createdAt: this.#createdAt
    }
  }

  static create({ name, email, eventId }: CreateAttendeeIn) {
    return new Attendee({
      id: randomUUID(),
      name: StringVO.create({
        paramName: 'name',
        value: name,
        minLength: 3,
        maxLength: 255
      }),
      email: EmailVO.create(email),
      eventId,
      createdAt: new Date().toISOString()
    })
  }

  static restore({
    id, name, email, eventId, createdAt
  }: CreateAttendeeIn & { id: string, createdAt: string }
  ) {
    return new Attendee({
      id,
      name: StringVO.create({ paramName: 'name', value: name }),
      email: EmailVO.create(email),
      eventId,
      createdAt
    })
  }

  static equals(obj1: unknown, obj2: unknown) {
    if (
      obj1 instanceof Attendee === false || obj2 instanceof Attendee === false
    ) {
      throw new Error("Attendee must be an instance of Attendee class")
    }
    const isEquals = obj1.props.id === obj2.props.id
    return isEquals
  }
}

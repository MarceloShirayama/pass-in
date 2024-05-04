import { randomUUID } from "node:crypto";

import { PositiveNumberVO, StringVO } from "@domain/value-objects";
import { slugifyText } from "@/shared/utils";

type EventProps = {
  id: string
  title: StringVO
  slug: string
  details: StringVO | null
  maximumAttendees: PositiveNumberVO | null
  createdAt: string
}

export type CreateEventIn = {
  title: unknown
  details?: unknown
  maximumAttendees?: unknown
}

export class Event {
  #id: string
  #title: StringVO
  #slug: string
  #details: StringVO | null
  #maximumAttendees: PositiveNumberVO | null
  #createdAt: string

  private constructor(props: EventProps) {
    this.#id = props.id
    this.#title = props.title
    this.#slug = props.slug
    this.#details = props.details
    this.#maximumAttendees = props.maximumAttendees
    this.#createdAt = props.createdAt
  }

  get props() {
    return {
      id: this.#id,
      title: this.#title,
      slug: this.#slug,
      details: this.#details,
      maximumAttendees: this.#maximumAttendees,
      createdAt: this.#createdAt
    }
  }

  static create(input: CreateEventIn) {
    return new Event({
      id: randomUUID(),
      title: StringVO.create(
        { paramName: "title", value: input.title, maxLength: 50, minLength: 3 }
      ),
      slug: slugifyText(input.title),
      details: input.details ? StringVO.create(
        { paramName: "details", value: input.details }
      ) : null,
      maximumAttendees: (input.maximumAttendees || Number.isFinite(input.maximumAttendees)) ?
        PositiveNumberVO.create(
          { paramName: "maximumAttendees", value: input.maximumAttendees }
        ) :
        null,
      createdAt: new Date().toISOString()
    })
  }

  static restore(input: CreateEventIn & { id: string, createdAt: string }) {
    return new Event({
      id: input.id,
      title: StringVO.create({ paramName: 'title', value: input.title }),
      slug: slugifyText(input.title),
      details:
        input.details ?
          StringVO.create({ paramName: 'details', value: input.details }) :
          null,
      maximumAttendees:
        input.maximumAttendees ?
          PositiveNumberVO.create(
            { paramName: 'maximumAttendees', value: input.maximumAttendees }
          ) :
          null,
      createdAt: input.createdAt
    })
  }

  static equals(obj1: unknown, obj2: unknown) {
    if ((obj1 instanceof Event === false) || (obj2 instanceof Event === false)) {
      throw new Error("Event must be an instance of Event class");
    }
    const isEquals = obj1.props.id === obj2.props.id
    return isEquals
  }
}
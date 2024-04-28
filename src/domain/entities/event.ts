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

export type RestoreEventIn = {
  id: string
  title: unknown
  slug: unknown
  details?: unknown
  maximumAttendees?: unknown
  createdAt: string
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

  static #valueOjectHandler(
    {
      title, details, maximumAttendees
    }: { title: unknown, details?: unknown, maximumAttendees?: unknown }
  ) {
    return {
      titleVO: StringVO.create(
        { paramName: "title", value: title, maxLength: 50, minLength: 3 }
      ),
      slugVO: slugifyText(title as string),
      detailsVO: details ? StringVO.create(
        { paramName: "details", value: details }
      ) : null,
      maximumAttendeesVO:
        (maximumAttendees || Number.isFinite(maximumAttendees)) ?
          PositiveNumberVO.create(
            { paramName: "maximumAttendees", value: maximumAttendees }
          ) :
          null
    }
  }

  static create(input: CreateEventIn) {
    const id = randomUUID()
    const {
      titleVO, slugVO, detailsVO, maximumAttendeesVO
    } = Event.#valueOjectHandler(input)
    return new Event({
      id,
      title: titleVO,
      slug: slugVO,
      details: detailsVO,
      maximumAttendees: maximumAttendeesVO,
      createdAt: new Date().toISOString()
    })
  }

  static restore(input: RestoreEventIn) {
    const {
      titleVO, slugVO, detailsVO, maximumAttendeesVO
    } = Event.#valueOjectHandler({
      title: input.title,
      details: input.details,
      maximumAttendees: input.maximumAttendees
    })
    return new Event({
      id: input.id,
      title: titleVO,
      slug: slugVO,
      details: detailsVO,
      maximumAttendees: maximumAttendeesVO,
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
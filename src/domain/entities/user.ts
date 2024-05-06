import { randomUUID } from "node:crypto";

import { PasswordVO, StringVO, EmailVO } from "@domain/value-objects"

export const Role = {
  "ORGANIZER": "ORGANIZER",
  "ATTENDEE": "ATTENDEE"
} as const

export type Role = keyof typeof Role

type UserProps = {
  id: string
  name: StringVO
  email: EmailVO
  username: StringVO
  password: PasswordVO
  role: Role
  createdAt: string
}

export type CreateUserIn = {
  name: unknown
  email: unknown
  username: unknown
  password: unknown
}

export type RestoreUserIn = {
  id: string
  name: unknown
  email: unknown
  username: unknown
  password: unknown
  role: Role
  createdAt: string
}

export class User {
  #id: string
  #name: StringVO
  #email: EmailVO
  #username: StringVO
  #password: PasswordVO
  #role: Role
  #createdAt: string

  private constructor(props: UserProps) {
    this.#id = props.id
    this.#name = props.name
    this.#email = props.email
    this.#username = props.username
    this.#password = props.password
    this.#role = props.role
    this.#createdAt = props.createdAt
  }

  get props() {
    return {
      id: this.#id,
      name: this.#name,
      email: this.#email,
      username: this.#username,
      password: this.#password,
      role: this.#role,
      createdAt: this.#createdAt
    }
  }

  static create(input: CreateUserIn) {
    return new User({
      id: randomUUID(),
      name: StringVO.create({ paramName: 'name', value: input.name }),
      email: EmailVO.create(input.email),
      username: StringVO.create({ paramName: 'username', value: input.username }),
      password: PasswordVO.create({
        value: input.password,
        minLength: 8,
        maxLength: 50
      }),
      role: 'ATTENDEE',
      createdAt: new Date().toISOString()
    })
  }

  static restore(input: RestoreUserIn) {
    return new User({
      id: input.id,
      name: StringVO.create({ paramName: 'name', value: input.name }),
      email: EmailVO.create(input.email),
      username: StringVO.create({ paramName: 'username', value: input.username }),
      password: PasswordVO.restore(input.password),
      role: input.role,
      createdAt: input.createdAt
    })
  }

  set role(role: Role) {
    this.#role = role
  }

  static equals(obj1: unknown, obj2: unknown): boolean {
    if (obj1 instanceof User === false || obj2 instanceof User === false) {
      throw new Error("User must be an instance of User class");
    }
    const isEquals = obj1.props.id === obj2.props.id
    return isEquals
  }
}
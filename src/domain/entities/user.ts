import { randomUUID } from "node:crypto";

import { PasswordVO, StringVO } from "../value-objects"

type UserProps = {
  id: string
  name: StringVO
  username: StringVO
  password: PasswordVO
  createdAt: string
}

export type CreateUserIn = {
  name: unknown
  username: unknown
  password: unknown
}

export type RestoreUserIn = {
  id: string
  name: unknown
  username: unknown
  password: unknown
  createdAt: string
}

export class User {
  #id: string
  #name: StringVO
  #username: StringVO
  #password: PasswordVO
  #createdAt: string

  private constructor(props: UserProps) {
    this.#id = props.id
    this.#name = props.name
    this.#username = props.username
    this.#password = props.password
    this.#createdAt = props.createdAt
  }

  get props() {
    return {
      id: this.#id,
      name: this.#name,
      username: this.#username,
      password: this.#password,
      createdAt: this.#createdAt
    }
  }

  static #valueObjectHandler({ name, username, password }:
    { name: unknown, username: unknown, password: unknown }) {
    return {
      name: StringVO.create({
        paramName: 'name',
        value: name,
        minLength: 3,
        maxLength: 100
      }),
      username: StringVO.create({
        paramName: 'username',
        value: username,
        minLength: 3,
        maxLength: 50
      }),
      password: PasswordVO.create({
        value: password,
        minLength: 8,
        maxLength: 20
      })
    }
  }

  static create(input: CreateUserIn) {
    const id = randomUUID()
    const { name, username, password } = User.#valueObjectHandler(input)
    return new User({
      id,
      name,
      username,
      password,
      createdAt: new Date().toISOString()
    })
  }

  static restore(input: RestoreUserIn) {
    const { name, username, password } = User.#valueObjectHandler(input)
    return new User({
      id: input.id,
      name,
      username,
      password,
      createdAt: input.createdAt
    })
  }

  static equals(obj1: unknown, obj2: unknown) {
    if (obj1 instanceof User === false || obj2 instanceof User === false) {
      throw new Error("User must be an instance of User class");
    }
    const isEquals = obj1.props.id === obj2.props.id
    return isEquals
  }
}
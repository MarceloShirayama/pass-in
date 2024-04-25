import { InvalidParamError } from "@/shared/error"

type StringVOIn = {
  paramName: string
  value: unknown
  maxLength?: number
  minLength?: number
}

export class StringVO {
  #value: string

  private constructor(value: string) {
    this.#value = value
  }

  get value() {
    return this.#value
  }

  static create(input: StringVOIn) {
    const validInput = this.#validate(input)
    return new StringVO(validInput)
  }

  static #validate(input: StringVOIn) {
    if (!input.value) throw new Error(`${input.paramName} is required`)
    if (typeof input.value !== "string")
      throw new InvalidParamError(`${input.paramName} must be a string`)
    if (input.maxLength && input.value.length > input.maxLength)
      throw new InvalidParamError(
        `${input.paramName} must be less than ${input.maxLength} characters`
      )
    if (input.minLength && input.value.length < input.minLength)
      throw new InvalidParamError(
        `${input.paramName} must be greater than ${input.minLength} characters`
      )
    return input.value
  }
}
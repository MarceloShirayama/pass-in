import { InvalidParamError } from "@/shared/error"

type PositiveNumberVOIn = {
  paramName: string
  value: unknown
}

export class PositiveNumberVO {
  #value?: number

  private constructor(value: number) {
    this.#value = value
  }

  get value() {
    return this.#value
  }

  static create(input: PositiveNumberVOIn) {
    const validInput = this.#validate(input)
    return new PositiveNumberVO(validInput)
  }

  static #validate(input: PositiveNumberVOIn) {
    if (!input.value) throw new Error(`${input.paramName} is required`)
    if (typeof input.value !== 'number' || input.value <= 0) throw new InvalidParamError(
      `${input.paramName} must be a positive number`
    )
    return input.value
  }
}
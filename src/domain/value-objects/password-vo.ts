import { InvalidParamError } from "@/shared/error"

type PasswordVOIn = {
  value: unknown
  minLength?: number
  maxLength?: number
}

export class PasswordVO {
  #value: string

  private constructor(value: string) {
    this.#value = value
  }

  get value() {
    return this.#value
  }

  static create(input: PasswordVOIn) {
    const validInput = this.#checkPasswordStrength(input)
    return new PasswordVO(validInput)
  }

  static #checkPasswordStrength(input: PasswordVOIn): string {
    const hasUppercase = /[A-Z]/;
    const hasLowercase = /[a-z]/;
    const hasNumber = /[0-9]/;
    const hasSpecialChar = /[^\w\s]/;
    const { value, minLength, maxLength } = input
    if (!value || value === "" || value === null) {
      throw new InvalidParamError("password is required")
    }
    if (typeof value !== "string") {
      throw new InvalidParamError("password must be a string")
    }
    if (minLength && maxLength) {
      if (value.length < minLength || value.length > maxLength) {
        throw new InvalidParamError(`password length must be between ${minLength} and ${maxLength} characters`)

      }
    }
    if (!hasUppercase.test(value) || !hasLowercase.test(value)) {
      throw new InvalidParamError("password must contain at least one uppercase letter and one lowercase letter")

    }
    if (!hasNumber.test(value) || !hasSpecialChar.test(value)) {
      throw new InvalidParamError("password must contain at least one number and one special character")
    }
    return value;
  }
}
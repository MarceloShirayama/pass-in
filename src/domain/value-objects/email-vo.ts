import { InvalidParamError } from "@/shared/error";
import { EmailValidator } from "@shared/utils";

export class EmailVO {
  #email: string

  constructor(email: string) {
    this.#email = email
  }

  static create(email: unknown) {
    if (typeof email !== "string" || !EmailValidator.isValid(email)) {
      throw new InvalidParamError("invalid email")
    }
    return new EmailVO(email)
  }

  get value() {
    return this.#email
  }
}
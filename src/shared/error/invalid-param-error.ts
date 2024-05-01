import { CustomError } from "./custom-error";

export class InvalidParamError extends CustomError {
  statusCode: number

  constructor(message: string) {
    super();
    this.message = message
    this.name = "InvalidParamError"
    this.statusCode = 400
  }
}
export class InvalidParamError extends Error {
  statusCode: number

  constructor(message: string) {
    super();
    this.message = message
    this.name = "InvalidParamError"
    this.statusCode = 400
  }
}
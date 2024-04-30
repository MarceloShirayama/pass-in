export class InternalServerError extends Error {
  statusCode: number;

  constructor(message: string) {
    super();
    this.message = message;
    this.statusCode = 500
    this.name = "InternalServerError";
  }
}
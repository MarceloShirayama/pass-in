export class InternalServerError extends Error {
  statusCode: number;

  constructor() {
    super();
    this.message = "Internal Server Error";
    this.statusCode = 500
    this.name = "InternalServerError";
  }
}
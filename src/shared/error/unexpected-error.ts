export class UnexpectedError extends Error {
  statusCode: number;

  constructor() {
    super();
    this.message = "An unexpected error occurred, contact support";
    this.statusCode = 500
    this.name = "UnexpectedError";
  }
}
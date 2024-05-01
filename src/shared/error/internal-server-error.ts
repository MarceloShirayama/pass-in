import { CustomError } from "./custom-error";

export class InternalServerError extends CustomError {
  statusCode: number;

  constructor(message: string) {
    super();
    this.message = message;
    this.statusCode = 500
    this.name = "InternalServerError";
  }
}
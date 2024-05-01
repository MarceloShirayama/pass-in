import { CustomError } from "./custom-error";

export class ConflictError extends CustomError {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.name = "ConflictError";
    this.statusCode = 409
  }
}
import {
  ConflictError,
  CustomError,
  InternalServerError,
  InvalidParamError,
  NotFoundError,
  UnexpectedError
} from ".";
import { logMessage } from "@shared/utils";

export function handleErrors(error: CustomError) {
  let errorResponse;
  switch (error.constructor) {
    case NotFoundError:
    case InvalidParamError:
    case ConflictError:
      errorResponse = {
        name: error.name,
        message: error.message,
        status: error.statusCode
      };
      break;
    case InternalServerError:
      errorResponse = {
        name: error.name,
        status: error.statusCode,
        message: "An internal server error occurred, contact support",
        stack: error.stack
      };
      logMessage(errorResponse, "ERROR")
      break;
    default:
      const unexpectedError = new UnexpectedError();
      errorResponse = {
        name: unexpectedError.name,
        status: unexpectedError.statusCode,
        message: unexpectedError.message,
        stack: unexpectedError.stack
      };
      logMessage(errorResponse, "ERROR")
      break;
  }
  return errorResponse
}
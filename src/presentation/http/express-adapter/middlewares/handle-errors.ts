import { Express, NextFunction, Request, Response } from "express";

import {
  ConflictError,
  CustomError,
  InternalServerError,
  InvalidParamError,
  NotFoundError,
  UnexpectedError
} from "@/shared/error";
import { logMessage } from "@/shared/utils";

export function handleErrorsMiddleware(app: Express) {
  app.use((error: CustomError, req: Request, res: Response, next: NextFunction) => {
    let response;
    switch (error.constructor) {
      case NotFoundError:
      case InvalidParamError:
      case ConflictError:
        response = {
          name: error.name,
          message: error.message,
          status: error.statusCode
        };
        break;
      case InternalServerError:
        response = {
          name: error.name,
          status: error.statusCode,
          message: "An internal server error occurred, contact support",
          stack: error.stack
        };
        logMessage(response, "ERROR")
        break;
      default:
        const unexpectedError = new UnexpectedError();
        response = {
          name: unexpectedError.name,
          status: unexpectedError.statusCode,
          message: unexpectedError.message,
          stack: unexpectedError.stack
        };
        logMessage(response, "ERROR")
        break;
    }

    return res.status(response.status).send(
      {
        error: {
          name: response.name,
          message: response.message
        }
      }
    );
  });
}
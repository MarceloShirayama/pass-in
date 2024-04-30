import express, { NextFunction, Request, Response } from "express";

import { ConflictError, InternalServerError, InvalidParamError, NotFoundError, UnexpectedError } from "@/shared/error";
import { eventsRouter } from "@presentation/http/routes";

export const app = express();

app.use(express.json());
app.use('/events', eventsRouter)

app.use((req, res, next) => {
  const error = new NotFoundError("route not found");
  console.log(error);
  next(error);
})
app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  if (
    error instanceof NotFoundError ||
    error instanceof InvalidParamError ||
    error instanceof ConflictError
  ) {
    return res.status(error.statusCode).send(
      {
        error: {
          name: error.name,
          message: error.message
        }
      }
    )
  } else if (error instanceof InternalServerError) {
    console.log({
      error: {
        name: error.name,
        message: error.message
      }
    });
    return res.status(error.statusCode).send(
      {
        error: {
          name: error.name,
          message: "An internal server error occurred, contact support"
        }
      }
    )
  } else {
    console.log(error);
    const errorServer = new UnexpectedError()
    res.status(errorServer.statusCode).send(
      {
        error: {
          name: errorServer.name,
          message: errorServer.message
        }
      }
    )
  }
});

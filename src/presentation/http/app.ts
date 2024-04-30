import express, { NextFunction, Request, Response } from "express";

import { InternalServerError, InvalidParamError, NotFoundError, UnexpectedError } from "@/shared/error";
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
    error instanceof InvalidParamError
  ) {
    return res.status(error.statusCode).send({ error: error.message })
  } else if (error instanceof InternalServerError) {
    console.log(error);
    return res.status(error.statusCode).send({ error: error.message })
  } else {
    console.log(error);
    const errorServer = new UnexpectedError()
    res.status(errorServer.statusCode).send({ error: errorServer.message })
  }
});

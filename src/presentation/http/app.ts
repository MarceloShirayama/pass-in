import express, { NextFunction, Request, Response } from "express";

import { InternalServerError, NotFoundError } from "@/shared/error";
import { eventsRouter } from "@presentation/http/routes";

export const app = express();

app.use(express.json());
app.use('/events', eventsRouter)

app.use((req, res, next) => {
  const error = new NotFoundError("route not found");
  next(error);
})
app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  if (error instanceof NotFoundError) {
    return res.status(error.statusCode).send({ error: error.message })
  }
});
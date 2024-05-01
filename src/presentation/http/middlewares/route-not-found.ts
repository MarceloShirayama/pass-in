import { Express } from "express";

import { NotFoundError } from "@/shared/error";

export function routeNotFoundMiddleware<T>(app: Express) {
  app.use((req, res, next) => {
    const error = new NotFoundError("route not found");
    next(error);
  })
}


import { Express, NextFunction, Request, Response } from "express";

import {
  CustomError,
  handleErrors
} from "@/shared/error";

export function handleErrorsMiddleware(app: Express) {
  app.use((error: CustomError, req: Request, res: Response, next: NextFunction) => {
    const errorResponse = handleErrors(error);
    return res.status(errorResponse.status).send(
      {
        error: {
          name: errorResponse.name,
          message: errorResponse.message
        }
      }
    );
  });
}
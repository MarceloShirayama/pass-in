import {
  InvalidParamError, NotFoundError
} from "@/shared/error";
import { ViewEventUseCase } from "@application/use-cases";
import { Repositories } from "@application/repositories";
import { Router } from "express";

export function getByTitle(repositories: Repositories) {
  const router = Router();

  const { eventRepository } = repositories

  router.get("/search", async (req, res, next) => {
    try {
      const title = req.query.title
      if (!title) throw new InvalidParamError("title is required")
      const viewEvent = new ViewEventUseCase(eventRepository);
      const output = await viewEvent.execute({ title });
      if (!output) throw new NotFoundError("event not found")
      res.status(200).send(output);
    } catch (error) {
      next(error)
    }
  })
  return router
}


import { ViewEventUseCase } from "@application/use-cases";
import { inMemoryEventRepository, inMemoryUserRepository } from "@infra/repositories";
import {
  InvalidParamError, NotFoundError
} from "@/shared/error";
import { Router } from "express";
import { authMiddleware } from "../../middlewares";
import { JWTAdapter } from "@shared/utils";
import { Repositories } from "@infra/factories";

export function getById(repositories: Repositories) {
  const { eventRepository, userRepository } = repositories;
  const router = Router();
  const jwt = new JWTAdapter();

  router.get(
    "/:id/search",
    authMiddleware({
      jwt,
      userRepository,
      allowedRoles: ["ORGANIZER"]
    }),
    async (req, res, next) => {
      try {
        const id = req.params.id
        if (!id) throw new InvalidParamError("id is required")
        const viewEvent = new ViewEventUseCase(eventRepository);
        const output = await viewEvent.execute({ id });
        if (!output) throw new NotFoundError("event not found")
        res.status(200).send(output);
      } catch (error) {
        next(error)
      }
    })

  return router
}


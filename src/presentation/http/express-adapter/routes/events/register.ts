import { Router } from "express";

import { RegisterEventUseCase } from "@/application/use-cases";
import { JWTAdapter } from "@/shared/utils";
import { Repositories } from "@infra/factories";
import { authMiddleware } from "@presentation/http/express-adapter/middlewares";

export function register(repositories: Repositories) {
  const router = Router();
  const { eventRepository, userRepository } = repositories
  const jwt = new JWTAdapter();

  router.post(
    "/register",
    authMiddleware({
      jwt,
      userRepository,
      allowedRoles: ["ORGANIZER"]
    }),
    async (req, res, next) => {
      try {
        const registerEvent = new RegisterEventUseCase(eventRepository);
        const input = req.body;
        input.maximumAttendees && !isNaN(parseInt(input.maximumAttendees)) && (input.maximumAttendees = Number(input.maximumAttendees))
        const output = await registerEvent.execute(input);
        res.status(201).send(output);
      } catch (error) {
        next(error)
      }
    });
  return router
}

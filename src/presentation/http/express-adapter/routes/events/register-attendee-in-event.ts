import { Router } from "express";

import { RegisterAttendeeInEventUseCase } from "@application/use-cases";
import { Repositories } from "@infra/factories";
import { authMiddleware } from "@presentation/http/express-adapter/middlewares";
import { JWTAdapter } from "@shared/utils";

export function registerAttendeeInEvent(repositories: Repositories) {
  const router = Router();
  const { userRepository, eventUserRepository, eventRepository } = repositories
  const registerAttendee = new RegisterAttendeeInEventUseCase(
    eventUserRepository,
    eventRepository
  );
  const jwt = new JWTAdapter();

  router.post(
    "/:eventId/attendees",
    authMiddleware({
      jwt,
      userRepository,
      allowedRoles: ["ORGANIZER", "ATTENDEE"]
    }),
    async (req, res, next) => {
      try {
        const token = req.headers.authorization?.replace("Bearer ", "");
        const payload = await new JWTAdapter().verify(token!);
        const userId = payload.id;
        const eventId = req.params.eventId;
        const output = await registerAttendee.execute({
          eventId, userId
        });
        res.status(201).send(output);
      } catch (error) {
        next(error)
      }
    })

  return router
}

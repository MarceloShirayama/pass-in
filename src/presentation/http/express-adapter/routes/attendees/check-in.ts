import { Router } from "express";

import { CheckInRepository, EventUserRepository, UserRepository } from "@application/repositories";
import { CheckInUseCase } from "@application/use-cases";
import { authMiddleware } from "@presentation/http/express-adapter/middlewares";
import { JWTAdapter } from "@shared/utils";
import { Repositories } from "@infra/factories";

export function checkIn(repositories: Repositories) {
  const router = Router();
  const jwt = new JWTAdapter();
  const { userRepository, checkInRepository, eventUserRepository } = repositories

  router.post(
    "/:attendeeId/check-in",
    authMiddleware({
      jwt,
      userRepository,
      allowedRoles: ["ORGANIZER", "ATTENDEE"]
    }),
    async (req, res, next) => {
      try {
        const token = req.headers.authorization?.replace('Bearer ', '');
        const payload = await jwt.verify(token!);
        const userId = payload.id;
        const { eventId } = req.body

        const checkIn = new CheckInUseCase(
          checkInRepository,
          eventUserRepository
        );
        const output = await checkIn.execute({
          eventId, userId
        });
        res.status(200).send(output);
      } catch (error) {
        next(error)
      }
    })
  return router
}
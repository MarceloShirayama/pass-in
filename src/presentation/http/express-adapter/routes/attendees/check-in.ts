import { Router } from "express";

import { CheckInUseCase } from "@application/use-cases";
import {
  inMemoryUserRepository,
  inMemoryCheckInRepository,
  inMemoryEventUserRepository
} from "@infra/repositories";
import { JWTAdapter } from "@shared/utils";
import { authMiddleware } from "@presentation/http/express-adapter/middlewares";

export const checkIn = Router();

const jwt = new JWTAdapter();
const userRepository = inMemoryUserRepository
const checkInRepository = inMemoryCheckInRepository
const eventUserRepository = inMemoryEventUserRepository

checkIn.post(
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
import { Router } from "express";

import { RegisterAttendeeInEventUseCase } from "@application/use-cases";
import {
  inMemoryEventRepository,
  inMemoryUserRepository,
  inMemoryEventUserRepository
} from "@infra/repositories";
import { JWTAdapter } from "@shared/utils";
import { authMiddleware } from "@presentation/http/express-adapter/middlewares";

export const registerAttendeeInEvent = Router();

const eventRepository = inMemoryEventRepository;
const userRepository = inMemoryUserRepository;
const eventUserRepository = inMemoryEventUserRepository;
const jwt = new JWTAdapter();
const registerAttendee = new RegisterAttendeeInEventUseCase(
  eventUserRepository,
  eventRepository
);

registerAttendeeInEvent.post(
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
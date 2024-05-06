import { Router } from "express";

import { RegisterEventUseCase } from "@/application/use-cases";
import { inMemoryEventRepository, inMemoryUserRepository } from "@/infra/repositories";
import { JWTAdapter } from "@/shared/utils";
import { authMiddleware } from "@presentation/http/express-adapter/middlewares";

export const register = Router();

const eventRepository = inMemoryEventRepository;
const userRepository = inMemoryUserRepository;
const jwt = new JWTAdapter();

register.post(
  "/register",
  authMiddleware({
    jwt,
    userRepository,
    allowedRoles: ["ORGANIZER"]
  }),
  async (req, res, next) => {
    try {
      const registerEvent = new RegisterEventUseCase(eventRepository);
      const output = await registerEvent.execute(req.body);
      res.status(201).send(output);
    } catch (error) {
      next(error)
    }
  });
import { Router } from "express";

import { UserRepository } from "@application/repositories";
import { RegisterUserAttendeeUseCase } from "@application/use-cases";
import { Repositories } from "@application/repositories";

export function register(repositories: Repositories) {
  const router = Router();
  const { userRepository } = repositories

  router.post("/register", async (req, res, next) => {
    try {
      const registerUser = new RegisterUserAttendeeUseCase(userRepository);
      await registerUser.execute(req.body);
      res.status(201).send({
        message: "user created"
      });
    } catch (error) {
      next(error)
    }
  })

  return router
}
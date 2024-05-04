import { Router } from "express";

import { RegisterUserUseCase } from "@application/use-cases";
import { inMemoryUserRepository } from "@infra/repositories";

export const usersRouter = Router();

const userRepository = inMemoryUserRepository;

usersRouter.post("/register", async (req, res, next) => {
  try {
    const registerUser = new RegisterUserUseCase(userRepository);
    await registerUser.execute(req.body);
    res.status(201).send({
      message: "user created"
    });
  } catch (error) {
    next(error)
  }
})
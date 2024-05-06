import { Router } from "express";

import { UserLoginUseCase } from "@/application/use-cases";
import { inMemoryUserRepository } from "@infra/repositories";
import { JWTAdapter } from "@shared/utils";

export const login = Router();

const userRepository = inMemoryUserRepository;
const jwt = new JWTAdapter();

login.post("/login", async (req, res, next) => {
  try {
    const userLogin = new UserLoginUseCase(userRepository, jwt);
    const output = await userLogin.execute(req.body.username, req.body.password);
    res.status(200).send(output);
  } catch (error) {
    next(error)
  }
})

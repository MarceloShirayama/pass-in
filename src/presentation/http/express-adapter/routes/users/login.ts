import { Router } from "express";

import { UserLoginUseCase } from "@application/use-cases";
import { Repositories } from "@infra/factories";
import { JWTAdapter } from "@shared/utils";

export function login(repositories: Repositories) {
  const router = Router();

  const { userRepository } = repositories
  const jwt = new JWTAdapter();

  router.post("/login", async (req, res, next) => {
    try {
      const userLogin = new UserLoginUseCase(userRepository, jwt);
      const output = await userLogin.execute(req.body.username, req.body.password);
      res.status(200).send(output);
    } catch (error) {
      next(error)
    }
  })

  return router
}

import { Router } from 'express'

import { ViewAttendeesUseCase } from "@application/use-cases";
import { inMemoryUserRepository } from "@infra/repositories";
import { authMiddleware } from '../../middlewares';
import { JWTAdapter } from '@shared/utils';
import { Repositories } from '@infra/factories';

export function viewAttendees(repositories: Repositories) {
  const router = Router();

  const { userRepository } = repositories;
  const jwt = new JWTAdapter()

  router.get(
    '/',
    authMiddleware({
      jwt,
      userRepository,
      allowedRoles: ['ORGANIZER']
    }),
    async (req, res, next) => {
      try {
        const viewAttendees = new ViewAttendeesUseCase(userRepository);
        const output = await viewAttendees.execute();
        res.status(200).send(output);
      } catch (error) {
        next(error)
      }
    })

  return router
}


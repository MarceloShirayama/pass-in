import { Router } from 'express';

import {
  EventRepository, EventUserRepository, UserRepository
} from '@application/repositories';
import { ViewAttendeeBadgeUseCase } from '@application/use-cases';
import { authMiddleware } from "@presentation/http/express-adapter/middlewares";
import { JWTAdapter } from '@shared/utils';
import { Repositories } from '@infra/factories';

export function viewAttendeeBadge(repositories: Repositories) {
  const router = Router()
  const {
    userRepository,
    eventUserRepository,
    eventRepository
  } = repositories
  const viewAttendeeBadgeUseCase = new ViewAttendeeBadgeUseCase(
    userRepository,
    eventUserRepository,
    eventRepository
  )
  const jwt = new JWTAdapter()

  router.get(
    '/badge',
    authMiddleware({
      jwt,
      userRepository,
      allowedRoles: ['ORGANIZER', 'ATTENDEE']
    }),
    async (req, res, next) => {
      try {
        const token = req.headers.authorization?.replace('Bearer ', '');
        const payload = await jwt.verify(token!);
        const attendeeId = payload.id
        const output = await viewAttendeeBadgeUseCase.execute(attendeeId)
        res.status(200).send(output)
      }
      catch (error) {
        next(error)
      }
    }
  )
  return router
}

import { Router } from 'express'

import { ViewAttendeeBadgeUseCase } from '@application/use-cases'
import { inMemoryEventRepository, inMemoryEventUserRepository, inMemoryUserRepository } from '@/infra/repositories'
import { JWTAdapter } from '@shared/utils'
import { authMiddleware } from "@presentation/http/express-adapter/middlewares";

export const viewAttendeeBadge = Router()

const userRepository = inMemoryUserRepository
const eventUserRepository = inMemoryEventUserRepository
const eventRepository = inMemoryEventRepository
const viewAttendeeBadgeUseCase = new ViewAttendeeBadgeUseCase(
  userRepository,
  eventUserRepository,
  eventRepository
)
const jwt = new JWTAdapter()

viewAttendeeBadge.get(
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
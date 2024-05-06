import { Router } from 'express'

import { ViewAttendeesUseCase } from "@application/use-cases";
import { inMemoryUserRepository } from "@infra/repositories";
import { authMiddleware } from '../../middlewares';
import { JWTAdapter } from '@/shared/utils';

export const viewAttendees = Router();

const userRepository = inMemoryUserRepository;
const jwt = new JWTAdapter()

viewAttendees.get(
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

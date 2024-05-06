import { NextFunction, Request, Response } from "express";

import { JWTPort } from "@application/jwt";
import { ForbiddenError, UnauthorizedError } from "@shared/error";
import { UserRepository } from "@/application/repositories";
import { Role } from "@/domain/entities";

export const authMiddleware = (
  { jwt, userRepository, allowedRoles }
    : { jwt: JWTPort, userRepository: UserRepository, allowedRoles: Role[] }
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');
      if (!token) throw new UnauthorizedError("No token provided");
      const payload = await jwt.verify(token);
      if (!payload) throw new UnauthorizedError("Not authorized");
      const userId = payload.id;
      const user = await userRepository.findById(userId);
      if (!user) throw new UnauthorizedError("User not found");
      if (!allowedRoles.includes(user.props.role)) throw new ForbiddenError("Access denied");
      return next();
    } catch (error) {
      return next(
        error
      )
    }
  };
}
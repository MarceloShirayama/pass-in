import jwt from "jsonwebtoken";

import { JWT_CONFIG } from "@/_config/settings";
import { JWTPort } from "@/application/jwt";
import { InternalServerError, UnauthorizedError } from "@/shared/error";

type JWTData = {
  id: string
}

const { SECRET_KEY, EXPIRES_IN } = JWT_CONFIG

export class JWTAdapter implements JWTPort<JWTData> {
  async sign(data: JWTData): Promise<string> {
    if (!SECRET_KEY)
      throw new InternalServerError("JsonWebToken.JWT_SECRET is not defined")
    return jwt.sign(data, SECRET_KEY, {
      expiresIn: EXPIRES_IN,
    })
  }

  async verify(token: string): Promise<JWTData> {
    try {
      if (!SECRET_KEY)
        throw new InternalServerError("JsonWebToken.JWT_SECRET is not defined")
      const decoded = jwt.verify(token, SECRET_KEY)
      if (
        typeof decoded !== 'object' ||
        !decoded.hasOwnProperty('id') ||
        typeof decoded.id !== 'string'
      )
        throw new InternalServerError("Invalid token: decoded is not a JWTData")
      return decoded as JWTData
    } catch (error) {
      throw new UnauthorizedError("Invalid token")
    }
  }
}

import jwt, { SignOptions } from "jsonwebtoken";
import { createHash } from "crypto";
import { TokenServicePort, TokenPayload } from "../../domain/ports/TokenServicePort";
import { env } from "../config/env";

export class JwtTokenService implements TokenServicePort {
  generateAccessToken(payload: TokenPayload): string {
    const options: SignOptions = {
      expiresIn: env.JWT_ACCESS_EXPIRES_IN as any,
    };
    return jwt.sign(payload as object, env.JWT_ACCESS_SECRET, options);
  }

  generateRefreshToken(payload: TokenPayload): string {
    const options: SignOptions = {
      expiresIn: env.JWT_REFRESH_EXPIRES_IN as any,
    };
    return jwt.sign(payload as object, env.JWT_REFRESH_SECRET, options);
  }

  verifyAccessToken(token: string): TokenPayload {
    return jwt.verify(token, env.JWT_ACCESS_SECRET) as TokenPayload;
  }

  verifyRefreshToken(token: string): TokenPayload {
    return jwt.verify(token, env.JWT_REFRESH_SECRET) as TokenPayload;
  }

  async hashToken(token: string): Promise<string> {
    return createHash("sha256").update(token).digest("hex");
  }
}

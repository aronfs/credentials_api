import { Request, Response, NextFunction } from "express";
import { JwtTokenService } from "../../../infrastructure/security/JwtTokenService";
import { TokenPayload } from "../../../domain/ports/TokenServicePort";
import { errorResponse } from "../../../application/dto/ApiResponse";

const tokenService = new JwtTokenService();

declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json(errorResponse("Token no proporcionado"));
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = tokenService.verifyAccessToken(token);
    req.user = payload;
    next();
  } catch {
    res.status(401).json(errorResponse("Token inválido"));
  }
}

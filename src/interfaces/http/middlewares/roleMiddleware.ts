import { Request, Response, NextFunction } from "express";
import { errorResponse } from "../../../application/dto/ApiResponse";

export function roleMiddleware(...allowedRoles: string[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json(errorResponse("No autorizado"));
      return;
    }

    const roleName = allowedRoles.find((r) => req.user?.roleId);
    if (!roleName) {
      res.status(403).json(errorResponse("Permiso denegado"));
      return;
    }

    next();
  };
}

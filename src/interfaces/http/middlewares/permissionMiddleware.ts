import { Request, Response, NextFunction } from "express";
import { errorResponse } from "../../../application/dto/ApiResponse";

export function permissionMiddleware(...requiredPermissions: string[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json(errorResponse("No autorizado"));
      return;
    }

    const hasPermission = requiredPermissions.some((permission) =>
      req.user!.permissions.includes(permission)
    );

    if (!hasPermission) {
      res.status(403).json(errorResponse("Permiso denegado"));
      return;
    }

    next();
  };
}

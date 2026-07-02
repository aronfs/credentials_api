import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { errorResponse } from "../../../application/dto/ApiResponse";
import { env } from "../../../infrastructure/config/env";

export function errorMiddleware(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (err instanceof ZodError) {
    res.status(400).json(
      errorResponse("Error de validación", err.errors.map((e) => ({
        field: e.path.join("."),
        message: e.message,
      })))
    );
    return;
  }

  const statusCode = getStatusCode(err.message);

  res.status(statusCode).json(
    errorResponse(
      err.message,
      env.NODE_ENV === "development" ? [{ stack: err.stack }] : undefined
    )
  );
}

function getStatusCode(message: string): number {
  const errorMap: Record<string, number> = {
    "Credenciales inválidas": 401,
    "Usuario inactivo": 401,
    "Refresh token inválido o expirado": 401,
    "Sesión no encontrada o revocada": 401,
    "El email ya está registrado": 409,
    "Usuario no encontrado": 404,
    "Rol no encontrado": 404,
    "Credencial no encontrada": 404,
    "Categoría no encontrada": 404,
    "El rol ya existe": 409,
    "PIN no configurado": 400,
    "No autorizado": 401,
    "Token no proporcionado": 401,
    "Token inválido": 401,
    "Permiso denegado": 403,
    "No tienes permiso para ver esta contraseña": 403,
    "No se pudo descifrar la contraseña": 500,
  };

  return errorMap[message] || 400;
}

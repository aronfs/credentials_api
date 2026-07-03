import multer from "multer";
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

  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      res.status(400).json(errorResponse("PROFILE_IMAGE_TOO_LARGE"));
      return;
    }
    res.status(400).json(errorResponse(err.code));
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
    "PIN actual incorrecto": 400,
    "El nuevo PIN debe tener entre 4 y 6 dígitos": 400,
    "Contraseña actual incorrecta": 400,
    "La nueva contraseña debe tener al menos 8 caracteres": 400,
    "La longitud debe estar entre 8 y 64 caracteres": 400,
    "Debe incluir al menos un tipo de caracter": 400,
    "La contraseña no puede estar vacía": 400,
    "El nombre debe tener al menos 2 caracteres": 400,
    "El nombre no puede tener más de 80 caracteres": 400,
    "PROFILE_IMAGE_FILE_REQUIRED": 400,
    "PROFILE_IMAGE_INVALID_TYPE": 400,
    "PROFILE_IMAGE_INVALID_EXTENSION": 400,
    "PROFILE_IMAGE_TOO_LARGE": 400,
    "PROFILE_IMAGE_STORAGE_ERROR": 500,
    "PROFILE_IMAGE_DATABASE_ERROR": 500,
    "PROFILE_IMAGE_NOT_FOUND": 404,
    "PROFILE_IMAGE_DELETE_ERROR": 500,
  };

  return errorMap[message] || 400;
}

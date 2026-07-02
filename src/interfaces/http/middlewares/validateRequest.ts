import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";
import { errorResponse } from "../../../application/dto/ApiResponse";

export function validateRequest(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const parsed = schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      req.body = parsed.body;
      req.query = parsed.query;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json(
          errorResponse(
            "Error de validación",
            error.errors.map((e) => ({
              field: e.path.join("."),
              message: e.message,
            }))
          )
        );
        return;
      }
      next(error);
    }
  };
}

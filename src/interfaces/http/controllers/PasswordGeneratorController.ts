import { Request, Response, NextFunction } from "express";
import { GeneratePasswordUseCase } from "../../../application/use-cases/security/GeneratePasswordUseCase";
import { EvaluatePasswordUseCase } from "../../../application/use-cases/security/EvaluatePasswordUseCase";
import { successResponse } from "../../../application/dto/ApiResponse";

export class PasswordGeneratorController {
  constructor(
    private generatePasswordUseCase: GeneratePasswordUseCase,
    private evaluatePasswordUseCase: EvaluatePasswordUseCase
  ) {}

  generate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = this.generatePasswordUseCase.execute(req.body);
      res.json(successResponse("Contraseña generada correctamente", result));
    } catch (error) {
      next(error);
    }
  };

  evaluate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = this.evaluatePasswordUseCase.execute(req.body.password);
      res.json(successResponse("Contraseña evaluada correctamente", result));
    } catch (error) {
      next(error);
    }
  };
}
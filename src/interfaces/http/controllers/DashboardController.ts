import { Request, Response, NextFunction } from "express";
import { GetDashboardUseCase } from "../../../application/use-cases/dashboard/GetDashboardUseCase";
import { successResponse } from "../../../application/dto/ApiResponse";

export class DashboardController {
  constructor(
    private getDashboardUseCase: GetDashboardUseCase
  ) {}

  getMain = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.getDashboardUseCase.execute(req.user!.userId);
      res.json(successResponse("Dashboard principal obtenido correctamente", result));
    } catch (error) {
      next(error);
    }
  };
}
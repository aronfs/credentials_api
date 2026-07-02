import { Request, Response, NextFunction } from "express";
import { ListSecurityLogsUseCase } from "../../../application/use-cases/security/ListSecurityLogsUseCase";
import { successResponse } from "../../../application/dto/ApiResponse";

export class SecurityLogController {
  constructor(private listSecurityLogsUseCase: ListSecurityLogsUseCase) {}

  findAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.listSecurityLogsUseCase.execute(
        req.user!.permissions.includes("security_logs:read") ? undefined : req.user!.userId
      );
      res.json(successResponse("Logs obtenidos correctamente", result));
    } catch (error) {
      next(error);
    }
  };
}

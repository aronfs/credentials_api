import { Request, Response, NextFunction } from "express";
import { GetProfileUseCase } from "../../../application/use-cases/profile/GetProfileUseCase";
import { UpdateProfileUseCase } from "../../../application/use-cases/profile/UpdateProfileUseCase";
import { ChangePinUseCase } from "../../../application/use-cases/profile/ChangePinUseCase";
import { ChangePasswordUseCase } from "../../../application/use-cases/profile/ChangePasswordUseCase";
import { successResponse } from "../../../application/dto/ApiResponse";

export class ProfileController {
  constructor(
    private getProfileUseCase: GetProfileUseCase,
    private updateProfileUseCase: UpdateProfileUseCase,
    private changePinUseCase: ChangePinUseCase,
    private changePasswordUseCase: ChangePasswordUseCase
  ) {}

  getMe = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.getProfileUseCase.execute(req.user!.userId);
      res.json(successResponse("Perfil obtenido correctamente", result));
    } catch (error) {
      next(error);
    }
  };

  updateMe = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.updateProfileUseCase.execute(
        req.user!.userId,
        req.body.name
      );
      res.json(successResponse("Perfil actualizado correctamente", { user: result }));
    } catch (error) {
      next(error);
    }
  };

  changePin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.changePinUseCase.execute(
        req.user!.userId,
        req.body.currentPin,
        req.body.newPin
      );
      res.json(successResponse("PIN actualizado correctamente"));
    } catch (error) {
      next(error);
    }
  };

  changePassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.changePasswordUseCase.execute(
        req.user!.userId,
        req.body.currentPassword,
        req.body.newPassword
      );
      res.json(successResponse("Contraseña actualizada correctamente"));
    } catch (error) {
      next(error);
    }
  };
}
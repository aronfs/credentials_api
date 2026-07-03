import { Request, Response, NextFunction } from "express";
import { UploadProfileImageUseCase } from "../../../application/use-cases/profile-image/UploadProfileImageUseCase";
import { GetProfileImageUseCase } from "../../../application/use-cases/profile-image/GetProfileImageUseCase";
import { GetProfileImageFileUseCase } from "../../../application/use-cases/profile-image/GetProfileImageFileUseCase";
import { DeleteProfileImageUseCase } from "../../../application/use-cases/profile-image/DeleteProfileImageUseCase";
import { successResponse, errorResponse } from "../../../application/dto/ApiResponse";

export class ProfileImageController {
  constructor(
    private uploadProfileImageUseCase: UploadProfileImageUseCase,
    private getProfileImageUseCase: GetProfileImageUseCase,
    private getProfileImageFileUseCase: GetProfileImageFileUseCase,
    private deleteProfileImageUseCase: DeleteProfileImageUseCase,
  ) {}

  getMyProfileImage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.getProfileImageUseCase.execute(req.user!.userId);
      if (!result) {
        res.json(successResponse("El usuario no tiene foto de perfil", null));
        return;
      }
      res.json(successResponse("Foto de perfil obtenida correctamente", result));
    } catch (error) {
      next(error);
    }
  };

  getMyProfileImageFile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.getProfileImageFileUseCase.execute(req.user!.userId);
      if (!result) {
        res.status(404).json(errorResponse("Foto de perfil no encontrada"));
        return;
      }
      res.setHeader("Content-Type", result.mimeType);
      res.sendFile(result.absolutePath);
    } catch (error) {
      next(error);
    }
  };

  uploadMyProfileImage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.file) {
        res.status(400).json(errorResponse("No se envió ningún archivo"));
        return;
      }
      const result = await this.uploadProfileImageUseCase.execute(req.user!.userId, req.file);
      res.json(successResponse("Foto de perfil actualizada correctamente", result));
    } catch (error) {
      next(error);
    }
  };

  deleteMyProfileImage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.deleteProfileImageUseCase.execute(req.user!.userId);
      res.json(successResponse("Foto de perfil eliminada correctamente"));
    } catch (error) {
      next(error);
    }
  };
}

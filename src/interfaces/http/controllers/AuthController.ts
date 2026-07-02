import { Request, Response, NextFunction } from "express";
import { RegisterUserUseCase } from "../../../application/use-cases/auth/RegisterUserUseCase";
import { LoginUseCase } from "../../../application/use-cases/auth/LoginUseCase";
import { RefreshTokenUseCase } from "../../../application/use-cases/auth/RefreshTokenUseCase";
import { LogoutUseCase } from "../../../application/use-cases/auth/LogoutUseCase";
import { VerifyPinUseCase } from "../../../application/use-cases/auth/VerifyPinUseCase";
import { successResponse } from "../../../application/dto/ApiResponse";

export class AuthController {
  constructor(
    private registerUserUseCase: RegisterUserUseCase,
    private loginUseCase: LoginUseCase,
    private refreshTokenUseCase: RefreshTokenUseCase,
    private logoutUseCase: LogoutUseCase,
    private verifyPinUseCase: VerifyPinUseCase
  ) {}

  register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.registerUserUseCase.execute(
        req.body,
        req.headers["user-agent"] || null,
        req.ip || null
      );
      res.status(201).json(successResponse("Usuario registrado correctamente", result));
    } catch (error) {
      next(error);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.loginUseCase.execute(
        req.body,
        req.headers["user-agent"] || null,
        req.ip || null
      );
      res.json(successResponse("Inicio de sesión exitoso", result));
    } catch (error) {
      next(error);
    }
  };

  refresh = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.refreshTokenUseCase.execute(req.body.refreshToken);
      res.json(successResponse("Token renovado correctamente", result));
    } catch (error) {
      next(error);
    }
  };

  logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.logoutUseCase.execute(
        req.body.refreshToken,
        req.ip || null,
        req.headers["user-agent"] || null
      );
      res.json(successResponse("Sesión cerrada correctamente"));
    } catch (error) {
      next(error);
    }
  };

  verifyPin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const isValid = await this.verifyPinUseCase.execute(req.user!.userId, req.body.pin);
      res.json(successResponse("PIN verificado", { isValid }));
    } catch (error) {
      next(error);
    }
  };
}

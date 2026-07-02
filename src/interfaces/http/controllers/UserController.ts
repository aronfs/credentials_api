import { Request, Response, NextFunction } from "express";
import { CreateUserUseCase } from "../../../application/use-cases/users/CreateUserUseCase";
import { ListUsersUseCase } from "../../../application/use-cases/users/ListUsersUseCase";
import { GetUserByIdUseCase } from "../../../application/use-cases/users/GetUserByIdUseCase";
import { UpdateUserUseCase } from "../../../application/use-cases/users/UpdateUserUseCase";
import { DeleteUserUseCase } from "../../../application/use-cases/users/DeleteUserUseCase";
import { successResponse } from "../../../application/dto/ApiResponse";

export class UserController {
  constructor(
    private createUserUseCase: CreateUserUseCase,
    private listUsersUseCase: ListUsersUseCase,
    private getUserByIdUseCase: GetUserByIdUseCase,
    private updateUserUseCase: UpdateUserUseCase,
    private deleteUserUseCase: DeleteUserUseCase
  ) {}

  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.createUserUseCase.execute(req.body);
      res.status(201).json(successResponse("Usuario creado correctamente", result));
    } catch (error) {
      next(error);
    }
  };

  findAll = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.listUsersUseCase.execute();
      res.json(successResponse("Usuarios obtenidos correctamente", result));
    } catch (error) {
      next(error);
    }
  };

  findById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.getUserByIdUseCase.execute(req.params.id);
      res.json(successResponse("Usuario obtenido correctamente", result));
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.updateUserUseCase.execute(req.params.id, req.body);
      res.json(successResponse("Usuario actualizado correctamente", result));
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.deleteUserUseCase.execute(req.params.id);
      res.json(successResponse("Usuario eliminado correctamente"));
    } catch (error) {
      next(error);
    }
  };
}

import { Request, Response, NextFunction } from "express";
import { CreateRoleUseCase } from "../../../application/use-cases/roles/CreateRoleUseCase";
import { ListRolesUseCase } from "../../../application/use-cases/roles/ListRolesUseCase";
import { UpdateRoleUseCase } from "../../../application/use-cases/roles/UpdateRoleUseCase";
import { DeleteRoleUseCase } from "../../../application/use-cases/roles/DeleteRoleUseCase";
import { AssignRoleUseCase } from "../../../application/use-cases/roles/AssignRoleUseCase";
import { successResponse } from "../../../application/dto/ApiResponse";

export class RoleController {
  constructor(
    private createRoleUseCase: CreateRoleUseCase,
    private listRolesUseCase: ListRolesUseCase,
    private updateRoleUseCase: UpdateRoleUseCase,
    private deleteRoleUseCase: DeleteRoleUseCase,
    private assignRoleUseCase: AssignRoleUseCase
  ) {}

  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.createRoleUseCase.execute(req.body);
      res.status(201).json(successResponse("Rol creado correctamente", result));
    } catch (error) {
      next(error);
    }
  };

  findAll = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.listRolesUseCase.execute();
      res.json(successResponse("Roles obtenidos correctamente", result));
    } catch (error) {
      next(error);
    }
  };

  findById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const roles = await this.listRolesUseCase.execute();
      const role = roles.find((r) => r.id === req.params.id);
      if (!role) {
        res.status(404).json({ success: false, message: "Rol no encontrado" });
        return;
      }
      res.json(successResponse("Rol obtenido correctamente", role));
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.updateRoleUseCase.execute(req.params.id, req.body);
      res.json(successResponse("Rol actualizado correctamente", result));
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.deleteRoleUseCase.execute(req.params.id);
      res.json(successResponse("Rol eliminado correctamente"));
    } catch (error) {
      next(error);
    }
  };

  assign = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.assignRoleUseCase.execute(req.body);
      res.json(successResponse("Rol asignado correctamente"));
    } catch (error) {
      next(error);
    }
  };
}

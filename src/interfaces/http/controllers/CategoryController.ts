import { Request, Response, NextFunction } from "express";
import { CreateCategoryUseCase } from "../../../application/use-cases/categories/CreateCategoryUseCase";
import { ListCategoriesUseCase } from "../../../application/use-cases/categories/ListCategoriesUseCase";
import { UpdateCategoryUseCase } from "../../../application/use-cases/categories/UpdateCategoryUseCase";
import { DeleteCategoryUseCase } from "../../../application/use-cases/categories/DeleteCategoryUseCase";
import { successResponse } from "../../../application/dto/ApiResponse";

export class CategoryController {
  constructor(
    private createCategoryUseCase: CreateCategoryUseCase,
    private listCategoriesUseCase: ListCategoriesUseCase,
    private updateCategoryUseCase: UpdateCategoryUseCase,
    private deleteCategoryUseCase: DeleteCategoryUseCase
  ) {}

  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.createCategoryUseCase.execute(
        { ...req.body, userId: req.user!.userId },
        req.ip || null,
        req.headers["user-agent"] || null
      );
      res.status(201).json(successResponse("Categoría creada correctamente", result));
    } catch (error) {
      next(error);
    }
  };

  findAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.listCategoriesUseCase.execute(req.user!.userId);
      res.json(successResponse("Categorías obtenidas correctamente", result));
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.updateCategoryUseCase.execute(
        req.params.id,
        req.user!.userId,
        req.body,
        req.ip || null,
        req.headers["user-agent"] || null
      );
      res.json(successResponse("Categoría actualizada correctamente", result));
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.deleteCategoryUseCase.execute(
        req.params.id,
        req.user!.userId,
        req.ip || null,
        req.headers["user-agent"] || null
      );
      res.json(successResponse("Categoría eliminada correctamente"));
    } catch (error) {
      next(error);
    }
  };
}

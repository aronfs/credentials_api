import { Request, Response, NextFunction } from "express";
import { CreateCredentialUseCase } from "../../../application/use-cases/credentials/CreateCredentialUseCase";
import { ListCredentialsUseCase } from "../../../application/use-cases/credentials/ListCredentialsUseCase";
import { GetCredentialByIdUseCase } from "../../../application/use-cases/credentials/GetCredentialByIdUseCase";
import { UpdateCredentialUseCase } from "../../../application/use-cases/credentials/UpdateCredentialUseCase";
import { DeleteCredentialUseCase } from "../../../application/use-cases/credentials/DeleteCredentialUseCase";
import { ToggleFavoriteCredentialUseCase } from "../../../application/use-cases/credentials/ToggleFavoriteCredentialUseCase";
import { SearchCredentialsUseCase } from "../../../application/use-cases/credentials/SearchCredentialsUseCase";
import { ViewCredentialPasswordUseCase } from "../../../application/use-cases/credentials/ViewCredentialPasswordUseCase";
import { FavoriteCredentialUseCase } from "../../../application/use-cases/credentials/FavoriteCredentialUseCase";
import { UnfavoriteCredentialUseCase } from "../../../application/use-cases/credentials/UnfavoriteCredentialUseCase";
import { ListFavoriteCredentialsUseCase } from "../../../application/use-cases/credentials/ListFavoriteCredentialsUseCase";
import { successResponse } from "../../../application/dto/ApiResponse";

export class CredentialController {
  constructor(
    private createCredentialUseCase: CreateCredentialUseCase,
    private listCredentialsUseCase: ListCredentialsUseCase,
    private getCredentialByIdUseCase: GetCredentialByIdUseCase,
    private updateCredentialUseCase: UpdateCredentialUseCase,
    private deleteCredentialUseCase: DeleteCredentialUseCase,
    private toggleFavoriteCredentialUseCase: ToggleFavoriteCredentialUseCase,
    private searchCredentialsUseCase: SearchCredentialsUseCase,
    private viewCredentialPasswordUseCase: ViewCredentialPasswordUseCase,
    private favoriteCredentialUseCase: FavoriteCredentialUseCase,
    private unfavoriteCredentialUseCase: UnfavoriteCredentialUseCase,
    private listFavoriteCredentialsUseCase: ListFavoriteCredentialsUseCase
  ) {}

  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.createCredentialUseCase.execute(
        { ...req.body, userId: req.user!.userId },
        req.ip || null,
        req.headers["user-agent"] || null
      );
      res.status(201).json(successResponse("Credencial creada correctamente", result));
    } catch (error) {
      next(error);
    }
  };

  findAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { categoryId, favorite } = req.query as { categoryId?: string; favorite?: string };
      const result = await this.listCredentialsUseCase.execute(
        req.user!.userId,
        categoryId,
        favorite === "true"
      );
      res.json(successResponse("Credenciales obtenidas correctamente", result));
    } catch (error) {
      next(error);
    }
  };

  findById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.getCredentialByIdUseCase.execute(
        req.params.id,
        req.user!.userId
      );
      res.json(successResponse("Credencial obtenida correctamente", result));
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.updateCredentialUseCase.execute(
        req.params.id,
        req.user!.userId,
        req.body,
        req.ip || null,
        req.headers["user-agent"] || null
      );
      res.json(successResponse("Credencial actualizada correctamente", result));
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.deleteCredentialUseCase.execute(
        req.params.id,
        req.user!.userId,
        req.ip || null,
        req.headers["user-agent"] || null
      );
      res.json(successResponse("Credencial eliminada correctamente"));
    } catch (error) {
      next(error);
    }
  };

  toggleFavorite = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.toggleFavoriteCredentialUseCase.execute(
        req.params.id,
        req.user!.userId
      );
      res.json(successResponse("Favorito actualizado correctamente", result));
    } catch (error) {
      next(error);
    }
  };

  favorite = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.favoriteCredentialUseCase.execute(
        req.params.id,
        req.user!.userId
      );
      res.json(successResponse("Credencial agregada a favoritos correctamente", result));
    } catch (error) {
      next(error);
    }
  };

  unfavorite = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.unfavoriteCredentialUseCase.execute(
        req.params.id,
        req.user!.userId
      );
      res.json(successResponse("Credencial quitada de favoritos correctamente", result));
    } catch (error) {
      next(error);
    }
  };

  listFavorites = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const search = req.query.search as string | undefined;

      const result = await this.listFavoriteCredentialsUseCase.execute(
        req.user!.userId,
        page,
        limit,
        search
      );
      res.json(successResponse("Credenciales favoritas obtenidas correctamente", result));
    } catch (error) {
      next(error);
    }
  };

  search = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const query = (req.query.q as string) || "";
      const result = await this.searchCredentialsUseCase.execute(req.user!.userId, query);
      res.json(successResponse("Búsqueda realizada correctamente", result));
    } catch (error) {
      next(error);
    }
  };

  viewPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.viewCredentialPasswordUseCase.execute(
        req.params.id,
        req.user!.userId,
        req.user!.roleId,
        req.ip || null,
        req.headers["user-agent"] || null
      );
      res.json(successResponse("Contraseña obtenida correctamente", result));
    } catch (error) {
      next(error);
    }
  };
}
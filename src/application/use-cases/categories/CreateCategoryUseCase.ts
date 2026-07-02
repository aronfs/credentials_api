import { CategoryRepositoryPort } from "../../../domain/ports/CategoryRepositoryPort";
import { SecurityLogRepositoryPort } from "../../../domain/ports/SecurityLogRepositoryPort";
import { SecurityLogAction } from "../../../domain/entities/SecurityLog";
import { Category, CategoryResponse } from "../../../domain/entities/Category";

export interface CreateCategoryDTO {
  userId: string;
  name: string;
  color?: string;
  icon?: string;
}

export class CreateCategoryUseCase {
  constructor(
    private categoryRepository: CategoryRepositoryPort,
    private securityLogRepository: SecurityLogRepositoryPort
  ) {}

  async execute(
    dto: CreateCategoryDTO,
    ip?: string | null,
    userAgent?: string | null
  ): Promise<CategoryResponse> {
    const category = await this.categoryRepository.create({
      userId: dto.userId,
      name: dto.name,
      color: dto.color,
      icon: dto.icon,
    });

    await this.securityLogRepository.create({
      userId: dto.userId,
      action: SecurityLogAction.CREATE_CATEGORY,
      ip: ip ?? null,
      userAgent: userAgent ?? null,
    });

    return {
      id: category.id,
      userId: category.userId,
      name: category.name,
      color: category.color,
      icon: category.icon,
      isActive: category.isActive,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
    };
  }
}

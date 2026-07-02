import { CategoryRepositoryPort } from "../../../domain/ports/CategoryRepositoryPort";
import { SecurityLogRepositoryPort } from "../../../domain/ports/SecurityLogRepositoryPort";
import { SecurityLogAction } from "../../../domain/entities/SecurityLog";
import { CategoryResponse } from "../../../domain/entities/Category";

export interface UpdateCategoryDTO {
  name?: string;
  color?: string;
  icon?: string;
  isActive?: boolean;
}

export class UpdateCategoryUseCase {
  constructor(
    private categoryRepository: CategoryRepositoryPort,
    private securityLogRepository: SecurityLogRepositoryPort
  ) {}

  async execute(
    id: string,
    userId: string,
    dto: UpdateCategoryDTO,
    ip?: string | null,
    userAgent?: string | null
  ): Promise<CategoryResponse> {
    const existingCategory = await this.categoryRepository.findByIdAndUserId(id, userId);
    if (!existingCategory) {
      throw new Error("Categoría no encontrada");
    }

    const category = await this.categoryRepository.update(id, dto);
    if (!category) {
      throw new Error("Error al actualizar categoría");
    }

    await this.securityLogRepository.create({
      userId,
      action: SecurityLogAction.UPDATE_CATEGORY,
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

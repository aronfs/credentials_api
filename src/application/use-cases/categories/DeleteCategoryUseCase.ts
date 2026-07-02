import { CategoryRepositoryPort } from "../../../domain/ports/CategoryRepositoryPort";
import { SecurityLogRepositoryPort } from "../../../domain/ports/SecurityLogRepositoryPort";
import { SecurityLogAction } from "../../../domain/entities/SecurityLog";

export class DeleteCategoryUseCase {
  constructor(
    private categoryRepository: CategoryRepositoryPort,
    private securityLogRepository: SecurityLogRepositoryPort
  ) {}

  async execute(
    id: string,
    userId: string,
    ip?: string | null,
    userAgent?: string | null
  ): Promise<void> {
    const category = await this.categoryRepository.findByIdAndUserId(id, userId);
    if (!category) {
      throw new Error("Categoría no encontrada");
    }

    await this.categoryRepository.delete(id);

    await this.securityLogRepository.create({
      userId,
      action: SecurityLogAction.DELETE_CATEGORY,
      ip: ip ?? null,
      userAgent: userAgent ?? null,
    });
  }
}

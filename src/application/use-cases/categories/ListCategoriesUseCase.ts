import { CategoryRepositoryPort } from "../../../domain/ports/CategoryRepositoryPort";
import { CategoryResponse } from "../../../domain/entities/Category";

export class ListCategoriesUseCase {
  constructor(private categoryRepository: CategoryRepositoryPort) {}

  async execute(userId: string): Promise<CategoryResponse[]> {
    const categories = await this.categoryRepository.findAllByUserId(userId);
    return categories.map((cat) => ({
      id: cat.id,
      userId: cat.userId,
      name: cat.name,
      color: cat.color,
      icon: cat.icon,
      isActive: cat.isActive,
      createdAt: cat.createdAt,
      updatedAt: cat.updatedAt,
    }));
  }
}

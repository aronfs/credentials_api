import { CategoryRepositoryPort } from "../../../domain/ports/CategoryRepositoryPort";
import { CredentialRepositoryPort } from "../../../domain/ports/CredentialRepositoryPort";
import { CategoryResponse } from "../../../domain/entities/Category";

export class ListCategoriesUseCase {
  constructor(
    private categoryRepository: CategoryRepositoryPort,
    private credentialRepository: CredentialRepositoryPort,
  ) {}

  async execute(userId: string): Promise<CategoryResponse[]> {
    const [categories, categoryCounts] = await Promise.all([
      this.categoryRepository.findAllByUserId(userId),
      this.credentialRepository.countCredentialsByCategory(userId),
    ]);

    const countMap = new Map<string, number>();
    for (const cc of categoryCounts) {
      if (cc.categoryId) {
        countMap.set(cc.categoryId, cc.count);
      }
    }

    return categories.map((cat) => ({
      id: cat.id,
      userId: cat.userId,
      name: cat.name,
      color: cat.color,
      icon: cat.icon,
      isActive: cat.isActive,
      createdAt: cat.createdAt,
      updatedAt: cat.updatedAt,
      totalCredentials: countMap.get(cat.id) ?? 0,
    }));
  }
}

import { CategoryRepositoryPort } from "../../../../domain/ports/CategoryRepositoryPort";
import { Category, CreateCategoryInput, UpdateCategoryInput } from "../../../../domain/entities/Category";
import { getPrismaClient } from "../PrismaClient";

export class PrismaCategoryRepository implements CategoryRepositoryPort {
  async create(input: CreateCategoryInput): Promise<Category> {
    const prisma = getPrismaClient();
    const category = await prisma.category.create({ data: input });
    return this.mapToEntity(category);
  }

  async findAllByUserId(userId: string): Promise<Category[]> {
    const prisma = getPrismaClient();
    const categories = await prisma.category.findMany({
      where: { userId, isActive: true },
      orderBy: { name: "asc" },
    });
    return categories.map(this.mapToEntity);
  }

  async findById(id: string): Promise<Category | null> {
    const prisma = getPrismaClient();
    const category = await prisma.category.findUnique({ where: { id } });
    return category ? this.mapToEntity(category) : null;
  }

  async findByIdAndUserId(id: string, userId: string): Promise<Category | null> {
    const prisma = getPrismaClient();
    const category = await prisma.category.findFirst({
      where: { id, userId },
    });
    return category ? this.mapToEntity(category) : null;
  }

  async update(id: string, input: UpdateCategoryInput): Promise<Category | null> {
    const prisma = getPrismaClient();
    const category = await prisma.category.update({
      where: { id },
      data: input,
    });
    return category ? this.mapToEntity(category) : null;
  }

  async delete(id: string): Promise<boolean> {
    const prisma = getPrismaClient();
    try {
      await prisma.category.delete({ where: { id } });
      return true;
    } catch {
      return false;
    }
  }

  async countByUserId(userId: string): Promise<number> {
    const prisma = getPrismaClient();
    return prisma.category.count({ where: { userId, isActive: true } });
  }

  private mapToEntity(category: any): Category {
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
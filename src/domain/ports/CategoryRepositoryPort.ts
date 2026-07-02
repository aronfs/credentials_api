import { Category, CreateCategoryInput, UpdateCategoryInput } from "../entities/Category";

export interface CategoryRepositoryPort {
  create(input: CreateCategoryInput): Promise<Category>;
  findAllByUserId(userId: string): Promise<Category[]>;
  findById(id: string): Promise<Category | null>;
  findByIdAndUserId(id: string, userId: string): Promise<Category | null>;
  update(id: string, input: UpdateCategoryInput): Promise<Category | null>;
  delete(id: string): Promise<boolean>;
}

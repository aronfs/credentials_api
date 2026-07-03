export interface Category {
  id: string;
  userId: string;
  name: string;
  color: string;
  icon: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCategoryInput {
  userId: string;
  name: string;
  color?: string;
  icon?: string;
}

export interface UpdateCategoryInput {
  name?: string;
  color?: string;
  icon?: string;
  isActive?: boolean;
}

export interface CategoryResponse {
  id: string;
  userId: string;
  name: string;
  color: string;
  icon: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  totalCredentials: number;
}

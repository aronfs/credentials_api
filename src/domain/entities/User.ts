export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  pinHash: string | null;
  roleId: string;
  biometricEnabled: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserInput {
  name: string;
  email: string;
  passwordHash: string;
  pinHash?: string | null;
  roleId: string;
}

export interface UpdateUserInput {
  name?: string;
  email?: string;
  passwordHash?: string;
  pinHash?: string | null;
  roleId?: string;
  biometricEnabled?: boolean;
  isActive?: boolean;
}

export interface UserResponse {
  id: string;
  name: string;
  email: string;
  roleId: string;
  biometricEnabled: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

import { UserRepositoryPort } from "../../../../domain/ports/UserRepositoryPort";
import { User, CreateUserInput, UpdateUserInput } from "../../../../domain/entities/User";
import { getPrismaClient } from "../PrismaClient";

export class PrismaUserRepository implements UserRepositoryPort {
  async create(input: CreateUserInput): Promise<User> {
    const prisma = getPrismaClient();
    const user = await prisma.user.create({
      data: {
        name: input.name,
        email: input.email,
        passwordHash: input.passwordHash,
        pinHash: input.pinHash ?? null,
        roleId: input.roleId,
      },
    });
    return this.mapToEntity(user);
  }

  async findAll(): Promise<User[]> {
    const prisma = getPrismaClient();
    const users = await prisma.user.findMany();
    return users.map(this.mapToEntity);
  }

  async findById(id: string): Promise<User | null> {
    const prisma = getPrismaClient();
    const user = await prisma.user.findUnique({ where: { id } });
    return user ? this.mapToEntity(user) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const prisma = getPrismaClient();
    const user = await prisma.user.findUnique({ where: { email } });
    return user ? this.mapToEntity(user) : null;
  }

  async update(id: string, input: UpdateUserInput): Promise<User | null> {
    const prisma = getPrismaClient();
    const user = await prisma.user.update({
      where: { id },
      data: {
        ...(input.name !== undefined && { name: input.name }),
        ...(input.email !== undefined && { email: input.email }),
        ...(input.passwordHash !== undefined && { passwordHash: input.passwordHash }),
        ...(input.pinHash !== undefined && { pinHash: input.pinHash }),
        ...(input.roleId !== undefined && { roleId: input.roleId }),
        ...(input.biometricEnabled !== undefined && { biometricEnabled: input.biometricEnabled }),
        ...(input.isActive !== undefined && { isActive: input.isActive }),
      },
    });
    return this.mapToEntity(user);
  }

  async delete(id: string): Promise<boolean> {
    const prisma = getPrismaClient();
    try {
      await prisma.user.delete({ where: { id } });
      return true;
    } catch {
      return false;
    }
  }

  async count(): Promise<number> {
    const prisma = getPrismaClient();
    return prisma.user.count();
  }

  private mapToEntity(user: any): User {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      passwordHash: user.passwordHash,
      pinHash: user.pinHash,
      roleId: user.roleId,
      biometricEnabled: user.biometricEnabled,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}

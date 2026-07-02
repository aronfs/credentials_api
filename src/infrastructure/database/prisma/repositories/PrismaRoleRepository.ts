import { RoleRepositoryPort } from "../../../../domain/ports/RoleRepositoryPort";
import { Role, CreateRoleInput, UpdateRoleInput } from "../../../../domain/entities/Role";
import { getPrismaClient } from "../PrismaClient";

export class PrismaRoleRepository implements RoleRepositoryPort {
  async create(input: CreateRoleInput): Promise<Role> {
    const prisma = getPrismaClient();
    const role = await prisma.role.create({
      data: {
        name: input.name,
        permissions: input.permissions,
      },
    });
    return this.mapToEntity(role);
  }

  async findAll(): Promise<Role[]> {
    const prisma = getPrismaClient();
    const roles = await prisma.role.findMany();
    return roles.map(this.mapToEntity);
  }

  async findById(id: string): Promise<Role | null> {
    const prisma = getPrismaClient();
    const role = await prisma.role.findUnique({ where: { id } });
    return role ? this.mapToEntity(role) : null;
  }

  async findByName(name: string): Promise<Role | null> {
    const prisma = getPrismaClient();
    const role = await prisma.role.findUnique({ where: { name } });
    return role ? this.mapToEntity(role) : null;
  }

  async update(id: string, input: UpdateRoleInput): Promise<Role | null> {
    const prisma = getPrismaClient();
    const role = await prisma.role.update({
      where: { id },
      data: {
        ...(input.name !== undefined && { name: input.name }),
        ...(input.permissions !== undefined && { permissions: input.permissions }),
        ...(input.isActive !== undefined && { isActive: input.isActive }),
      },
    });
    return this.mapToEntity(role);
  }

  async delete(id: string): Promise<boolean> {
    const prisma = getPrismaClient();
    try {
      await prisma.role.delete({ where: { id } });
      return true;
    } catch {
      return false;
    }
  }

  private mapToEntity(role: any): Role {
    return {
      id: role.id,
      name: role.name,
      permissions: role.permissions,
      isActive: role.isActive,
      createdAt: role.createdAt,
      updatedAt: role.updatedAt,
    };
  }
}

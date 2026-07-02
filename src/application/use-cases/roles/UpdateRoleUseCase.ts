import { RoleRepositoryPort } from "../../../domain/ports/RoleRepositoryPort";
import { Role, RoleResponse } from "../../../domain/entities/Role";

export interface UpdateRoleDTO {
  name?: string;
  permissions?: string[];
  isActive?: boolean;
}

export class UpdateRoleUseCase {
  constructor(private roleRepository: RoleRepositoryPort) {}

  async execute(id: string, dto: UpdateRoleDTO): Promise<RoleResponse> {
    const role = await this.roleRepository.findById(id);
    if (!role) {
      throw new Error("Rol no encontrado");
    }

    const updatedRole = await this.roleRepository.update(id, {
      ...(dto.name !== undefined && { name: dto.name.toUpperCase() }),
      ...(dto.permissions !== undefined && { permissions: dto.permissions }),
      ...(dto.isActive !== undefined && { isActive: dto.isActive }),
    });

    if (!updatedRole) {
      throw new Error("Error al actualizar rol");
    }

    return {
      id: updatedRole.id,
      name: updatedRole.name,
      permissions: updatedRole.permissions,
      isActive: updatedRole.isActive,
      createdAt: updatedRole.createdAt,
      updatedAt: updatedRole.updatedAt,
    };
  }
}

import { RoleRepositoryPort } from "../../../domain/ports/RoleRepositoryPort";
import { Role, RoleResponse } from "../../../domain/entities/Role";

export interface CreateRoleDTO {
  name: string;
  permissions: string[];
}

export class CreateRoleUseCase {
  constructor(private roleRepository: RoleRepositoryPort) {}

  async execute(dto: CreateRoleDTO): Promise<RoleResponse> {
    const existingRole = await this.roleRepository.findByName(dto.name);
    if (existingRole) {
      throw new Error("El rol ya existe");
    }

    const role = await this.roleRepository.create({
      name: dto.name.toUpperCase(),
      permissions: dto.permissions,
    });

    return this.toResponse(role);
  }

  private toResponse(role: Role): RoleResponse {
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

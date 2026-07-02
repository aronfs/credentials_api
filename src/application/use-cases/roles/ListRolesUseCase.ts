import { RoleRepositoryPort } from "../../../domain/ports/RoleRepositoryPort";
import { Role, RoleResponse } from "../../../domain/entities/Role";

export class ListRolesUseCase {
  constructor(private roleRepository: RoleRepositoryPort) {}

  async execute(): Promise<RoleResponse[]> {
    const roles = await this.roleRepository.findAll();
    return roles.map(this.toResponse);
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

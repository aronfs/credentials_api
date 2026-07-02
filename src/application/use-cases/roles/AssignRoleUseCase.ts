import { RoleRepositoryPort } from "../../../domain/ports/RoleRepositoryPort";
import { UserRepositoryPort } from "../../../domain/ports/UserRepositoryPort";

export interface AssignRoleDTO {
  userId: string;
  roleId: string;
}

export class AssignRoleUseCase {
  constructor(
    private userRepository: UserRepositoryPort,
    private roleRepository: RoleRepositoryPort
  ) {}

  async execute(dto: AssignRoleDTO): Promise<void> {
    const user = await this.userRepository.findById(dto.userId);
    if (!user) {
      throw new Error("Usuario no encontrado");
    }

    const role = await this.roleRepository.findById(dto.roleId);
    if (!role) {
      throw new Error("Rol no encontrado");
    }

    await this.userRepository.update(dto.userId, { roleId: dto.roleId });
  }
}

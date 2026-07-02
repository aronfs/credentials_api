import { RoleRepositoryPort } from "../../../domain/ports/RoleRepositoryPort";

export class DeleteRoleUseCase {
  constructor(private roleRepository: RoleRepositoryPort) {}

  async execute(id: string): Promise<void> {
    const role = await this.roleRepository.findById(id);
    if (!role) {
      throw new Error("Rol no encontrado");
    }

    const deleted = await this.roleRepository.delete(id);
    if (!deleted) {
      throw new Error("Error al eliminar rol");
    }
  }
}

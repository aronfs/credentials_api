import { UserRepositoryPort } from "../../../domain/ports/UserRepositoryPort";
import { UserResponse } from "../../../domain/entities/User";

export class UpdateProfileUseCase {
  constructor(private userRepository: UserRepositoryPort) {}

  async execute(userId: string, name: string): Promise<UserResponse> {
    if (!name || name.trim().length < 2) {
      throw new Error("El nombre debe tener al menos 2 caracteres");
    }
    if (name.length > 80) {
      throw new Error("El nombre no puede tener más de 80 caracteres");
    }

    const user = await this.userRepository.update(userId, { name: name.trim() });
    if (!user) throw new Error("Usuario no encontrado");

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      roleId: user.roleId,
      biometricEnabled: user.biometricEnabled,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
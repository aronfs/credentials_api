import { UserRepositoryPort } from "../../../domain/ports/UserRepositoryPort";
import { User, UserResponse } from "../../../domain/entities/User";

export class GetUserByIdUseCase {
  constructor(private userRepository: UserRepositoryPort) {}

  async execute(id: string): Promise<UserResponse> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new Error("Usuario no encontrado");
    }
    return this.toResponse(user);
  }

  private toResponse(user: User): UserResponse {
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

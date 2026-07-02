import { UserRepositoryPort } from "../../../domain/ports/UserRepositoryPort";
import { User, UserResponse } from "../../../domain/entities/User";

export class ListUsersUseCase {
  constructor(private userRepository: UserRepositoryPort) {}

  async execute(): Promise<UserResponse[]> {
    const users = await this.userRepository.findAll();
    return users.map(this.toResponse);
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

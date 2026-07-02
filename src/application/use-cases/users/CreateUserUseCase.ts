import { UserRepositoryPort } from "../../../domain/ports/UserRepositoryPort";
import { HashServicePort } from "../../../domain/ports/HashServicePort";
import { User, UserResponse } from "../../../domain/entities/User";

export interface CreateUserDTO {
  name: string;
  email: string;
  password: string;
  roleId: string;
}

export class CreateUserUseCase {
  constructor(
    private userRepository: UserRepositoryPort,
    private hashService: HashServicePort
  ) {}

  async execute(dto: CreateUserDTO): Promise<UserResponse> {
    const existingUser = await this.userRepository.findByEmail(dto.email);
    if (existingUser) {
      throw new Error("El email ya está registrado");
    }

    const passwordHash = await this.hashService.hash(dto.password);

    const user = await this.userRepository.create({
      name: dto.name,
      email: dto.email,
      passwordHash,
      roleId: dto.roleId,
    });

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

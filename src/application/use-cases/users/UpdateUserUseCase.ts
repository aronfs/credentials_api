import { UserRepositoryPort } from "../../../domain/ports/UserRepositoryPort";
import { HashServicePort } from "../../../domain/ports/HashServicePort";
import { User, UserResponse } from "../../../domain/entities/User";

export interface UpdateUserDTO {
  name?: string;
  email?: string;
  password?: string;
  pin?: string;
  roleId?: string;
  biometricEnabled?: boolean;
  isActive?: boolean;
}

export class UpdateUserUseCase {
  constructor(
    private userRepository: UserRepositoryPort,
    private hashService: HashServicePort
  ) {}

  async execute(id: string, dto: UpdateUserDTO): Promise<UserResponse> {
    const existingUser = await this.userRepository.findById(id);
    if (!existingUser) {
      throw new Error("Usuario no encontrado");
    }

    if (dto.email && dto.email !== existingUser.email) {
      const emailTaken = await this.userRepository.findByEmail(dto.email);
      if (emailTaken) {
        throw new Error("El email ya está registrado");
      }
    }

    const updateData: any = {};
    if (dto.name !== undefined) updateData.name = dto.name;
    if (dto.email !== undefined) updateData.email = dto.email;
    if (dto.password !== undefined) updateData.passwordHash = await this.hashService.hash(dto.password);
    if (dto.pin !== undefined) updateData.pinHash = await this.hashService.hash(dto.pin);
    if (dto.roleId !== undefined) updateData.roleId = dto.roleId;
    if (dto.biometricEnabled !== undefined) updateData.biometricEnabled = dto.biometricEnabled;
    if (dto.isActive !== undefined) updateData.isActive = dto.isActive;

    const user = await this.userRepository.update(id, updateData);
    if (!user) {
      throw new Error("Error al actualizar usuario");
    }

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

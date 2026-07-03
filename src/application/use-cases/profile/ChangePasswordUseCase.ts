import { UserRepositoryPort } from "../../../domain/ports/UserRepositoryPort";
import { HashServicePort } from "../../../domain/ports/HashServicePort";
import { SessionRepositoryPort } from "../../../domain/ports/SessionRepositoryPort";

export class ChangePasswordUseCase {
  constructor(
    private userRepository: UserRepositoryPort,
    private hashService: HashServicePort,
    private sessionRepository: SessionRepositoryPort
  ) {}

  async execute(userId: string, currentPassword: string, newPassword: string): Promise<void> {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new Error("Usuario no encontrado");

    const isValid = await this.hashService.compare(currentPassword, user.passwordHash);
    if (!isValid) {
      throw new Error("Contraseña actual incorrecta");
    }

    if (newPassword.length < 8) {
      throw new Error("La nueva contraseña debe tener al menos 8 caracteres");
    }

    const newPasswordHash = await this.hashService.hash(newPassword);
    await this.userRepository.update(userId, { passwordHash: newPasswordHash });
  }
}
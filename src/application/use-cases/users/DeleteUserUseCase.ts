import { UserRepositoryPort } from "../../../domain/ports/UserRepositoryPort";

export class DeleteUserUseCase {
  constructor(private userRepository: UserRepositoryPort) {}

  async execute(id: string): Promise<void> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new Error("Usuario no encontrado");
    }

    const deleted = await this.userRepository.delete(id);
    if (!deleted) {
      throw new Error("Error al eliminar usuario");
    }
  }
}

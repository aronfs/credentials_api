import { UserRepositoryPort } from "../../../domain/ports/UserRepositoryPort";
import { HashServicePort } from "../../../domain/ports/HashServicePort";

export class ChangePinUseCase {
  constructor(
    private userRepository: UserRepositoryPort,
    private hashService: HashServicePort
  ) {}

  async execute(userId: string, currentPin: string, newPin: string): Promise<void> {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new Error("Usuario no encontrado");

    if (!user.pinHash) {
      throw new Error("PIN no configurado");
    }

    const isValid = await this.hashService.compare(currentPin, user.pinHash);
    if (!isValid) {
      throw new Error("PIN actual incorrecto");
    }

    if (!/^\d{4,6}$/.test(newPin)) {
      throw new Error("El nuevo PIN debe tener entre 4 y 6 dígitos");
    }

    const newPinHash = await this.hashService.hash(newPin);
    await this.userRepository.update(userId, { pinHash: newPinHash });
  }
}
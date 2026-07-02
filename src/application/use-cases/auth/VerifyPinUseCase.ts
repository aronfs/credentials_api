import { UserRepositoryPort } from "../../../domain/ports/UserRepositoryPort";
import { HashServicePort } from "../../../domain/ports/HashServicePort";

export class VerifyPinUseCase {
  constructor(
    private userRepository: UserRepositoryPort,
    private hashService: HashServicePort
  ) {}

  async execute(userId: string, pin: string): Promise<boolean> {
    const user = await this.userRepository.findById(userId);
    if (!user || !user.pinHash) {
      throw new Error("PIN no configurado");
    }

    return this.hashService.compare(pin, user.pinHash);
  }
}

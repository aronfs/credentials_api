import { CredentialRepositoryPort } from "../../../domain/ports/CredentialRepositoryPort";
import { SecurityLogRepositoryPort } from "../../../domain/ports/SecurityLogRepositoryPort";
import { SecurityLogAction } from "../../../domain/entities/SecurityLog";

export class DeleteCredentialUseCase {
  constructor(
    private credentialRepository: CredentialRepositoryPort,
    private securityLogRepository: SecurityLogRepositoryPort
  ) {}

  async execute(
    id: string,
    userId: string,
    ip?: string | null,
    userAgent?: string | null
  ): Promise<void> {
    const credential = await this.credentialRepository.findByIdAndUserId(id, userId);
    if (!credential) {
      throw new Error("Credencial no encontrada");
    }

    await this.credentialRepository.delete(id);

    await this.securityLogRepository.create({
      userId,
      action: SecurityLogAction.DELETE_CREDENTIAL,
      credentialId: id,
      ip: ip ?? null,
      userAgent: userAgent ?? null,
    });
  }
}

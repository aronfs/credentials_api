import { CredentialRepositoryPort } from "../../../domain/ports/CredentialRepositoryPort";
import { Credential, CredentialResponse } from "../../../domain/entities/Credential";

export class GetCredentialByIdUseCase {
  constructor(private credentialRepository: CredentialRepositoryPort) {}

  async execute(id: string, userId: string): Promise<CredentialResponse> {
    const credential = await this.credentialRepository.findByIdAndUserId(id, userId);
    if (!credential) {
      throw new Error("Credencial no encontrada");
    }

    return this.toResponse(credential);
  }

  private toResponse(credential: Credential): CredentialResponse {
    return {
      id: credential.id,
      userId: credential.userId,
      serviceName: credential.serviceName,
      loginEmail: credential.loginEmail,
      username: credential.username,
      categoryId: credential.categoryId,
      notes: credential.notes,
      tags: credential.tags,
      strength: credential.strength,
      isFavorite: credential.isFavorite,
      lastUsedAt: credential.lastUsedAt,
      createdAt: credential.createdAt,
      updatedAt: credential.updatedAt,
    };
  }
}

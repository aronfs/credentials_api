import { CredentialRepositoryPort } from "../../../domain/ports/CredentialRepositoryPort";
import { Credential, CredentialResponse } from "../../../domain/entities/Credential";

export class ToggleFavoriteCredentialUseCase {
  constructor(private credentialRepository: CredentialRepositoryPort) {}

  async execute(id: string, userId: string): Promise<CredentialResponse> {
    const credential = await this.credentialRepository.findByIdAndUserId(id, userId);
    if (!credential) {
      throw new Error("Credencial no encontrada");
    }

    const updatedCredential = await this.credentialRepository.update(id, {
      isFavorite: !credential.isFavorite,
    });

    if (!updatedCredential) {
      throw new Error("Error al actualizar favorito");
    }

    return {
      id: updatedCredential.id,
      userId: updatedCredential.userId,
      serviceName: updatedCredential.serviceName,
      loginEmail: updatedCredential.loginEmail,
      username: updatedCredential.username,
      categoryId: updatedCredential.categoryId,
      notes: updatedCredential.notes,
      tags: updatedCredential.tags,
      strength: updatedCredential.strength,
      isFavorite: updatedCredential.isFavorite,
      lastUsedAt: updatedCredential.lastUsedAt,
      createdAt: updatedCredential.createdAt,
      updatedAt: updatedCredential.updatedAt,
    };
  }
}

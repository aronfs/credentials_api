import { CredentialRepositoryPort } from "../../../domain/ports/CredentialRepositoryPort";
import { CredentialResponse } from "../../../domain/entities/Credential";

export class FavoriteCredentialUseCase {
  constructor(private credentialRepository: CredentialRepositoryPort) {}

  async execute(id: string, userId: string): Promise<CredentialResponse> {
    const credential = await this.credentialRepository.findByIdAndUserId(id, userId);
    if (!credential) {
      throw new Error("Credencial no encontrada");
    }

    if (credential.isFavorite) {
      return this.toResponse(credential);
    }

    const updated = await this.credentialRepository.update(id, {
      isFavorite: true,
      favoriteAt: new Date(),
    });

    if (!updated) throw new Error("Error al actualizar favorito");
    return this.toResponse(updated);
  }

  private toResponse(c: any): CredentialResponse {
    return {
      id: c.id,
      userId: c.userId,
      serviceName: c.serviceName,
      loginEmail: c.loginEmail,
      username: c.username,
      categoryId: c.categoryId,
      notes: c.notes,
      tags: c.tags,
      strength: c.strength,
      isFavorite: c.isFavorite,
      favoriteAt: c.favoriteAt,
      lastUsedAt: c.lastUsedAt,
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
    };
  }
}
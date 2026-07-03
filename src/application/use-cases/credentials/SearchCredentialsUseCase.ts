import { CredentialRepositoryPort } from "../../../domain/ports/CredentialRepositoryPort";
import { Credential, CredentialResponse } from "../../../domain/entities/Credential";

export class SearchCredentialsUseCase {
  constructor(private credentialRepository: CredentialRepositoryPort) {}

  async execute(userId: string, query: string): Promise<CredentialResponse[]> {
    if (!query || query.trim().length === 0) {
      return [];
    }

    const credentials = await this.credentialRepository.search(userId, query.trim());
    return credentials.map(this.toResponse);
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
      favoriteAt: credential.favoriteAt,
      lastUsedAt: credential.lastUsedAt,
      createdAt: credential.createdAt,
      updatedAt: credential.updatedAt,
    };
  }
}

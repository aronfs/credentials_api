import { CredentialRepositoryPort } from "../../../domain/ports/CredentialRepositoryPort";
import { Credential, CredentialResponse } from "../../../domain/entities/Credential";

export class ListCredentialsUseCase {
  constructor(private credentialRepository: CredentialRepositoryPort) {}

  async execute(userId: string, categoryId?: string, isFavorite?: boolean): Promise<CredentialResponse[]> {
    let credentials: Credential[];

    if (categoryId) {
      credentials = await this.credentialRepository.findByCategory(userId, categoryId);
    } else if (isFavorite) {
      credentials = await this.credentialRepository.findFavoritesByUserId(userId);
    } else {
      credentials = await this.credentialRepository.findAllByUserId(userId);
    }

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
      lastUsedAt: credential.lastUsedAt,
      createdAt: credential.createdAt,
      updatedAt: credential.updatedAt,
    };
  }
}

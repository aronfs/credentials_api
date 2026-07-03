import { CredentialRepositoryPort, PaginatedCredentials } from "../../../domain/ports/CredentialRepositoryPort";
import { FavoriteCredentialDTO } from "./FavoriteCredentialDTO";

export interface PaginatedFavoritesResponse {
  items: FavoriteCredentialDTO[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export class ListFavoriteCredentialsUseCase {
  constructor(private credentialRepository: CredentialRepositoryPort) {}

  async execute(
    userId: string,
    page: number,
    limit: number,
    search?: string
  ): Promise<PaginatedFavoritesResponse> {
    const result = await this.credentialRepository.findFavoritesPaginated(
      userId,
      page,
      limit,
      search
    );

    return {
      items: result.items.map((c) => ({
        id: c.id,
        serviceName: c.serviceName,
        loginEmail: c.loginEmail,
        username: c.username,
        categoryId: c.categoryId,
        isFavorite: c.isFavorite,
        favoriteAt: c.favoriteAt,
        updatedAt: c.updatedAt,
      })),
      pagination: {
        page: result.page,
        limit: result.limit,
        total: result.total,
        totalPages: result.totalPages,
      },
    };
  }
}
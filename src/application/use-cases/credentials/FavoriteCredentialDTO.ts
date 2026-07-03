export interface FavoriteCredentialDTO {
  id: string;
  serviceName: string;
  loginEmail: string | null;
  username: string | null;
  categoryId: string | null;
  isFavorite: boolean;
  favoriteAt: Date | null;
  updatedAt: Date;
}
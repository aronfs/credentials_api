export interface Credential {
  id: string;
  userId: string;
  serviceName: string;
  loginEmail: string | null;
  username: string | null;
  encryptedPassword: string;
  passwordIv: string;
  passwordAuthTag: string;
  categoryId: string | null;
  notes: string | null;
  tags: string[];
  strength: number | null;
  isFavorite: boolean;
  favoriteAt: Date | null;
  lastUsedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCredentialInput {
  userId: string;
  serviceName: string;
  loginEmail?: string | null;
  username?: string | null;
  password?: string;
  categoryId?: string | null;
  notes?: string | null;
  tags?: string[];
  strength?: number;
}

export interface UpdateCredentialInput {
  serviceName?: string;
  loginEmail?: string | null;
  username?: string | null;
  password?: string;
  categoryId?: string | null;
  notes?: string | null;
  tags?: string[];
  strength?: number;
  isFavorite?: boolean;
  favoriteAt?: Date | null;
  lastUsedAt?: Date | null;
}

export interface CredentialResponse {
  id: string;
  userId: string;
  serviceName: string;
  loginEmail: string | null;
  username: string | null;
  categoryId: string | null;
  notes: string | null;
  tags: string[];
  strength: number | null;
  isFavorite: boolean;
  favoriteAt: Date | null;
  lastUsedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CredentialWithPasswordResponse extends CredentialResponse {
  password: string;
}

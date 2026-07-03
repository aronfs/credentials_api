import {
  Credential, CreateCredentialInput, UpdateCredentialInput
} from "../entities/Credential";

export interface PaginatedCredentials {
  items: Credential[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CredentialRepositoryPort {
  create(input: CreateCredentialInput & {
    encryptedPassword: string;
    passwordIv: string;
    passwordAuthTag: string;
  }): Promise<Credential>;
  findAllByUserId(userId: string): Promise<Credential[]>;
  findById(id: string): Promise<Credential | null>;
  findByIdAndUserId(id: string, userId: string): Promise<Credential | null>;
  update(id: string, input: UpdateCredentialInput & {
    encryptedPassword?: string;
    passwordIv?: string;
    passwordAuthTag?: string;
  }): Promise<Credential | null>;
  delete(id: string): Promise<boolean>;
  updateLastUsedAt(id: string, date: Date): Promise<void>;
  search(userId: string, query: string): Promise<Credential[]>;
  findByCategory(userId: string, categoryId: string): Promise<Credential[]>;
  findFavoritesByUserId(userId: string): Promise<Credential[]>;
  countByUserId(userId: string): Promise<number>;
  countFavoritesByUserId(userId: string): Promise<number>;
  countRecentByUserId(userId: string, days: number): Promise<number>;
  findRecentByUserId(userId: string, limit: number): Promise<Credential[]>;
  findFavoritesPaginated(userId: string, page: number, limit: number, search?: string): Promise<PaginatedCredentials>;
  findWithNullCategory(userId: string): Promise<Credential[]>;
  findStaleCredentials(userId: string, days: number): Promise<Credential[]>;
  findWeakCredentials(userId: string, maxStrength: number): Promise<Credential[]>;
  averageStrengthByUserId(userId: string): Promise<number | null>;
  countCredentialsByCategory(userId: string): Promise<{ categoryId: string | null; count: number }[]>;
}
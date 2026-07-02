import { Credential, CreateCredentialInput, UpdateCredentialInput } from "../entities/Credential";

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
}

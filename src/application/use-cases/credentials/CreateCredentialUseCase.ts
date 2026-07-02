import { CredentialRepositoryPort } from "../../../domain/ports/CredentialRepositoryPort";
import { SecurityLogRepositoryPort } from "../../../domain/ports/SecurityLogRepositoryPort";
import { EncryptionServicePort } from "../../../domain/ports/EncryptionServicePort";
import { SecurityLogAction } from "../../../domain/entities/SecurityLog";
import { Credential, CredentialResponse } from "../../../domain/entities/Credential";

export interface CreateCredentialDTO {
  userId: string;
  serviceName: string;
  loginEmail?: string | null;
  username?: string | null;
  password: string;
  categoryId?: string | null;
  notes?: string | null;
  tags?: string[];
  strength?: number;
}

export class CreateCredentialUseCase {
  constructor(
    private credentialRepository: CredentialRepositoryPort,
    private encryptionService: EncryptionServicePort,
    private securityLogRepository: SecurityLogRepositoryPort
  ) {}

  async execute(
    dto: CreateCredentialDTO,
    ip?: string | null,
    userAgent?: string | null
  ): Promise<CredentialResponse> {
    const encrypted = this.encryptionService.encrypt(dto.password);

    const credential = await this.credentialRepository.create({
      userId: dto.userId,
      serviceName: dto.serviceName,
      loginEmail: dto.loginEmail ?? null,
      username: dto.username ?? null,
      encryptedPassword: encrypted.encryptedData,
      passwordIv: encrypted.iv,
      passwordAuthTag: encrypted.authTag,
      categoryId: dto.categoryId ?? null,
      notes: dto.notes ?? null,
      tags: dto.tags ?? [],
      strength: dto.strength ?? this.calculateStrength(dto.password),
    });

    await this.securityLogRepository.create({
      userId: dto.userId,
      action: SecurityLogAction.CREATE_CREDENTIAL,
      credentialId: credential.id,
      ip: ip ?? null,
      userAgent: userAgent ?? null,
    });

    return this.toResponse(credential);
  }

  private calculateStrength(password: string): number {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (password.length >= 12) strength += 15;
    if (/[A-Z]/.test(password)) strength += 15;
    if (/[a-z]/.test(password)) strength += 15;
    if (/[0-9]/.test(password)) strength += 15;
    if (/[^A-Za-z0-9]/.test(password)) strength += 15;
    return Math.min(100, strength);
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

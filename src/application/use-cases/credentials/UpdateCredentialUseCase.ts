import { CredentialRepositoryPort } from "../../../domain/ports/CredentialRepositoryPort";
import { SecurityLogRepositoryPort } from "../../../domain/ports/SecurityLogRepositoryPort";
import { EncryptionServicePort } from "../../../domain/ports/EncryptionServicePort";
import { SecurityLogAction } from "../../../domain/entities/SecurityLog";
import { Credential, CredentialResponse } from "../../../domain/entities/Credential";

export interface UpdateCredentialDTO {
  serviceName?: string;
  loginEmail?: string | null;
  username?: string | null;
  password?: string;
  categoryId?: string | null;
  notes?: string | null;
  tags?: string[];
  strength?: number;
}

export class UpdateCredentialUseCase {
  constructor(
    private credentialRepository: CredentialRepositoryPort,
    private encryptionService: EncryptionServicePort,
    private securityLogRepository: SecurityLogRepositoryPort
  ) {}

  async execute(
    id: string,
    userId: string,
    dto: UpdateCredentialDTO,
    ip?: string | null,
    userAgent?: string | null
  ): Promise<CredentialResponse> {
    const existingCredential = await this.credentialRepository.findByIdAndUserId(id, userId);
    if (!existingCredential) {
      throw new Error("Credencial no encontrada");
    }

    const updateData: any = {};
    if (dto.serviceName !== undefined) updateData.serviceName = dto.serviceName;
    if (dto.loginEmail !== undefined) updateData.loginEmail = dto.loginEmail;
    if (dto.username !== undefined) updateData.username = dto.username;
    if (dto.categoryId !== undefined) updateData.categoryId = dto.categoryId;
    if (dto.notes !== undefined) updateData.notes = dto.notes;
    if (dto.tags !== undefined) updateData.tags = dto.tags;
    if (dto.strength !== undefined) updateData.strength = dto.strength;

    if (dto.password) {
      const encrypted = this.encryptionService.encrypt(dto.password);
      updateData.encryptedPassword = encrypted.encryptedData;
      updateData.passwordIv = encrypted.iv;
      updateData.passwordAuthTag = encrypted.authTag;
      if (!dto.strength) {
        updateData.strength = this.calculateStrength(dto.password);
      }
    }

    const credential = await this.credentialRepository.update(id, updateData);
    if (!credential) {
      throw new Error("Error al actualizar credencial");
    }

    await this.securityLogRepository.create({
      userId,
      action: SecurityLogAction.UPDATE_CREDENTIAL,
      credentialId: id,
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
      favoriteAt: credential.favoriteAt,
      lastUsedAt: credential.lastUsedAt,
      createdAt: credential.createdAt,
      updatedAt: credential.updatedAt,
    };
  }
}

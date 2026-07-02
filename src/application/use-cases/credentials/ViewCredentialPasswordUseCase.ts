import { CredentialRepositoryPort } from "../../../domain/ports/CredentialRepositoryPort";
import { SecurityLogRepositoryPort } from "../../../domain/ports/SecurityLogRepositoryPort";
import { EncryptionServicePort } from "../../../domain/ports/EncryptionServicePort";
import { RoleRepositoryPort } from "../../../domain/ports/RoleRepositoryPort";
import { SecurityLogAction } from "../../../domain/entities/SecurityLog";

export interface ViewCredentialPasswordResponse {
  credentialId: string;
  serviceName: string;
  loginEmail: string | null;
  username: string | null;
  password: string;
}

export class ViewCredentialPasswordUseCase {
  constructor(
    private credentialRepository: CredentialRepositoryPort,
    private encryptionService: EncryptionServicePort,
    private securityLogRepository: SecurityLogRepositoryPort,
    private roleRepository: RoleRepositoryPort
  ) {}

  async execute(
    credentialId: string,
    userId: string,
    roleId: string,
    ip?: string | null,
    userAgent?: string | null
  ): Promise<ViewCredentialPasswordResponse> {
    const credential = await this.credentialRepository.findById(credentialId);
    if (!credential) {
      throw new Error("Credencial no encontrada");
    }

    const role = await this.roleRepository.findById(roleId);
    const isAdmin = role?.name === "ADMIN";

    if (!isAdmin && credential.userId !== userId) {
      throw new Error("No tienes permiso para ver esta contraseña");
    }

    let decryptedPassword: string;
    try {
      decryptedPassword = this.encryptionService.decrypt(
        credential.encryptedPassword,
        credential.passwordIv,
        credential.passwordAuthTag
      );
    } catch {
      throw new Error("No se pudo descifrar la contraseña");
    }

    await this.credentialRepository.updateLastUsedAt(credentialId, new Date());

    await this.securityLogRepository.create({
      userId,
      action: SecurityLogAction.VIEW_PASSWORD,
      credentialId,
      ip: ip ?? null,
      userAgent: userAgent ?? null,
    });

    return {
      credentialId: credential.id,
      serviceName: credential.serviceName,
      loginEmail: credential.loginEmail,
      username: credential.username,
      password: decryptedPassword,
    };
  }
}

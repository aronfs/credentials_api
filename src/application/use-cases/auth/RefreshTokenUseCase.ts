import { TokenServicePort } from "../../../domain/ports/TokenServicePort";
import { SessionRepositoryPort } from "../../../domain/ports/SessionRepositoryPort";
import { UserRepositoryPort } from "../../../domain/ports/UserRepositoryPort";
import { RoleRepositoryPort } from "../../../domain/ports/RoleRepositoryPort";
import { AuthResponse } from "../../dto/AuthDTO";

export class RefreshTokenUseCase {
  constructor(
    private tokenService: TokenServicePort,
    private sessionRepository: SessionRepositoryPort,
    private userRepository: UserRepositoryPort,
    private roleRepository: RoleRepositoryPort
  ) {}

  async execute(refreshToken: string): Promise<AuthResponse> {
    let payload;
    try {
      payload = this.tokenService.verifyRefreshToken(refreshToken);
    } catch {
      throw new Error("Refresh token inválido o expirado");
    }

    const refreshTokenHash = await this.tokenService.hashToken(refreshToken);
    const session = await this.sessionRepository.findByRefreshTokenHash(refreshTokenHash);
    if (!session) {
      throw new Error("Sesión no encontrada o revocada");
    }

    const user = await this.userRepository.findById(payload.userId);
    if (!user) {
      throw new Error("Usuario no encontrado");
    }

    if (!user.isActive) {
      throw new Error("Usuario inactivo");
    }

    const role = await this.roleRepository.findById(user.roleId);
    if (!role) {
      throw new Error("Rol no encontrado");
    }

    const tokenPayload = {
      userId: user.id,
      email: user.email,
      roleId: user.roleId,
      permissions: role.permissions,
    };

    const newAccessToken = this.tokenService.generateAccessToken(tokenPayload);
    const newRefreshToken = this.tokenService.generateRefreshToken(tokenPayload);
    const newRefreshTokenHash = await this.tokenService.hashToken(newRefreshToken);

    await this.sessionRepository.revoke(session.id);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await this.sessionRepository.create({
      userId: user.id,
      refreshTokenHash: newRefreshTokenHash,
      userAgent: session.userAgent,
      ip: session.ip,
      expiresAt,
    });

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        roleId: user.roleId,
      },
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }
}

import { UserRepositoryPort } from "../../../domain/ports/UserRepositoryPort";
import { RoleRepositoryPort } from "../../../domain/ports/RoleRepositoryPort";
import { HashServicePort } from "../../../domain/ports/HashServicePort";
import { TokenServicePort } from "../../../domain/ports/TokenServicePort";
import { SessionRepositoryPort } from "../../../domain/ports/SessionRepositoryPort";
import { SecurityLogRepositoryPort } from "../../../domain/ports/SecurityLogRepositoryPort";
import { SecurityLogAction } from "../../../domain/entities/SecurityLog";
import { LoginDTO, AuthResponse } from "../../dto/AuthDTO";

export class LoginUseCase {
  constructor(
    private userRepository: UserRepositoryPort,
    private roleRepository: RoleRepositoryPort,
    private hashService: HashServicePort,
    private tokenService: TokenServicePort,
    private sessionRepository: SessionRepositoryPort,
    private securityLogRepository: SecurityLogRepositoryPort
  ) {}

  async execute(dto: LoginDTO, userAgent?: string | null, ip?: string | null): Promise<AuthResponse> {
    const user = await this.userRepository.findByEmail(dto.email);
    if (!user) {
      throw new Error("Credenciales inválidas");
    }

    if (!user.isActive) {
      throw new Error("Usuario inactivo. Contacte al administrador.");
    }

    const isValidPassword = await this.hashService.compare(dto.password, user.passwordHash);
    if (!isValidPassword) {
      throw new Error("Credenciales inválidas");
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

    const accessToken = this.tokenService.generateAccessToken(tokenPayload);
    const refreshToken = this.tokenService.generateRefreshToken(tokenPayload);
    const refreshTokenHash = await this.tokenService.hashToken(refreshToken);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await this.sessionRepository.create({
      userId: user.id,
      refreshTokenHash,
      userAgent: userAgent ?? null,
      ip: ip ?? null,
      expiresAt,
    });

    await this.securityLogRepository.create({
      userId: user.id,
      action: SecurityLogAction.LOGIN,
      ip: ip ?? null,
      userAgent: userAgent ?? null,
    });

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        roleId: user.roleId,
      },
      accessToken,
      refreshToken,
    };
  }
}

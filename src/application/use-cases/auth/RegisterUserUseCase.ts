import { UserRepositoryPort } from "../../../domain/ports/UserRepositoryPort";
import { RoleRepositoryPort } from "../../../domain/ports/RoleRepositoryPort";
import { HashServicePort } from "../../../domain/ports/HashServicePort";
import { TokenServicePort } from "../../../domain/ports/TokenServicePort";
import { SessionRepositoryPort } from "../../../domain/ports/SessionRepositoryPort";
import { RegisterDTO, AuthResponse } from "../../dto/AuthDTO";

export class RegisterUserUseCase {
  constructor(
    private userRepository: UserRepositoryPort,
    private roleRepository: RoleRepositoryPort,
    private hashService: HashServicePort,
    private tokenService: TokenServicePort,
    private sessionRepository: SessionRepositoryPort
  ) {}

  async execute(dto: RegisterDTO, userAgent?: string | null, ip?: string | null): Promise<AuthResponse> {
    const existingUser = await this.userRepository.findByEmail(dto.email);
    if (existingUser) {
      throw new Error("El email ya está registrado");
    }

    const userRole = await this.roleRepository.findByName("USER");
    if (!userRole) {
      throw new Error("Rol USER no encontrado. Ejecuta el seed primero.");
    }

    const passwordHash = await this.hashService.hash(dto.password);

    let pinHash: string | null = null;
    if (dto.pin) {
      pinHash = await this.hashService.hash(dto.pin);
    }

    const user = await this.userRepository.create({
      name: dto.name,
      email: dto.email,
      passwordHash,
      pinHash,
      roleId: userRole.id,
    });

    const tokenPayload = {
      userId: user.id,
      email: user.email,
      roleId: user.roleId,
      permissions: userRole.permissions,
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

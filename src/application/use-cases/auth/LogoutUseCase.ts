import { SessionRepositoryPort } from "../../../domain/ports/SessionRepositoryPort";
import { TokenServicePort } from "../../../domain/ports/TokenServicePort";
import { SecurityLogRepositoryPort } from "../../../domain/ports/SecurityLogRepositoryPort";
import { SecurityLogAction } from "../../../domain/entities/SecurityLog";

export class LogoutUseCase {
  constructor(
    private sessionRepository: SessionRepositoryPort,
    private tokenService: TokenServicePort,
    private securityLogRepository: SecurityLogRepositoryPort
  ) {}

  async execute(refreshToken: string, ip?: string | null, userAgent?: string | null): Promise<void> {
    const refreshTokenHash = await this.tokenService.hashToken(refreshToken);
    const session = await this.sessionRepository.findByRefreshTokenHash(refreshTokenHash);

    if (session) {
      await this.sessionRepository.revoke(session.id);
      await this.securityLogRepository.create({
        userId: session.userId,
        action: SecurityLogAction.LOGOUT,
        ip: ip ?? null,
        userAgent: userAgent ?? null,
      });
    }
  }
}

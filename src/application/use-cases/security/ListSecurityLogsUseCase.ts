import { SecurityLogRepositoryPort } from "../../../domain/ports/SecurityLogRepositoryPort";
import { SecurityLog } from "../../../domain/entities/SecurityLog";

export class ListSecurityLogsUseCase {
  constructor(private securityLogRepository: SecurityLogRepositoryPort) {}

  async execute(userId?: string): Promise<SecurityLog[]> {
    if (userId) {
      return this.securityLogRepository.findAllByUserId(userId);
    }
    return this.securityLogRepository.findAll();
  }
}

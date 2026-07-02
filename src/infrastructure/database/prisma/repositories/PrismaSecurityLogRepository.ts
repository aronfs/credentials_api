import { SecurityLogRepositoryPort } from "../../../../domain/ports/SecurityLogRepositoryPort";
import { SecurityLog, CreateSecurityLogInput } from "../../../../domain/entities/SecurityLog";
import { getPrismaClient } from "../PrismaClient";

export class PrismaSecurityLogRepository implements SecurityLogRepositoryPort {
  async create(input: CreateSecurityLogInput): Promise<SecurityLog> {
    const prisma = getPrismaClient();
    const log = await prisma.securityLog.create({
      data: {
        userId: input.userId,
        action: input.action,
        credentialId: input.credentialId ?? null,
        ip: input.ip ?? null,
        userAgent: input.userAgent ?? null,
      },
    });
    return this.mapToEntity(log);
  }

  async findAllByUserId(userId: string): Promise<SecurityLog[]> {
    const prisma = getPrismaClient();
    const logs = await prisma.securityLog.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
    return logs.map(this.mapToEntity);
  }

  async findAll(): Promise<SecurityLog[]> {
    const prisma = getPrismaClient();
    const logs = await prisma.securityLog.findMany({
      orderBy: { createdAt: "desc" },
    });
    return logs.map(this.mapToEntity);
  }

  async findByUserIdAndAction(userId: string, action: string): Promise<SecurityLog[]> {
    const prisma = getPrismaClient();
    const logs = await prisma.securityLog.findMany({
      where: { userId, action },
      orderBy: { createdAt: "desc" },
    });
    return logs.map(this.mapToEntity);
  }

  private mapToEntity(log: any): SecurityLog {
    return {
      id: log.id,
      userId: log.userId,
      action: log.action,
      credentialId: log.credentialId,
      ip: log.ip,
      userAgent: log.userAgent,
      createdAt: log.createdAt,
    };
  }
}

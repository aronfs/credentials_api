import { SessionRepositoryPort } from "../../../../domain/ports/SessionRepositoryPort";
import { Session, CreateSessionInput } from "../../../../domain/entities/Session";
import { getPrismaClient } from "../PrismaClient";

export class PrismaSessionRepository implements SessionRepositoryPort {
  async create(input: CreateSessionInput): Promise<Session> {
    const prisma = getPrismaClient();
    const session = await prisma.session.create({
      data: {
        userId: input.userId,
        refreshTokenHash: input.refreshTokenHash,
        userAgent: input.userAgent ?? null,
        ip: input.ip ?? null,
        expiresAt: input.expiresAt,
      },
    });
    return this.mapToEntity(session);
  }

  async findByRefreshTokenHash(refreshTokenHash: string): Promise<Session | null> {
    const prisma = getPrismaClient();
    const session = await prisma.session.findFirst({
      where: {
        refreshTokenHash,
        isRevoked: false,
        expiresAt: { gt: new Date() },
      },
    });
    return session ? this.mapToEntity(session) : null;
  }

  async findActiveByUserId(userId: string): Promise<Session[]> {
    const prisma = getPrismaClient();
    const sessions = await prisma.session.findMany({
      where: {
        userId,
        isRevoked: false,
        expiresAt: { gt: new Date() },
      },
    });
    return sessions.map(this.mapToEntity);
  }

  async revoke(id: string): Promise<boolean> {
    const prisma = getPrismaClient();
    try {
      await prisma.session.update({
        where: { id },
        data: { isRevoked: true },
      });
      return true;
    } catch {
      return false;
    }
  }

  async revokeAllByUserId(userId: string): Promise<boolean> {
    const prisma = getPrismaClient();
    try {
      await prisma.session.updateMany({
        where: { userId, isRevoked: false },
        data: { isRevoked: true },
      });
      return true;
    } catch {
      return false;
    }
  }

  async deleteExpired(): Promise<number> {
    const prisma = getPrismaClient();
    const result = await prisma.session.deleteMany({
      where: { expiresAt: { lt: new Date() } },
    });
    return result.count;
  }

  private mapToEntity(session: any): Session {
    return {
      id: session.id,
      userId: session.userId,
      refreshTokenHash: session.refreshTokenHash,
      userAgent: session.userAgent,
      ip: session.ip,
      isRevoked: session.isRevoked,
      expiresAt: session.expiresAt,
      createdAt: session.createdAt,
    };
  }
}

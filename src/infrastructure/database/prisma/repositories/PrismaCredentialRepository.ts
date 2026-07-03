import { CredentialRepositoryPort, PaginatedCredentials } from "../../../../domain/ports/CredentialRepositoryPort";
import { Credential } from "../../../../domain/entities/Credential";
import { getPrismaClient } from "../PrismaClient";

export class PrismaCredentialRepository implements CredentialRepositoryPort {
  async create(input: any): Promise<Credential> {
    const prisma = getPrismaClient();
    const credential = await prisma.credential.create({ data: input });
    return this.mapToEntity(credential);
  }

  async findAllByUserId(userId: string): Promise<Credential[]> {
    const prisma = getPrismaClient();
    const credentials = await prisma.credential.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
    return credentials.map(this.mapToEntity);
  }

  async findById(id: string): Promise<Credential | null> {
    const prisma = getPrismaClient();
    const credential = await prisma.credential.findUnique({ where: { id } });
    return credential ? this.mapToEntity(credential) : null;
  }

  async findByIdAndUserId(id: string, userId: string): Promise<Credential | null> {
    const prisma = getPrismaClient();
    const credential = await prisma.credential.findFirst({
      where: { id, userId },
    });
    return credential ? this.mapToEntity(credential) : null;
  }

  async update(id: string, input: any): Promise<Credential | null> {
    const prisma = getPrismaClient();
    const credential = await prisma.credential.update({
      where: { id },
      data: input,
    });
    return this.mapToEntity(credential);
  }

  async updateLastUsedAt(id: string, date: Date): Promise<void> {
    const prisma = getPrismaClient();
    await prisma.credential.update({
      where: { id },
      data: { lastUsedAt: date },
    });
  }

  async delete(id: string): Promise<boolean> {
    const prisma = getPrismaClient();
    try {
      await prisma.credential.delete({ where: { id } });
      return true;
    } catch {
      return false;
    }
  }

  async search(userId: string, query: string): Promise<Credential[]> {
    const prisma = getPrismaClient();
    const credentials = await prisma.credential.findMany({
      where: {
        userId,
        OR: [
          { serviceName: { contains: query, mode: "insensitive" } },
          { loginEmail: { contains: query, mode: "insensitive" } },
          { username: { contains: query, mode: "insensitive" } },
          { tags: { has: query } },
        ],
      },
      orderBy: { createdAt: "desc" },
    });
    return credentials.map(this.mapToEntity);
  }

  async findByCategory(userId: string, categoryId: string): Promise<Credential[]> {
    const prisma = getPrismaClient();
    const credentials = await prisma.credential.findMany({
      where: { userId, categoryId },
      orderBy: { createdAt: "desc" },
    });
    return credentials.map(this.mapToEntity);
  }

  async findFavoritesByUserId(userId: string): Promise<Credential[]> {
    const prisma = getPrismaClient();
    const credentials = await prisma.credential.findMany({
      where: { userId, isFavorite: true },
      orderBy: { favoriteAt: "desc" },
    });
    return credentials.map(this.mapToEntity);
  }

  async countByUserId(userId: string): Promise<number> {
    const prisma = getPrismaClient();
    return prisma.credential.count({ where: { userId } });
  }

  async countFavoritesByUserId(userId: string): Promise<number> {
    const prisma = getPrismaClient();
    return prisma.credential.count({ where: { userId, isFavorite: true } });
  }

  async countRecentByUserId(userId: string, days: number): Promise<number> {
    const prisma = getPrismaClient();
    const since = new Date();
    since.setDate(since.getDate() - days);
    return prisma.credential.count({
      where: { userId, createdAt: { gte: since } },
    });
  }

  async findRecentByUserId(userId: string, limit: number): Promise<Credential[]> {
    const prisma = getPrismaClient();
    const credentials = await prisma.credential.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
    return credentials.map(this.mapToEntity);
  }

  async findFavoritesPaginated(
    userId: string,
    page: number,
    limit: number,
    search?: string
  ): Promise<PaginatedCredentials> {
    const prisma = getPrismaClient();

    const where: any = { userId, isFavorite: true };

    if (search) {
      where.OR = [
        { serviceName: { contains: search, mode: "insensitive" } },
        { loginEmail: { contains: search, mode: "insensitive" } },
        { username: { contains: search, mode: "insensitive" } },
      ];
    }

    const [items, total] = await Promise.all([
      prisma.credential.findMany({
        where,
        orderBy: { favoriteAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.credential.count({ where }),
    ]);

    return {
      items: items.map(this.mapToEntity),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findWithNullCategory(userId: string): Promise<Credential[]> {
    const prisma = getPrismaClient();
    const credentials = await prisma.credential.findMany({
      where: { userId, categoryId: null },
      orderBy: { createdAt: "desc" },
    });
    return credentials.map(this.mapToEntity);
  }

  async findStaleCredentials(userId: string, days: number): Promise<Credential[]> {
    const prisma = getPrismaClient();
    const since = new Date();
    since.setDate(since.getDate() - days);
    const credentials = await prisma.credential.findMany({
      where: { userId, updatedAt: { lt: since } },
      orderBy: { updatedAt: "asc" },
    });
    return credentials.map(this.mapToEntity);
  }

  async findWeakCredentials(userId: string, maxStrength: number): Promise<Credential[]> {
    const prisma = getPrismaClient();
    const credentials = await prisma.credential.findMany({
      where: { userId, strength: { lt: maxStrength } },
      orderBy: { strength: "asc" },
    });
    return credentials.map(this.mapToEntity);
  }

  async averageStrengthByUserId(userId: string): Promise<number | null> {
    const prisma = getPrismaClient();
    const result = await prisma.credential.aggregate({
      where: { userId },
      _avg: { strength: true },
    });
    return result._avg.strength ?? null;
  }

  async countCredentialsByCategory(userId: string): Promise<{ categoryId: string | null; count: number }[]> {
    const prisma = getPrismaClient();
    const credentials = await prisma.credential.findMany({
      where: { userId },
      select: { categoryId: true },
    });

    const counts = new Map<string | null, number>();
    for (const c of credentials) {
      const key = c.categoryId ?? "__none__";
      counts.set(key, (counts.get(key) || 0) + 1);
    }

    return Array.from(counts.entries()).map(([key, count]) => ({
      categoryId: key === "__none__" ? null : key,
      count,
    }));
  }

  private mapToEntity(credential: any): Credential {
    return {
      id: credential.id,
      userId: credential.userId,
      serviceName: credential.serviceName,
      loginEmail: credential.loginEmail,
      username: credential.username,
      encryptedPassword: credential.encryptedPassword,
      passwordIv: credential.passwordIv,
      passwordAuthTag: credential.passwordAuthTag,
      categoryId: credential.categoryId,
      notes: credential.notes,
      tags: credential.tags,
      strength: credential.strength,
      isFavorite: credential.isFavorite,
      favoriteAt: credential.favoriteAt ?? null,
      lastUsedAt: credential.lastUsedAt,
      createdAt: credential.createdAt,
      updatedAt: credential.updatedAt,
    };
  }
}
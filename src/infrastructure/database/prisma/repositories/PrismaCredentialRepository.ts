import { CredentialRepositoryPort } from "../../../../domain/ports/CredentialRepositoryPort";
import { Credential, UpdateCredentialInput } from "../../../../domain/entities/Credential";
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
      orderBy: { createdAt: "desc" },
    });
    return credentials.map(this.mapToEntity);
  }

  async countByUserId(userId: string): Promise<number> {
    const prisma = getPrismaClient();
    return prisma.credential.count({ where: { userId } });
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
      lastUsedAt: credential.lastUsedAt,
      createdAt: credential.createdAt,
      updatedAt: credential.updatedAt,
    };
  }
}

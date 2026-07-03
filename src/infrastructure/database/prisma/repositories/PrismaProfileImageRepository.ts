import { getPrismaClient } from "../PrismaClient";
import { ProfileImageRepositoryPort, UserImageData, CreateUserImageInput } from "../../../../domain/ports/ProfileImageRepositoryPort";

export class PrismaProfileImageRepository implements ProfileImageRepositoryPort {
  async findByUserId(userId: string): Promise<UserImageData | null> {
    const prisma = getPrismaClient();
    const image = await prisma.userImage.findUnique({ where: { userId } });
    if (!image) return null;
    return this.mapToEntity(image);
  }

  async create(data: CreateUserImageInput): Promise<UserImageData> {
    const prisma = getPrismaClient();
    const image = await prisma.userImage.create({ data });
    return this.mapToEntity(image);
  }

  async deleteByUserId(userId: string): Promise<void> {
    const prisma = getPrismaClient();
    await prisma.userImage.deleteMany({ where: { userId } });
  }

  private mapToEntity(image: any): UserImageData {
    return {
      id: image.id,
      userId: image.userId,
      fileName: image.fileName,
      filePath: image.filePath,
      fileUrl: image.fileUrl,
      mimeType: image.mimeType,
      fileSize: image.fileSize,
      createdAt: image.createdAt,
      updatedAt: image.updatedAt,
    };
  }
}

import { randomUUID } from "crypto";
import { ProfileImageRepositoryPort } from "../../../domain/ports/ProfileImageRepositoryPort";
import { ImageBucketService } from "../../../infrastructure/storage/ImageBucketService";
import { ProfileImageResponse } from "../../dto/ProfileImageDTO";

const EXTENSION_MAP: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
};

export class UploadProfileImageUseCase {
  constructor(
    private profileImageRepository: ProfileImageRepositoryPort,
    private imageBucket: ImageBucketService,
  ) {}

  async execute(userId: string, file: Express.Multer.File): Promise<ProfileImageResponse> {
    const ext = EXTENSION_MAP[file.mimetype] || ".jpg";
    const shortId = randomUUID().split("-")[0];
    const fileName = `${shortId}_${Date.now()}${ext}`;

    const previous = await this.profileImageRepository.findByUserId(userId);

    if (previous) {
      await this.imageBucket.deleteImage(previous.filePath).catch(() => {});
      await this.profileImageRepository.deleteByUserId(userId);
    }

    const { filePath, fileUrl } = await this.imageBucket.saveProfileImage({
      userId,
      fileName,
      buffer: file.buffer,
    });

    try {
      const saved = await this.profileImageRepository.create({
        userId,
        fileName,
        filePath,
        fileUrl,
        mimeType: file.mimetype,
        fileSize: file.size,
      });

      return {
        id: saved.id,
        fileName: saved.fileName,
        filePath: saved.filePath,
        fileUrl: saved.fileUrl,
        mimeType: saved.mimeType,
        fileSize: saved.fileSize,
        createdAt: saved.createdAt,
        updatedAt: saved.updatedAt,
      };
    } catch (error) {
      await this.imageBucket.deleteImage(filePath).catch(() => {});
      throw new Error("PROFILE_IMAGE_DATABASE_ERROR");
    }
  }
}

import { ProfileImageRepositoryPort } from "../../../domain/ports/ProfileImageRepositoryPort";
import { ProfileImageResponse } from "../../dto/ProfileImageDTO";

export class GetProfileImageUseCase {
  constructor(private profileImageRepository: ProfileImageRepositoryPort) {}

  async execute(userId: string): Promise<ProfileImageResponse | null> {
    const image = await this.profileImageRepository.findByUserId(userId);
    if (!image) return null;

    return {
      id: image.id,
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

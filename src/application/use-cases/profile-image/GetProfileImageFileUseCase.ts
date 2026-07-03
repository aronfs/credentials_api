import { ProfileImageRepositoryPort } from "../../../domain/ports/ProfileImageRepositoryPort";
import { ImageBucketService } from "../../../infrastructure/storage/ImageBucketService";
import { ProfileImageFileData } from "../../dto/ProfileImageDTO";

export class GetProfileImageFileUseCase {
  constructor(
    private profileImageRepository: ProfileImageRepositoryPort,
    private imageBucket: ImageBucketService,
  ) {}

  async execute(userId: string): Promise<ProfileImageFileData | null> {
    const image = await this.profileImageRepository.findByUserId(userId);
    if (!image) return null;

    const exists = await this.imageBucket.imageExists(image.filePath);
    if (!exists) return null;

    return {
      absolutePath: this.imageBucket.getFileAbsolutePath(image.filePath),
      mimeType: image.mimeType,
    };
  }
}

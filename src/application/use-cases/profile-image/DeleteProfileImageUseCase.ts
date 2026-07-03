import { ProfileImageRepositoryPort } from "../../../domain/ports/ProfileImageRepositoryPort";
import { ImageBucketService } from "../../../infrastructure/storage/ImageBucketService";

export class DeleteProfileImageUseCase {
  constructor(
    private profileImageRepository: ProfileImageRepositoryPort,
    private imageBucket: ImageBucketService,
  ) {}

  async execute(userId: string): Promise<void> {
    const image = await this.profileImageRepository.findByUserId(userId);
    if (!image) return;

    await this.imageBucket.deleteImage(image.filePath);
    await this.profileImageRepository.deleteByUserId(userId);
  }
}

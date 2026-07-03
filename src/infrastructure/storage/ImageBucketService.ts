import { StorageProviderPort } from "../../domain/ports/StorageProviderPort";
import { LocalStorageProvider } from "./providers/LocalStorageProvider";

export class ImageBucketService {
  private storage: StorageProviderPort;

  constructor() {
    this.storage = new LocalStorageProvider();
  }

  async saveProfileImage(params: {
    userId: string;
    fileName: string;
    buffer: Buffer;
  }): Promise<{ filePath: string; fileUrl: string }> {
    const filePath = `users/profile/${params.userId}/${params.fileName}`;
    await this.storage.saveFile({ buffer: params.buffer, relativePath: filePath });
    const fileUrl = `/storage/images/${filePath}`;
    return { filePath, fileUrl };
  }

  async deleteImage(filePath: string): Promise<void> {
    await this.storage.deleteFile(filePath);
  }

  getFileAbsolutePath(filePath: string): string {
    return this.storage.getAbsolutePath(filePath);
  }

  async imageExists(filePath: string): Promise<boolean> {
    return this.storage.exists(filePath);
  }
}

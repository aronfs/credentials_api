export interface StorageProviderPort {
  saveFile(params: { buffer: Buffer; relativePath: string }): Promise<void>;
  deleteFile(relativePath: string): Promise<void>;
  exists(relativePath: string): Promise<boolean>;
  getAbsolutePath(relativePath: string): string;
}

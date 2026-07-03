export interface ProfileImageResponse {
  id: string;
  fileName: string;
  filePath: string;
  fileUrl: string;
  mimeType: string;
  fileSize: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProfileImageFileData {
  absolutePath: string;
  mimeType: string;
}

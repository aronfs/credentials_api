export interface UserImageData {
  id: string;
  userId: string;
  fileName: string;
  filePath: string;
  fileUrl: string;
  mimeType: string;
  fileSize: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserImageInput {
  userId: string;
  fileName: string;
  filePath: string;
  fileUrl: string;
  mimeType: string;
  fileSize: number;
}

export interface ProfileImageRepositoryPort {
  findByUserId(userId: string): Promise<UserImageData | null>;
  create(data: CreateUserImageInput): Promise<UserImageData>;
  deleteByUserId(userId: string): Promise<void>;
}

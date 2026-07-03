export interface ProfileImageInfo {
  id: string;
  fileUrl: string;
  mimeType: string;
  fileSize: number;
}

export interface ProfileUserData {
  id: string;
  name: string;
  email: string;
  roleId: string;
  role: {
    id: string;
    name: string;
  };
  profileImage: ProfileImageInfo | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProfileStats {
  totalCredentials: number;
  totalCategories: number;
  totalFavorites: number;
}

export interface ProfileMeData {
  user: ProfileUserData;
  stats: ProfileStats;
}

export interface UpdateProfileInput {
  name: string;
}

export interface ChangePinInput {
  currentPin: string;
  newPin: string;
}

export interface ChangePasswordInput {
  currentPassword: string;
  newPassword: string;
}
export interface RegisterDTO {
  name: string;
  email: string;
  password: string;
  pin?: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface RefreshTokenDTO {
  refreshToken: string;
}

export interface LogoutDTO {
  refreshToken: string;
}

export interface VerifyPinDTO {
  pin: string;
}

export interface AuthResponse {
  user: {
    id: string;
    name: string;
    email: string;
    roleId: string;
  };
  accessToken: string;
  refreshToken: string;
}

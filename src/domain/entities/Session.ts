export interface Session {
  id: string;
  userId: string;
  refreshTokenHash: string;
  userAgent: string | null;
  ip: string | null;
  isRevoked: boolean;
  expiresAt: Date;
  createdAt: Date;
}

export interface CreateSessionInput {
  userId: string;
  refreshTokenHash: string;
  userAgent?: string | null;
  ip?: string | null;
  expiresAt: Date;
}

export interface SessionResponse {
  id: string;
  userId: string;
  userAgent: string | null;
  ip: string | null;
  isRevoked: boolean;
  expiresAt: Date;
  createdAt: Date;
}

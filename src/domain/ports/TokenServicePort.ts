export interface TokenPayload {
  userId: string;
  email: string;
  roleId: string;
  permissions: string[];
}

export interface TokenServicePort {
  generateAccessToken(payload: TokenPayload): string;
  generateRefreshToken(payload: TokenPayload): string;
  verifyAccessToken(token: string): TokenPayload;
  verifyRefreshToken(token: string): TokenPayload;
  hashToken(token: string): Promise<string>;
}

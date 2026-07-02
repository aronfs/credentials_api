import { Session, CreateSessionInput } from "../entities/Session";

export interface SessionRepositoryPort {
  create(input: CreateSessionInput): Promise<Session>;
  findByRefreshTokenHash(refreshTokenHash: string): Promise<Session | null>;
  findActiveByUserId(userId: string): Promise<Session[]>;
  revoke(id: string): Promise<boolean>;
  revokeAllByUserId(userId: string): Promise<boolean>;
  deleteExpired(): Promise<number>;
}

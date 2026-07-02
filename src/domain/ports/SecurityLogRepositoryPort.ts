import { SecurityLog, CreateSecurityLogInput } from "../entities/SecurityLog";

export interface SecurityLogRepositoryPort {
  create(input: CreateSecurityLogInput): Promise<SecurityLog>;
  findAllByUserId(userId: string): Promise<SecurityLog[]>;
  findAll(): Promise<SecurityLog[]>;
  findByUserIdAndAction(userId: string, action: string): Promise<SecurityLog[]>;
}

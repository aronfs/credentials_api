import { Role, CreateRoleInput, UpdateRoleInput } from "../entities/Role";

export interface RoleRepositoryPort {
  create(input: CreateRoleInput): Promise<Role>;
  findAll(): Promise<Role[]>;
  findById(id: string): Promise<Role | null>;
  findByName(name: string): Promise<Role | null>;
  update(id: string, input: UpdateRoleInput): Promise<Role | null>;
  delete(id: string): Promise<boolean>;
}

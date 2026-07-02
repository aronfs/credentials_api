import { User, CreateUserInput, UpdateUserInput } from "../entities/User";

export interface UserRepositoryPort {
  create(input: CreateUserInput): Promise<User>;
  findAll(): Promise<User[]>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  update(id: string, input: UpdateUserInput): Promise<User | null>;
  delete(id: string): Promise<boolean>;
  count(): Promise<number>;
}

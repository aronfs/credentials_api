import { UserRepositoryPort } from "../../../domain/ports/UserRepositoryPort";
import { RoleRepositoryPort } from "../../../domain/ports/RoleRepositoryPort";
import { CredentialRepositoryPort } from "../../../domain/ports/CredentialRepositoryPort";
import { CategoryRepositoryPort } from "../../../domain/ports/CategoryRepositoryPort";
import { ProfileMeData, ProfileUserData, ProfileStats } from "../../dto/ProfileDTO";

export class GetProfileUseCase {
  constructor(
    private userRepository: UserRepositoryPort,
    private roleRepository: RoleRepositoryPort,
    private credentialRepository: CredentialRepositoryPort,
    private categoryRepository: CategoryRepositoryPort
  ) {}

  async execute(userId: string): Promise<ProfileMeData> {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new Error("Usuario no encontrado");

    const role = await this.roleRepository.findById(user.roleId);
    if (!role) throw new Error("Rol no encontrado");

    const [totalCredentials, totalCategories, totalFavorites] = await Promise.all([
      this.credentialRepository.countByUserId(userId),
      this.categoryRepository.countByUserId(userId),
      this.credentialRepository.countFavoritesByUserId(userId),
    ]);

    const profileUser: ProfileUserData = {
      id: user.id,
      name: user.name,
      email: user.email,
      roleId: user.roleId,
      role: {
        id: role.id,
        name: role.name,
      },
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    const stats: ProfileStats = {
      totalCredentials,
      totalCategories,
      totalFavorites,
    };

    return { user: profileUser, stats };
  }
}
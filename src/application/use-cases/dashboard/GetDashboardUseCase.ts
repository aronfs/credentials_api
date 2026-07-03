import { CredentialRepositoryPort } from "../../../domain/ports/CredentialRepositoryPort";
import { CategoryRepositoryPort } from "../../../domain/ports/CategoryRepositoryPort";
import {
  DashboardMainData,
  DashboardSummary,
  DashboardRecentCredential,
  DashboardTopCategory,
  DashboardFavoriteCredential,
  SecurityAlert,
} from "../../dto/DashboardDTO";

const STALE_DAYS = 90;
const WEAK_THRESHOLD = 40;
const RECENT_DAYS = 7;
const RECENT_LIMIT = 5;

export class GetDashboardUseCase {
  constructor(
    private credentialRepository: CredentialRepositoryPort,
    private categoryRepository: CategoryRepositoryPort
  ) {}

  async execute(userId: string): Promise<DashboardMainData> {
    const [
      totalCredentials,
      totalCategories,
      totalFavorites,
      totalRecentCredentials,
      avgStrength,
      recentCredentials,
      favoriteCredentials,
      allCategories,
      uncategorized,
      staleCredentials,
      weakCredentials,
    ] = await Promise.all([
      this.credentialRepository.countByUserId(userId),
      this.categoryRepository.countByUserId(userId),
      this.credentialRepository.countFavoritesByUserId(userId),
      this.credentialRepository.countRecentByUserId(userId, RECENT_DAYS),
      this.credentialRepository.averageStrengthByUserId(userId),
      this.credentialRepository.findRecentByUserId(userId, RECENT_LIMIT),
      this.credentialRepository.findFavoritesByUserId(userId),
      this.categoryRepository.findAllByUserId(userId),
      this.credentialRepository.findWithNullCategory(userId),
      this.credentialRepository.findStaleCredentials(userId, STALE_DAYS),
      this.credentialRepository.findWeakCredentials(userId, WEAK_THRESHOLD),
    ]);

    const summary: DashboardSummary = {
      totalCredentials,
      totalCategories,
      totalFavorites,
      totalRecentCredentials,
      averageSecurityScore: avgStrength !== null ? Math.round(avgStrength) : 0,
    };

    const recentCreds: DashboardRecentCredential[] = recentCredentials.map((c) => ({
      id: c.id,
      serviceName: c.serviceName,
      loginEmail: c.loginEmail,
      username: c.username,
      categoryId: c.categoryId,
      isFavorite: c.isFavorite,
      createdAt: c.createdAt,
    }));

    const categoryCounts = await this.credentialRepository.countCredentialsByCategory(userId);
    const categoryCountMap = new Map(categoryCounts.map((cc) => [cc.categoryId, cc.count]));

    const topCategories: DashboardTopCategory[] = allCategories
      .map((cat) => ({
        id: cat.id,
        name: cat.name,
        color: cat.color,
        icon: cat.icon,
        totalCredentials: categoryCountMap.get(cat.id) || 0,
      }))
      .sort((a, b) => b.totalCredentials - a.totalCredentials)
      .slice(0, 5);

    const favoriteCreds: DashboardFavoriteCredential[] = favoriteCredentials.slice(0, 5).map((c) => ({
      id: c.id,
      serviceName: c.serviceName,
      loginEmail: c.loginEmail,
      username: c.username,
      categoryId: c.categoryId,
      updatedAt: c.updatedAt,
    }));

    const securityAlerts: SecurityAlert[] = [];

    if (uncategorized.length > 0) {
      securityAlerts.push({
        type: "uncategorized",
        message: "Credenciales sin categoría",
        count: uncategorized.length,
        severity: "medium",
      });
    }

    if (staleCredentials.length > 0) {
      securityAlerts.push({
        type: "stale",
        message: `Credenciales sin actualizar hace más de ${STALE_DAYS} días`,
        count: staleCredentials.length,
        severity: "low",
      });
    }

    if (weakCredentials.length > 0) {
      securityAlerts.push({
        type: "weak",
        message: "Credenciales con contraseña débil",
        count: weakCredentials.length,
        severity: "high",
      });
    }

    return {
      summary,
      recentCredentials: recentCreds,
      favoriteCredentials: favoriteCreds,
      topCategories,
      securityAlerts,
    };
  }
}
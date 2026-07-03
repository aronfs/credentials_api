export interface DashboardSummary {
  totalCredentials: number;
  totalCategories: number;
  totalFavorites: number;
  totalRecentCredentials: number;
  averageSecurityScore: number;
}

export interface DashboardRecentCredential {
  id: string;
  serviceName: string;
  loginEmail: string | null;
  username: string | null;
  categoryId: string | null;
  isFavorite: boolean;
  createdAt: Date;
}

export interface DashboardTopCategory {
  id: string;
  name: string;
  color: string;
  icon: string;
  totalCredentials: number;
}

export interface DashboardFavoriteCredential {
  id: string;
  serviceName: string;
  loginEmail: string | null;
  username: string | null;
  categoryId: string | null;
  updatedAt: Date;
}

export interface SecurityAlert {
  type: "uncategorized" | "stale" | "weak";
  message: string;
  count: number;
  severity: "low" | "medium" | "high";
}

export interface DashboardMainData {
  summary: DashboardSummary;
  recentCredentials: DashboardRecentCredential[];
  favoriteCredentials: DashboardFavoriteCredential[];
  topCategories: DashboardTopCategory[];
  securityAlerts: SecurityAlert[];
}
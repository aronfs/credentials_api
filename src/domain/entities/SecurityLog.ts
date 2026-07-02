export interface SecurityLog {
  id: string;
  userId: string;
  action: SecurityLogAction;
  credentialId: string | null;
  ip: string | null;
  userAgent: string | null;
  createdAt: Date;
}

export interface CreateSecurityLogInput {
  userId: string;
  action: SecurityLogAction;
  credentialId?: string | null;
  ip?: string | null;
  userAgent?: string | null;
}

export enum SecurityLogAction {
  LOGIN = "LOGIN",
  LOGOUT = "LOGOUT",
  CREATE_CREDENTIAL = "CREATE_CREDENTIAL",
  UPDATE_CREDENTIAL = "UPDATE_CREDENTIAL",
  DELETE_CREDENTIAL = "DELETE_CREDENTIAL",
  VIEW_PASSWORD = "VIEW_PASSWORD",
  CREATE_CATEGORY = "CREATE_CATEGORY",
  UPDATE_CATEGORY = "UPDATE_CATEGORY",
  DELETE_CATEGORY = "DELETE_CATEGORY",
}

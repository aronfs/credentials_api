import express from "express";
import cors from "cors";
import helmet from "helmet";
import { env } from "./infrastructure/config/env";
import { connectDatabase, disconnectDatabase } from "./infrastructure/database/prisma/PrismaClient";

import { PrismaUserRepository } from "./infrastructure/database/prisma/repositories/PrismaUserRepository";
import { PrismaRoleRepository } from "./infrastructure/database/prisma/repositories/PrismaRoleRepository";
import { PrismaCredentialRepository } from "./infrastructure/database/prisma/repositories/PrismaCredentialRepository";
import { PrismaCategoryRepository } from "./infrastructure/database/prisma/repositories/PrismaCategoryRepository";
import { PrismaSessionRepository } from "./infrastructure/database/prisma/repositories/PrismaSessionRepository";
import { PrismaSecurityLogRepository } from "./infrastructure/database/prisma/repositories/PrismaSecurityLogRepository";

import { BunHashService } from "./infrastructure/security/BunHashService";
import { JwtTokenService } from "./infrastructure/security/JwtTokenService";
import { AesGcmEncryptionService } from "./infrastructure/security/AesGcmEncryptionService";

import { RegisterUserUseCase } from "./application/use-cases/auth/RegisterUserUseCase";
import { LoginUseCase } from "./application/use-cases/auth/LoginUseCase";
import { RefreshTokenUseCase } from "./application/use-cases/auth/RefreshTokenUseCase";
import { LogoutUseCase } from "./application/use-cases/auth/LogoutUseCase";
import { VerifyPinUseCase } from "./application/use-cases/auth/VerifyPinUseCase";
import { CreateUserUseCase } from "./application/use-cases/users/CreateUserUseCase";
import { ListUsersUseCase } from "./application/use-cases/users/ListUsersUseCase";
import { GetUserByIdUseCase } from "./application/use-cases/users/GetUserByIdUseCase";
import { UpdateUserUseCase } from "./application/use-cases/users/UpdateUserUseCase";
import { DeleteUserUseCase } from "./application/use-cases/users/DeleteUserUseCase";
import { CreateRoleUseCase } from "./application/use-cases/roles/CreateRoleUseCase";
import { ListRolesUseCase } from "./application/use-cases/roles/ListRolesUseCase";
import { UpdateRoleUseCase } from "./application/use-cases/roles/UpdateRoleUseCase";
import { DeleteRoleUseCase } from "./application/use-cases/roles/DeleteRoleUseCase";
import { AssignRoleUseCase } from "./application/use-cases/roles/AssignRoleUseCase";
import { CreateCredentialUseCase } from "./application/use-cases/credentials/CreateCredentialUseCase";
import { ListCredentialsUseCase } from "./application/use-cases/credentials/ListCredentialsUseCase";
import { GetCredentialByIdUseCase } from "./application/use-cases/credentials/GetCredentialByIdUseCase";
import { UpdateCredentialUseCase } from "./application/use-cases/credentials/UpdateCredentialUseCase";
import { DeleteCredentialUseCase } from "./application/use-cases/credentials/DeleteCredentialUseCase";
import { ToggleFavoriteCredentialUseCase } from "./application/use-cases/credentials/ToggleFavoriteCredentialUseCase";
import { SearchCredentialsUseCase } from "./application/use-cases/credentials/SearchCredentialsUseCase";
import { ViewCredentialPasswordUseCase } from "./application/use-cases/credentials/ViewCredentialPasswordUseCase";
import { CreateCategoryUseCase } from "./application/use-cases/categories/CreateCategoryUseCase";
import { ListCategoriesUseCase } from "./application/use-cases/categories/ListCategoriesUseCase";
import { UpdateCategoryUseCase } from "./application/use-cases/categories/UpdateCategoryUseCase";
import { DeleteCategoryUseCase } from "./application/use-cases/categories/DeleteCategoryUseCase";
import { ListSecurityLogsUseCase } from "./application/use-cases/security/ListSecurityLogsUseCase";

import { AuthController } from "./interfaces/http/controllers/AuthController";
import { UserController } from "./interfaces/http/controllers/UserController";
import { RoleController } from "./interfaces/http/controllers/RoleController";
import { CredentialController } from "./interfaces/http/controllers/CredentialController";
import { CategoryController } from "./interfaces/http/controllers/CategoryController";
import { SecurityLogController } from "./interfaces/http/controllers/SecurityLogController";

import { createAuthRouter } from "./interfaces/http/routes/auth.routes";
import { createUserRouter } from "./interfaces/http/routes/user.routes";
import { createRoleRouter } from "./interfaces/http/routes/role.routes";
import { createCredentialRouter } from "./interfaces/http/routes/credential.routes";
import { createCategoryRouter } from "./interfaces/http/routes/category.routes";
import { createSecurityLogRouter } from "./interfaces/http/routes/security-log.routes";

import { errorMiddleware } from "./interfaces/http/middlewares/errorMiddleware";

async function main(): Promise<void> {
  await connectDatabase();

  const app = express();

  app.use(helmet());
  app.use(cors({
    origin: env.NODE_ENV === "production" ? process.env.CORS_ORIGIN : "*",
    credentials: true,
  }));
  app.use(express.json({ limit: "10mb" }));

  const userRepository = new PrismaUserRepository();
  const roleRepository = new PrismaRoleRepository();
  const credentialRepository = new PrismaCredentialRepository();
  const categoryRepository = new PrismaCategoryRepository();
  const sessionRepository = new PrismaSessionRepository();
  const securityLogRepository = new PrismaSecurityLogRepository();

  const hashService = new BunHashService();
  const tokenService = new JwtTokenService();
  const encryptionService = new AesGcmEncryptionService();

  const registerUserUseCase = new RegisterUserUseCase(
    userRepository, roleRepository, hashService, tokenService, sessionRepository
  );
  const loginUseCase = new LoginUseCase(
    userRepository, roleRepository, hashService, tokenService, sessionRepository, securityLogRepository
  );
  const refreshTokenUseCase = new RefreshTokenUseCase(
    tokenService, sessionRepository, userRepository, roleRepository
  );
  const logoutUseCase = new LogoutUseCase(sessionRepository, tokenService, securityLogRepository);
  const verifyPinUseCase = new VerifyPinUseCase(userRepository, hashService);

  const createUserUseCase = new CreateUserUseCase(userRepository, hashService);
  const listUsersUseCase = new ListUsersUseCase(userRepository);
  const getUserByIdUseCase = new GetUserByIdUseCase(userRepository);
  const updateUserUseCase = new UpdateUserUseCase(userRepository, hashService);
  const deleteUserUseCase = new DeleteUserUseCase(userRepository);

  const createRoleUseCase = new CreateRoleUseCase(roleRepository);
  const listRolesUseCase = new ListRolesUseCase(roleRepository);
  const updateRoleUseCase = new UpdateRoleUseCase(roleRepository);
  const deleteRoleUseCase = new DeleteRoleUseCase(roleRepository);
  const assignRoleUseCase = new AssignRoleUseCase(userRepository, roleRepository);

  const createCredentialUseCase = new CreateCredentialUseCase(
    credentialRepository, encryptionService, securityLogRepository
  );
  const listCredentialsUseCase = new ListCredentialsUseCase(credentialRepository);
  const getCredentialByIdUseCase = new GetCredentialByIdUseCase(credentialRepository);
  const updateCredentialUseCase = new UpdateCredentialUseCase(
    credentialRepository, encryptionService, securityLogRepository
  );
  const deleteCredentialUseCase = new DeleteCredentialUseCase(
    credentialRepository, securityLogRepository
  );
  const toggleFavoriteCredentialUseCase = new ToggleFavoriteCredentialUseCase(credentialRepository);
  const searchCredentialsUseCase = new SearchCredentialsUseCase(credentialRepository);
  const viewCredentialPasswordUseCase = new ViewCredentialPasswordUseCase(
    credentialRepository, encryptionService, securityLogRepository, roleRepository
  );

  const createCategoryUseCase = new CreateCategoryUseCase(categoryRepository, securityLogRepository);
  const listCategoriesUseCase = new ListCategoriesUseCase(categoryRepository);
  const updateCategoryUseCase = new UpdateCategoryUseCase(categoryRepository, securityLogRepository);
  const deleteCategoryUseCase = new DeleteCategoryUseCase(categoryRepository, securityLogRepository);

  const listSecurityLogsUseCase = new ListSecurityLogsUseCase(securityLogRepository);

  const authController = new AuthController(
    registerUserUseCase, loginUseCase, refreshTokenUseCase, logoutUseCase, verifyPinUseCase
  );
  const userController = new UserController(
    createUserUseCase, listUsersUseCase, getUserByIdUseCase, updateUserUseCase, deleteUserUseCase
  );
  const roleController = new RoleController(
    createRoleUseCase, listRolesUseCase, updateRoleUseCase, deleteRoleUseCase, assignRoleUseCase
  );
  const credentialController = new CredentialController(
    createCredentialUseCase, listCredentialsUseCase, getCredentialByIdUseCase,
    updateCredentialUseCase, deleteCredentialUseCase, toggleFavoriteCredentialUseCase,
    searchCredentialsUseCase, viewCredentialPasswordUseCase
  );
  const categoryController = new CategoryController(
    createCategoryUseCase, listCategoriesUseCase, updateCategoryUseCase, deleteCategoryUseCase
  );
  const securityLogController = new SecurityLogController(listSecurityLogsUseCase);

  app.use("/api/auth", createAuthRouter(authController));
  app.use("/api/users", createUserRouter(userController));
  app.use("/api/roles", createRoleRouter(roleController));
  app.use("/api/credentials", createCredentialRouter(credentialController));
  app.use("/api/categories", createCategoryRouter(categoryController));
  app.use("/api/security-logs", createSecurityLogRouter(securityLogController));

  app.get("/api/health", (_req, res) => {
    res.json({ success: true, message: "API funcionando correctamente" });
  });

  app.use(errorMiddleware);

  app.listen(env.PORT, () => {
    console.log(`🚀 Servidor corriendo en puerto ${env.PORT}`);
    console.log(`📚 Documentación: http://localhost:${env.PORT}/api/health`);
  });

  process.on("SIGINT", async () => {
    await disconnectDatabase();
    process.exit(0);
  });

  process.on("SIGTERM", async () => {
    await disconnectDatabase();
    process.exit(0);
  });
}

main().catch((error) => {
  console.error("❌ Error al iniciar el servidor:", error);
  process.exit(1);
});

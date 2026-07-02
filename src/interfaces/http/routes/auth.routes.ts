import { Router } from "express";
import { AuthController } from "../controllers/AuthController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { validateRequest } from "../middlewares/validateRequest";
import {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
  logoutSchema,
  verifyPinSchema,
} from "../validators/auth.validator";

export function createAuthRouter(authController: AuthController): Router {
  const router = Router();

  router.post("/register", validateRequest(registerSchema), authController.register);
  router.post("/login", validateRequest(loginSchema), authController.login);
  router.post("/refresh", validateRequest(refreshTokenSchema), authController.refresh);
  router.post("/logout", validateRequest(logoutSchema), authController.logout);
  router.post("/verify-pin", authMiddleware, validateRequest(verifyPinSchema), authController.verifyPin);

  return router;
}

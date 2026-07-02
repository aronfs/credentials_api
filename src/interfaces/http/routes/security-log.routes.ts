import { Router } from "express";
import { SecurityLogController } from "../controllers/SecurityLogController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { permissionMiddleware } from "../middlewares/permissionMiddleware";

export function createSecurityLogRouter(securityLogController: SecurityLogController): Router {
  const router = Router();

  router.use(authMiddleware);

  router.get(
    "/",
    permissionMiddleware("security_logs:read"),
    securityLogController.findAll
  );

  return router;
}

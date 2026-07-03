import { Router } from "express";
import { DashboardController } from "../controllers/DashboardController";
import { authMiddleware } from "../middlewares/authMiddleware";

export function createDashboardRouter(dashboardController: DashboardController): Router {
  const router = Router();

  router.use(authMiddleware);

  router.get("/main", dashboardController.getMain);

  return router;
}
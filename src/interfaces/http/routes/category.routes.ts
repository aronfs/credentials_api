import { Router } from "express";
import { CategoryController } from "../controllers/CategoryController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { permissionMiddleware } from "../middlewares/permissionMiddleware";
import { validateRequest } from "../middlewares/validateRequest";
import { createCategorySchema, updateCategorySchema } from "../validators/category.validator";

export function createCategoryRouter(categoryController: CategoryController): Router {
  const router = Router();

  router.use(authMiddleware);

  router.post(
    "/",
    permissionMiddleware("categories:create"),
    validateRequest(createCategorySchema),
    categoryController.create
  );

  router.get(
    "/",
    permissionMiddleware("categories:read"),
    categoryController.findAll
  );

  router.put(
    "/:id",
    permissionMiddleware("categories:update"),
    validateRequest(updateCategorySchema),
    categoryController.update
  );

  router.delete(
    "/:id",
    permissionMiddleware("categories:delete"),
    categoryController.delete
  );

  return router;
}

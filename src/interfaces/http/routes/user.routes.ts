import { Router } from "express";
import { UserController } from "../controllers/UserController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { permissionMiddleware } from "../middlewares/permissionMiddleware";
import { validateRequest } from "../middlewares/validateRequest";
import { createUserSchema, updateUserSchema } from "../validators/user.validator";

export function createUserRouter(userController: UserController): Router {
  const router = Router();

  router.use(authMiddleware);

  router.post(
    "/",
    permissionMiddleware("users:create"),
    validateRequest(createUserSchema),
    userController.create
  );

  router.get(
    "/",
    permissionMiddleware("users:read"),
    userController.findAll
  );

  router.get(
    "/:id",
    permissionMiddleware("users:read"),
    userController.findById
  );

  router.put(
    "/:id",
    permissionMiddleware("users:update"),
    validateRequest(updateUserSchema),
    userController.update
  );

  router.delete(
    "/:id",
    permissionMiddleware("users:delete"),
    userController.delete
  );

  return router;
}

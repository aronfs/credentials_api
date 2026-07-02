import { Router } from "express";
import { RoleController } from "../controllers/RoleController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { permissionMiddleware } from "../middlewares/permissionMiddleware";
import { validateRequest } from "../middlewares/validateRequest";
import {
  createRoleSchema,
  updateRoleSchema,
  assignRoleSchema,
} from "../validators/role.validator";

export function createRoleRouter(roleController: RoleController): Router {
  const router = Router();

  router.use(authMiddleware);

  router.post(
    "/",
    permissionMiddleware("roles:create"),
    validateRequest(createRoleSchema),
    roleController.create
  );

  router.get(
    "/",
    permissionMiddleware("roles:read"),
    roleController.findAll
  );

  router.get(
    "/:id",
    permissionMiddleware("roles:read"),
    roleController.findById
  );

  router.put(
    "/:id",
    permissionMiddleware("roles:update"),
    validateRequest(updateRoleSchema),
    roleController.update
  );

  router.delete(
    "/:id",
    permissionMiddleware("roles:delete"),
    roleController.delete
  );

  router.post(
    "/assign",
    permissionMiddleware("roles:update"),
    validateRequest(assignRoleSchema),
    roleController.assign
  );

  return router;
}

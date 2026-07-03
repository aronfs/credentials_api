import { Router } from "express";
import { CredentialController } from "../controllers/CredentialController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { permissionMiddleware } from "../middlewares/permissionMiddleware";
import { validateRequest } from "../middlewares/validateRequest";
import {
  createCredentialSchema,
  updateCredentialSchema,
} from "../validators/credential.validator";

export function createCredentialRouter(credentialController: CredentialController): Router {
  const router = Router();

  router.use(authMiddleware);

  router.get(
    "/favorites",
    permissionMiddleware("credentials:read"),
    credentialController.listFavorites
  );

  router.post(
    "/",
    permissionMiddleware("credentials:create"),
    validateRequest(createCredentialSchema),
    credentialController.create
  );

  router.get(
    "/",
    permissionMiddleware("credentials:read"),
    credentialController.findAll
  );

  router.get(
    "/search",
    permissionMiddleware("credentials:read"),
    credentialController.search
  );

  router.get(
    "/:id/password",
    permissionMiddleware("credentials:read"),
    credentialController.viewPassword
  );

  router.get(
    "/:id",
    permissionMiddleware("credentials:read"),
    credentialController.findById
  );

  router.put(
    "/:id",
    permissionMiddleware("credentials:update"),
    validateRequest(updateCredentialSchema),
    credentialController.update
  );

  router.patch(
    "/:id/favorite",
    permissionMiddleware("credentials:update"),
    credentialController.favorite
  );

  router.patch(
    "/:id/unfavorite",
    permissionMiddleware("credentials:update"),
    credentialController.unfavorite
  );

  router.patch(
    "/:id/toggle-favorite",
    permissionMiddleware("credentials:update"),
    credentialController.toggleFavorite
  );

  router.delete(
    "/:id",
    permissionMiddleware("credentials:delete"),
    credentialController.delete
  );

  return router;
}
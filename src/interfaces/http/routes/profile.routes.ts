import { Router } from "express";
import { ProfileController } from "../controllers/ProfileController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { validateRequest } from "../middlewares/validateRequest";
import {
  updateProfileSchema,
  changePinSchema,
  changePasswordSchema,
} from "../validators/profile.validator";

export function createProfileRouter(profileController: ProfileController): Router {
  const router = Router();

  router.use(authMiddleware);

  router.get("/me", profileController.getMe);

  router.put(
    "/me",
    validateRequest(updateProfileSchema),
    profileController.updateMe
  );

  router.patch(
    "/change-pin",
    validateRequest(changePinSchema),
    profileController.changePin
  );

  router.patch(
    "/change-password",
    validateRequest(changePasswordSchema),
    profileController.changePassword
  );

  return router;
}
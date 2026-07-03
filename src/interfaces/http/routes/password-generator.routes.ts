import { Router } from "express";
import { PasswordGeneratorController } from "../controllers/PasswordGeneratorController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { validateRequest } from "../middlewares/validateRequest";
import {
  generatePasswordSchema,
  evaluatePasswordSchema,
} from "../validators/password-generator.validator";

export function createPasswordGeneratorRouter(
  passwordGeneratorController: PasswordGeneratorController
): Router {
  const router = Router();

  router.use(authMiddleware);

  router.post(
    "/generate",
    validateRequest(generatePasswordSchema),
    passwordGeneratorController.generate
  );

  router.post(
    "/evaluate",
    validateRequest(evaluatePasswordSchema),
    passwordGeneratorController.evaluate
  );

  return router;
}
import { Router } from "express";
import { ProfileImageController } from "../controllers/ProfileImageController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { upload } from "../middlewares/uploadMiddleware";

export function createProfileImageRouter(controller: ProfileImageController): Router {
  const router = Router();

  router.use(authMiddleware);

  router.get("/", controller.getMyProfileImage);
  router.get("/file", controller.getMyProfileImageFile);
  router.post("/", upload.single("file"), controller.uploadMyProfileImage);
  router.delete("/", controller.deleteMyProfileImage);

  return router;
}

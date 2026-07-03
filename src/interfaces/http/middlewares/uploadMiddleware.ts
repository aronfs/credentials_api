import multer from "multer";
import { Request, Response, NextFunction } from "express";
import { errorResponse } from "../../../application/dto/ApiResponse";
import { env } from "../../../infrastructure/config/env";

const ALLOWED_MIMES = ["image/jpeg", "image/png", "image/webp"];
const ALLOWED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp"];

const storage = multer.memoryStorage();

const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
): void => {
  if (!file.originalname) {
    cb(new Error("PROFILE_IMAGE_FILE_REQUIRED"));
    return;
  }

  const ext = file.originalname.substring(file.originalname.lastIndexOf(".")).toLowerCase();
  if (!ALLOWED_EXTENSIONS.includes(ext)) {
    cb(new Error("PROFILE_IMAGE_INVALID_EXTENSION"));
    return;
  }

  if (!ALLOWED_MIMES.includes(file.mimetype)) {
    cb(new Error("PROFILE_IMAGE_INVALID_TYPE"));
    return;
  }

  cb(null, true);
};

export const upload = multer({
  storage,
  limits: { fileSize: env.UPLOAD_MAX_FILE_SIZE },
  fileFilter,
});

export function validateUploadedFile(req: Request, res: Response, next: NextFunction): void {
  if (!req.file) {
    res.status(400).json(errorResponse("No se envió ningún archivo", [{ error: "PROFILE_IMAGE_FILE_REQUIRED" }]));
    return;
  }
  next();
}

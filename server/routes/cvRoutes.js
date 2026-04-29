import { Router } from "express";
import { uploadCvAndAnalyze } from "../controllers/cvController.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { uploadCvPdf } from "../middleware/uploadMiddleware.js";

const router = Router();

router.post("/upload", uploadCvPdf, asyncHandler(uploadCvAndAnalyze));

export default router;

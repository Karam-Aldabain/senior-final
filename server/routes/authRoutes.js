import { Router } from "express";
import { login, logout, me, signup } from "../controllers/authController.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { authenticateOptional, requireAuth } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/login", asyncHandler(login));
router.post("/signup", asyncHandler(signup));
router.post("/logout", authenticateOptional, asyncHandler(logout));
router.get("/me", authenticateOptional, requireAuth, asyncHandler(me));

export default router;

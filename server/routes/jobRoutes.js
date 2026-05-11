import { Router } from "express";
import { createJob, deleteJob, getJobById, listJobs, reviewJob, updateJob } from "../controllers/jobController.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { authenticateOptional, requireAuth, requireRole } from "../middleware/authMiddleware.js";

const router = Router();

router.use(authenticateOptional);

router.get("/", asyncHandler(listJobs));
router.get("/:id", asyncHandler(getJobById));
router.post("/", requireAuth, requireRole("admin", "company"), asyncHandler(createJob));
router.put("/:id", requireAuth, requireRole("admin", "company"), asyncHandler(updateJob));
router.patch("/:id/review", requireAuth, requireRole("admin"), asyncHandler(reviewJob));
router.delete("/:id", requireAuth, requireRole("admin", "company"), asyncHandler(deleteJob));

export default router;

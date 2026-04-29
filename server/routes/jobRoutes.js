import { Router } from "express";
import { createJob, deleteJob, getJobById, listJobs, updateJob } from "../controllers/jobController.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

const router = Router();

router.get("/", asyncHandler(listJobs));
router.get("/:id", asyncHandler(getJobById));
router.post("/", asyncHandler(createJob));
router.put("/:id", asyncHandler(updateJob));
router.delete("/:id", asyncHandler(deleteJob));

export default router;


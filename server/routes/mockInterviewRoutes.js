import { Router } from "express";
import {
  chatWithMockInterviewCoach,
  completeMockInterviewSession,
  createMockInterviewSession,
  getMockInterviewSession,
  restartMockInterviewSession,
  submitMockInterviewAnswer,
} from "../controllers/mockInterviewController.js";

const router = Router();

router.post("/sessions", createMockInterviewSession);
router.get("/sessions/:sessionId", getMockInterviewSession);
router.post("/sessions/:sessionId/answers", submitMockInterviewAnswer);
router.post("/sessions/:sessionId/complete", completeMockInterviewSession);
router.post("/sessions/:sessionId/chat", chatWithMockInterviewCoach);
router.post("/sessions/:sessionId/restart", restartMockInterviewSession);

export default router;

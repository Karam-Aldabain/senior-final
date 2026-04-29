import { asyncHandler } from "../middleware/asyncHandler.js";
import {
  createCoachReply,
  createSession,
  completeSession,
  getSession,
  restartSession,
  submitAnswer,
} from "../services/mockInterviewService.js";
import {
  sanitizeAnswerPayload,
  sanitizeCoachChatPayload,
  sanitizeInterviewSetup,
  sanitizeSessionId,
} from "../utils/mockInterviewValidation.js";

export const createMockInterviewSession = asyncHandler(async (request, response) => {
  const setup = sanitizeInterviewSetup(request.body);
  const session = await createSession(setup);
  response.status(201).json(session);
});

export const getMockInterviewSession = asyncHandler(async (request, response) => {
  const sessionId = sanitizeSessionId(request.params.sessionId);
  response.json(getSession(sessionId));
});

export const submitMockInterviewAnswer = asyncHandler(async (request, response) => {
  const sessionId = sanitizeSessionId(request.params.sessionId);
  const payload = sanitizeAnswerPayload(request.body);
  response.json(await submitAnswer(sessionId, payload));
});

export const completeMockInterviewSession = asyncHandler(async (request, response) => {
  const sessionId = sanitizeSessionId(request.params.sessionId);
  response.json(await completeSession(sessionId));
});

export const chatWithMockInterviewCoach = asyncHandler(async (request, response) => {
  const sessionId = sanitizeSessionId(request.params.sessionId);
  const payload = sanitizeCoachChatPayload(request.body);
  response.json(await createCoachReply(sessionId, payload.message));
});

export const restartMockInterviewSession = asyncHandler(async (request, response) => {
  const sessionId = sanitizeSessionId(request.params.sessionId);
  response.status(201).json(await restartSession(sessionId));
});

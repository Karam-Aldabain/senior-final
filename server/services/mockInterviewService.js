import { createCoachResponse } from "./aiProviderService.js";
import {
  generateFallbackCoachReply,
  generateFallbackFeedback,
  generateFallbackQuestions,
  generateFallbackSummary,
} from "../utils/mockInterviewFallback.js";
import {
  buildAnswerFeedbackPrompt,
  buildInterviewCoachPrompt,
  buildInterviewQuestionsPrompt,
  buildInterviewSummaryPrompt,
} from "../utils/mockInterviewPrompts.js";

const sessions = new Map();

function createId(prefix) {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

function safeJsonParse(text) {
  if (!text || typeof text !== "string") {
    return null;
  }

  const cleaned = text.trim().replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/\s*```$/i, "");

  try {
    return JSON.parse(cleaned);
  } catch {
    const jsonStart = cleaned.indexOf("{");
    const jsonEnd = cleaned.lastIndexOf("}");

    if (jsonStart >= 0 && jsonEnd > jsonStart) {
      try {
        return JSON.parse(cleaned.slice(jsonStart, jsonEnd + 1));
      } catch {
        return null;
      }
    }

    return null;
  }
}

function sanitizeQuestion(question, index, setup) {
  return {
    id: typeof question?.id === "string" ? question.id : `question-${index + 1}`,
    index,
    category: typeof question?.category === "string" ? question.category : setup.interviewType,
    prompt: typeof question?.prompt === "string" ? question.prompt.trim() : "",
    focusAreas: Array.isArray(question?.focusAreas)
      ? question.focusAreas.filter((item) => typeof item === "string" && item.trim()).slice(0, 5)
      : [],
    expectedPoints: Array.isArray(question?.expectedPoints)
      ? question.expectedPoints.filter((item) => typeof item === "string" && item.trim()).slice(0, 5)
      : [],
    difficultyNote:
      typeof question?.difficultyNote === "string"
        ? question.difficultyNote.trim()
        : `${setup.difficulty} ${setup.interviewType} question`,
  };
}

function sanitizeFeedback(feedback, fallbackFeedback) {
  if (!feedback || typeof feedback !== "object") {
    return fallbackFeedback;
  }

  const normalizeScore = (value, fallback) => {
    const numeric = Number(value);
    return Number.isFinite(numeric) ? Math.max(0, Math.min(100, Math.round(numeric))) : fallback;
  };

  const normalizeStringList = (value, fallback) =>
    Array.isArray(value) && value.length
      ? value.filter((item) => typeof item === "string" && item.trim()).slice(0, 5)
      : fallback;

  return {
    overallScore: normalizeScore(feedback.overallScore, fallbackFeedback.overallScore),
    confidenceScore: normalizeScore(feedback.confidenceScore, fallbackFeedback.confidenceScore),
    clarityScore: normalizeScore(feedback.clarityScore, fallbackFeedback.clarityScore),
    structureScore: normalizeScore(feedback.structureScore, fallbackFeedback.structureScore),
    strengths: normalizeStringList(feedback.strengths, fallbackFeedback.strengths),
    weaknesses: normalizeStringList(feedback.weaknesses, fallbackFeedback.weaknesses),
    missedPoints: normalizeStringList(feedback.missedPoints, fallbackFeedback.missedPoints),
    sampleAnswer:
      typeof feedback.sampleAnswer === "string" && feedback.sampleAnswer.trim()
        ? feedback.sampleAnswer.trim()
        : fallbackFeedback.sampleAnswer,
    coachingTips: normalizeStringList(feedback.coachingTips, fallbackFeedback.coachingTips),
    roleSpecificSuggestions: normalizeStringList(
      feedback.roleSpecificSuggestions,
      fallbackFeedback.roleSpecificSuggestions
    ),
  };
}

async function createAiQuestions(setup) {
  const prompt = buildInterviewQuestionsPrompt(setup);
  const result = await createCoachResponse(prompt);
  const parsed = safeJsonParse(result.text);
  const questions = Array.isArray(parsed?.questions) ? parsed.questions : [];

  if (!questions.length) {
    throw new Error("AI did not return any interview questions.");
  }

  return {
    questions: questions.map((question, index) => sanitizeQuestion(question, index, setup)),
    model: result.model || "provider",
  };
}

async function createAiFeedback(session, answerEntry) {
  const prompt = buildAnswerFeedbackPrompt(session, answerEntry);
  const result = await createCoachResponse(prompt);
  return {
    feedback: safeJsonParse(result.text),
    model: result.model || "provider",
  };
}

async function createAiSummary(session) {
  const prompt = buildInterviewSummaryPrompt(session);
  const result = await createCoachResponse(prompt);
  return {
    summary: safeJsonParse(result.text),
    model: result.model || "provider",
  };
}

async function createAiCoachReply(session, message) {
  const prompt = buildInterviewCoachPrompt(session, message);
  const result = await createCoachResponse(prompt);
  return {
    reply: result.text?.trim(),
    model: result.model || "provider",
  };
}

function cloneSession(session) {
  return JSON.parse(JSON.stringify(session));
}

function getSessionOrThrow(sessionId) {
  const session = sessions.get(sessionId);

  if (!session) {
    const error = new Error("Interview session not found.");
    error.status = 404;
    throw error;
  }

  return session;
}

function buildAnswerEntry(question, payload) {
  return {
    id: createId("answer"),
    questionId: question.id,
    index: question.index,
    category: question.category,
    questionPrompt: question.prompt,
    expectedPoints: question.expectedPoints,
    answer: payload.answer,
    skipped: payload.skipped,
    createdAt: new Date().toISOString(),
    feedback: null,
    feedbackMode: null,
  };
}

function buildCompletionStats(session) {
  const answeredCount = session.answers.filter((entry) => entry.answer || entry.skipped).length;
  const savedCount = session.answers.filter((entry) => entry.answer).length;

  return {
    totalQuestions: session.questions.length,
    answeredCount,
    skippedCount: session.answers.filter((entry) => entry.skipped).length,
    savedCount,
    completionRate: Math.round((answeredCount / session.questions.length) * 100),
  };
}

function normalizeSummary(summary, fallbackSummary) {
  if (!summary || typeof summary !== "object") {
    return fallbackSummary;
  }

  const normalizeList = (value, fallback) =>
    Array.isArray(value) && value.length
      ? value.filter((item) => typeof item === "string" && item.trim()).slice(0, 5)
      : fallback;

  return {
    overallScore: Number.isFinite(Number(summary.overallScore))
      ? Math.max(0, Math.min(100, Math.round(Number(summary.overallScore))))
      : fallbackSummary.overallScore,
    completionRate: Number.isFinite(Number(summary.completionRate))
      ? Math.max(0, Math.min(100, Math.round(Number(summary.completionRate))))
      : fallbackSummary.completionRate,
    bestAnswerId:
      typeof summary.bestAnswerId === "string" ? summary.bestAnswerId : fallbackSummary.bestAnswerId,
    weakestAnswerId:
      typeof summary.weakestAnswerId === "string"
        ? summary.weakestAnswerId
        : fallbackSummary.weakestAnswerId,
    topImprovementAreas: normalizeList(summary.topImprovementAreas, fallbackSummary.topImprovementAreas),
    nextPracticeFocus: normalizeList(summary.nextPracticeFocus, fallbackSummary.nextPracticeFocus),
    overallStrengths: normalizeList(summary.overallStrengths, fallbackSummary.overallStrengths),
    overallWeaknesses: normalizeList(summary.overallWeaknesses, fallbackSummary.overallWeaknesses),
    interviewerSummary:
      typeof summary.interviewerSummary === "string" && summary.interviewerSummary.trim()
        ? summary.interviewerSummary.trim()
        : fallbackSummary.interviewerSummary,
  };
}

export async function createSession(setup) {
  let questionResult;
  let mode = "local-fallback";

  try {
    questionResult = await createAiQuestions(setup);
    mode = "ai";
  } catch {
    questionResult = {
      questions: generateFallbackQuestions(setup),
      model: "local-fallback",
    };
  }

  const session = {
    id: createId("interview"),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: "active",
    mode,
    providerModel: questionResult.model,
    setup,
    questions: questionResult.questions,
    answers: [],
    coachMessages: [],
    summary: null,
  };

  sessions.set(session.id, session);
  return cloneSession(session);
}

export function getSession(sessionId) {
  return cloneSession(getSessionOrThrow(sessionId));
}

export async function submitAnswer(sessionId, payload) {
  const session = getSessionOrThrow(sessionId);
  const question = session.questions.find((item) => item.id === payload.questionId);

  if (!question) {
    const error = new Error("Question not found in this session.");
    error.status = 404;
    throw error;
  }

  const existingIndex = session.answers.findIndex((entry) => entry.questionId === question.id);
  const answerEntry = buildAnswerEntry(question, payload);
  const fallbackFeedback = generateFallbackFeedback(session, answerEntry);
  let feedbackResult;

  try {
    feedbackResult = await createAiFeedback(session, answerEntry);
  } catch {
    feedbackResult = {
      feedback: fallbackFeedback,
      model: "local-fallback",
    };
  }

  answerEntry.feedback = sanitizeFeedback(feedbackResult.feedback, fallbackFeedback);
  answerEntry.feedbackMode = feedbackResult.model;

  if (existingIndex >= 0) {
    session.answers[existingIndex] = answerEntry;
  } else {
    session.answers.push(answerEntry);
  }

  session.updatedAt = new Date().toISOString();

  return {
    session: cloneSession(session),
    answer: cloneSession(answerEntry),
    stats: buildCompletionStats(session),
  };
}

export async function completeSession(sessionId) {
  const session = getSessionOrThrow(sessionId);
  const fallbackSummary = generateFallbackSummary(session);
  let summaryResult;

  try {
    summaryResult = await createAiSummary(session);
  } catch {
    summaryResult = {
      summary: fallbackSummary,
      model: "local-fallback",
    };
  }

  session.status = "completed";
  session.updatedAt = new Date().toISOString();
  session.summary = {
    ...normalizeSummary(summaryResult.summary, fallbackSummary),
    stats: buildCompletionStats(session),
    mode: summaryResult.model,
  };

  return cloneSession(session);
}

export async function createCoachReply(sessionId, message) {
  const session = getSessionOrThrow(sessionId);
  const userMessage = {
    id: createId("coach_user"),
    role: "user",
    content: message,
    createdAt: new Date().toISOString(),
  };

  session.coachMessages.push(userMessage);

  let replyResult;

  try {
    replyResult = await createAiCoachReply(session, message);
  } catch {
    replyResult = {
      reply: generateFallbackCoachReply(session, message),
      model: "local-fallback",
    };
  }

  const assistantMessage = {
    id: createId("coach_assistant"),
    role: "assistant",
    content: replyResult.reply || generateFallbackCoachReply(session, message),
    createdAt: new Date().toISOString(),
    mode: replyResult.model,
  };

  session.coachMessages = [...session.coachMessages.slice(-11), assistantMessage];
  session.updatedAt = new Date().toISOString();

  return {
    reply: assistantMessage,
    session: cloneSession(session),
  };
}

export async function restartSession(sessionId) {
  const existing = getSessionOrThrow(sessionId);
  return createSession(existing.setup);
}

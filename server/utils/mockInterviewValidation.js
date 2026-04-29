const EXPERIENCE_LEVELS = ["entry", "junior", "mid", "senior"];
const INTERVIEW_TYPES = ["hr", "technical", "behavioral", "mixed"];
const DIFFICULTY_LEVELS = ["easy", "medium", "hard"];

function sanitizeString(value, maxLength = 4000) {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim().slice(0, maxLength);
}

function sanitizeSkillArray(value) {
  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean)
      .slice(0, 12);
  }

  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter((item) => typeof item === "string")
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 12);
}

function assertEnum(value, allowed, fieldName) {
  if (!allowed.includes(value)) {
    const error = new Error(`${fieldName} must be one of: ${allowed.join(", ")}.`);
    error.status = 400;
    throw error;
  }
}

export function sanitizeInterviewSetup(body = {}) {
  const role = sanitizeString(body.role || body.jobTitle, 120);
  const experienceLevel = sanitizeString(body.experienceLevel || "mid", 20).toLowerCase();
  const interviewType = sanitizeString(body.interviewType || "mixed", 20).toLowerCase();
  const difficulty = sanitizeString(body.difficulty || "medium", 20).toLowerCase();
  const companyName = sanitizeString(body.companyName, 120);
  const jobDescription = sanitizeString(body.jobDescription, 5000);
  const cvText = sanitizeString(body.cvText, 7000);
  const skills = sanitizeSkillArray(body.skills);
  const questionCount = Math.max(3, Math.min(10, Number(body.questionCount) || 5));

  if (!role) {
    const error = new Error("Job title or target role is required.");
    error.status = 400;
    throw error;
  }

  assertEnum(experienceLevel, EXPERIENCE_LEVELS, "Experience level");
  assertEnum(interviewType, INTERVIEW_TYPES, "Interview type");
  assertEnum(difficulty, DIFFICULTY_LEVELS, "Difficulty");

  return {
    role,
    experienceLevel,
    interviewType,
    difficulty,
    questionCount,
    companyName,
    jobDescription,
    skills,
    cvText,
  };
}

export function sanitizeAnswerPayload(body = {}) {
  const questionId = sanitizeString(body.questionId, 80);
  const answer = sanitizeString(body.answer, 6000);
  const skipped = Boolean(body.skipped);

  if (!questionId) {
    const error = new Error("questionId is required.");
    error.status = 400;
    throw error;
  }

  if (!answer && !skipped) {
    const error = new Error("An answer is required unless the question is skipped.");
    error.status = 400;
    throw error;
  }

  return {
    questionId,
    answer,
    skipped,
  };
}

export function sanitizeCoachChatPayload(body = {}) {
  const message = sanitizeString(body.message, 2500);

  if (!message) {
    const error = new Error("A coach message is required.");
    error.status = 400;
    throw error;
  }

  return { message };
}

export function sanitizeSessionId(value) {
  const sessionId = sanitizeString(value, 120);

  if (!sessionId) {
    const error = new Error("A session id is required.");
    error.status = 400;
    throw error;
  }

  return sessionId;
}

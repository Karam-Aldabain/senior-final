const STORAGE_KEYS = {
  analysis: "jobAssistant.analysis",
  filters: "jobAssistant.filters",
  savedJobs: "jobAssistant.savedJobs",
  coachJobId: "jobAssistant.coachJobId",
  coachChats: "jobAssistant.coachChats",
  mockInterview: "jobAssistant.mockInterview",
};

function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function isObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function readJson(key, fallback) {
  if (!canUseStorage()) {
    return fallback;
  }

  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key, value) {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.setItem(key, JSON.stringify(value));
}

export function readStoredAnalysis() {
  const value = readJson(STORAGE_KEYS.analysis, null);

  if (!isObject(value)) {
    return null;
  }

  return {
    extractedSkills: Array.isArray(value.extractedSkills) ? value.extractedSkills : [],
    rankedJobs: Array.isArray(value.rankedJobs) ? value.rankedJobs : [],
    summary: isObject(value.summary) ? value.summary : null,
    metadata: isObject(value.metadata) ? value.metadata : null,
    fileName: typeof value.fileName === "string" ? value.fileName : "",
    analyzedAt: typeof value.analyzedAt === "string" ? value.analyzedAt : null,
  };
}

export function writeStoredAnalysis(value) {
  writeJson(STORAGE_KEYS.analysis, value);
}

export function clearStoredAnalysis() {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.removeItem(STORAGE_KEYS.analysis);
}

export function readStoredFilters(defaultFilters) {
  const value = readJson(STORAGE_KEYS.filters, defaultFilters);
  return isObject(value) ? { ...defaultFilters, ...value } : defaultFilters;
}

export function writeStoredFilters(filters) {
  writeJson(STORAGE_KEYS.filters, filters);
}

export function readSavedJobs() {
  const savedJobs = readJson(STORAGE_KEYS.savedJobs, []);
  return Array.isArray(savedJobs) ? savedJobs : [];
}

export function writeSavedJobs(savedJobs) {
  writeJson(STORAGE_KEYS.savedJobs, Array.isArray(savedJobs) ? savedJobs : []);
}

export function readStoredCoachJobId() {
  if (!canUseStorage()) {
    return null;
  }

  return window.localStorage.getItem(STORAGE_KEYS.coachJobId);
}

export function writeStoredCoachJobId(jobId) {
  if (!canUseStorage()) {
    return;
  }

  if (jobId === null || jobId === undefined || jobId === "") {
    window.localStorage.removeItem(STORAGE_KEYS.coachJobId);
    return;
  }

  window.localStorage.setItem(STORAGE_KEYS.coachJobId, String(jobId));
}

export function getStoredJobAnalysis(jobId) {
  const analysis = readStoredAnalysis();

  if (!analysis?.rankedJobs?.length) {
    return null;
  }

  return analysis.rankedJobs.find((job) => String(job.id) === String(jobId)) || null;
}

function sanitizeCoachMessages(messages) {
  if (!Array.isArray(messages)) {
    return [];
  }

  return messages
    .filter(
      (message) =>
        message &&
        typeof message === "object" &&
        typeof message.id === "string" &&
        (message.role === "user" || message.role === "assistant") &&
        typeof message.content === "string"
    )
    .map((message) => ({
      id: message.id,
      role: message.role,
      content: message.content,
      createdAt: typeof message.createdAt === "string" ? message.createdAt : new Date().toISOString(),
    }))
    .slice(-20);
}

export function readStoredCoachChat(jobId) {
  if (!jobId) {
    return [];
  }

  const chats = readJson(STORAGE_KEYS.coachChats, {});

  if (!isObject(chats)) {
    return [];
  }

  return sanitizeCoachMessages(chats[String(jobId)]);
}

export function writeStoredCoachChat(jobId, messages) {
  if (!jobId) {
    return;
  }

  const chats = readJson(STORAGE_KEYS.coachChats, {});
  const safeChats = isObject(chats) ? chats : {};
  safeChats[String(jobId)] = sanitizeCoachMessages(messages);
  writeJson(STORAGE_KEYS.coachChats, safeChats);
}

export function clearStoredCoachChat(jobId) {
  if (!canUseStorage() || !jobId) {
    return;
  }

  const chats = readJson(STORAGE_KEYS.coachChats, {});

  if (!isObject(chats)) {
    return;
  }

  delete chats[String(jobId)];
  writeJson(STORAGE_KEYS.coachChats, chats);
}

function sanitizeMockInterviewState(value) {
  if (!isObject(value)) {
    return null;
  }

  return {
    sessionId: typeof value.sessionId === "string" ? value.sessionId : "",
    currentQuestionIndex:
      typeof value.currentQuestionIndex === "number" ? value.currentQuestionIndex : 0,
    drafts: isObject(value.drafts) ? value.drafts : {},
    setup: isObject(value.setup) ? value.setup : null,
    session: isObject(value.session) ? value.session : null,
    savedAt: typeof value.savedAt === "string" ? value.savedAt : new Date().toISOString(),
  };
}

export function readStoredMockInterview() {
  return sanitizeMockInterviewState(readJson(STORAGE_KEYS.mockInterview, null));
}

export function writeStoredMockInterview(value) {
  writeJson(STORAGE_KEYS.mockInterview, sanitizeMockInterviewState(value));
}

export function clearStoredMockInterview() {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.removeItem(STORAGE_KEYS.mockInterview);
}

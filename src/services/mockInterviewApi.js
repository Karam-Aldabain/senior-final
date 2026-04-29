const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

async function parseResponse(response) {
  const rawText = await response.text().catch(() => "");
  let data = null;

  if (rawText) {
    try {
      data = JSON.parse(rawText);
    } catch {
      data = { error: rawText };
    }
  }

  if (!response.ok) {
    throw new Error(data?.error || "Mock interview request failed.");
  }

  return data;
}

async function postJson(path, payload) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return parseResponse(response);
}

export function createInterviewSession(payload) {
  return postJson("/api/mock-interview/sessions", payload);
}

export async function fetchInterviewSession(sessionId) {
  const response = await fetch(`${API_BASE_URL}/api/mock-interview/sessions/${sessionId}`);
  return parseResponse(response);
}

export function submitInterviewAnswer(sessionId, payload) {
  return postJson(`/api/mock-interview/sessions/${sessionId}/answers`, payload);
}

export function completeInterviewSession(sessionId) {
  return postJson(`/api/mock-interview/sessions/${sessionId}/complete`, {});
}

export function chatWithInterviewCoach(sessionId, payload) {
  return postJson(`/api/mock-interview/sessions/${sessionId}/chat`, payload);
}

export function restartInterviewSession(sessionId) {
  return postJson(`/api/mock-interview/sessions/${sessionId}/restart`, {});
}

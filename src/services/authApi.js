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
    throw new Error(data?.error || "Request failed.");
  }

  return data;
}

export async function signIn(payload) {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  return parseResponse(response);
}

export async function signUp(payload) {
  const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  return parseResponse(response);
}

export async function signOut(token) {
  const response = await fetch(`${API_BASE_URL}/api/auth/logout`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  return parseResponse(response);
}

import { authenticateUser, createUser, deleteSession } from "../repositories/authStore.js";

const allowedRoles = new Set(["admin", "company", "job_seeker"]);
const signupRoles = new Set(["company", "job_seeker"]);

export async function login(request, response) {
  const { email, password, role } = request.body || {};

  if (!email || !password || !allowedRoles.has(role)) {
    const error = new Error("Email, password, and role are required.");
    error.status = 400;
    throw error;
  }

  const session = await authenticateUser({ email, password, role });

  if (!session) {
    const error = new Error("Invalid sign-in details.");
    error.status = 401;
    throw error;
  }

  response.json(session);
}

export async function signup(request, response) {
  const { email, password, role, name } = request.body || {};

  if (!email || !password || !signupRoles.has(role)) {
    const error = new Error("Email, password, and role are required.");
    error.status = 400;
    throw error;
  }

  if (String(password).length < 6) {
    const error = new Error("Password must be at least 6 characters.");
    error.status = 400;
    throw error;
  }

  const session = await createUser({ email, password, role, name });
  response.status(201).json(session);
}

export async function logout(request, response) {
  await deleteSession(request.authToken);
  response.json({ ok: true });
}

export async function me(request, response) {
  response.json({ user: request.user || null });
}

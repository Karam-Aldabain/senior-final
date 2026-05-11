import { randomBytes, randomUUID } from "crypto";
import { hashPassword, Session, User, verifyPassword } from "../config/db.js";

const SESSION_DAYS = 7;

function serializeUser(user) {
  if (!user) {
    return null;
  }

  return {
    id: String(user._id),
    email: user.email,
    role: user.role,
    name: user.name,
  };
}

export async function authenticateUser({ email, password, role }) {
  const user = await User.findOne({ email: String(email || "").trim().toLowerCase() });

  if (!user || user.role !== role || !verifyPassword(password || "", user.passwordSalt, user.passwordHash)) {
    return null;
  }

  const now = new Date();
  const session = await Session.create({
    token: randomUUID(),
    userId: user._id,
    expiresAt: new Date(now.getTime() + SESSION_DAYS * 24 * 60 * 60 * 1000),
  });

  return {
    token: session.token,
    user: serializeUser(user),
  };
}

export async function createUser({ email, password, role, name }) {
  const normalizedEmail = String(email || "").trim().toLowerCase();
  const existing = await User.findOne({ email: normalizedEmail });

  if (existing) {
    const error = new Error("An account with this email already exists.");
    error.status = 409;
    throw error;
  }

  const salt = randomBytes(16).toString("hex");
  const user = await User.create({
    email: normalizedEmail,
    passwordSalt: salt,
    passwordHash: hashPassword(password, salt),
    role,
    name: String(name || normalizedEmail.split("@")[0] || "User").trim(),
  });

  const session = await Session.create({
    token: randomUUID(),
    userId: user._id,
    expiresAt: new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000),
  });

  return {
    token: session.token,
    user: serializeUser(user),
  };
}

export async function getUserByToken(token) {
  if (!token) {
    return null;
  }

  const session = await Session.findOne({ token, expiresAt: { $gt: new Date() } }).populate("userId");
  return serializeUser(session?.userId);
}

export async function deleteSession(token) {
  if (!token) {
    return;
  }

  await Session.deleteOne({ token });
}

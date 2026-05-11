import { getUserByToken } from "../repositories/authStore.js";

function getBearerToken(request) {
  const header = request.get("authorization") || "";

  if (!header.toLowerCase().startsWith("bearer ")) {
    return "";
  }

  return header.slice(7).trim();
}

export async function authenticateOptional(request, _response, next) {
  const token = getBearerToken(request);
  request.authToken = token;
  request.user = token ? await getUserByToken(token) : null;
  next();
}

export function requireAuth(request, _response, next) {
  if (!request.user) {
    const error = new Error("Sign in is required.");
    error.status = 401;
    next(error);
    return;
  }

  next();
}

export function requireRole(...roles) {
  return (request, _response, next) => {
    if (!request.user || !roles.includes(request.user.role)) {
      const error = new Error("You do not have permission to perform this action.");
      error.status = 403;
      next(error);
      return;
    }

    next();
  };
}

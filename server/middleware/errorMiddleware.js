export function notFoundHandler(request, _response, next) {
  const error = new Error(`Route not found: ${request.method} ${request.originalUrl}`);
  error.status = 404;
  next(error);
}

export function errorHandler(error, _request, response, _next) {
  const status = Number(error?.status) || 500;
  const isServerError = status >= 500;

  if (isServerError) {
    console.error(error);
  }

  response.status(status).json({
    error:
      isServerError && process.env.NODE_ENV === "production"
        ? "Server failed to process the request."
        : error.message || "Request failed.",
    details: process.env.NODE_ENV === "production" ? undefined : error?.stack,
  });
}

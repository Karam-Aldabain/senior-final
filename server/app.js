import cors from "cors";
import express from "express";
import { getAllowedOrigins } from "./config/env.js";
import cvRoutes from "./routes/cvRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import coachChatRouter from "./routes/coachChat.js";
import mockInterviewRoutes from "./routes/mockInterviewRoutes.js";
import { errorHandler, notFoundHandler } from "./middleware/errorMiddleware.js";

const app = express();
const allowedOrigins = getAllowedOrigins();

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error("Origin not allowed by CORS"));
    },
  })
);

app.use(express.json({ limit: "2mb" }));

app.get("/.well-known/appspecific/com.chrome.devtools.json", (_request, response) => {
  response.status(204).end();
});

app.get("/favicon.ico", (_request, response) => {
  response.status(204).end();
});

app.get("/", (_request, response) => {
  response.json({
    ok: true,
    service: "job-platform-server",
    message: "Backend is running. Use /api/health, /api/jobs, /api/cv/upload, and /api/coach-chat/*.",
  });
});

app.get("/api/health", (_request, response) => {
  response.json({
    ok: true,
    service: "job-platform-server",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/jobs", jobRoutes);
app.use("/api/cv", cvRoutes);
app.use("/api/coach-chat", coachChatRouter);
app.use("/api/mock-interview", mockInterviewRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;

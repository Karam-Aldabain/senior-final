import { Router } from "express";
import { buildCoachPrompt } from "../utils/buildCoachPrompt.js";
import { createCoachResponse, streamCoachResponse } from "../services/aiProviderService.js";
import { createLocalCoachReply } from "../services/localCoachService.js";

const router = Router();

function sanitizeString(value, fallback = "") {
  return typeof value === "string" ? value.trim() : fallback;
}

function sanitizeStringArray(value, limit = 12) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter((item) => typeof item === "string")
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, limit);
}

function sanitizeMessages(value) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter(
      (item) =>
        item &&
        typeof item === "object" &&
        (item.role === "user" || item.role === "assistant") &&
        typeof item.content === "string"
    )
    .map((item) => ({
      role: item.role,
      content: item.content.trim(),
    }))
    .filter((item) => item.content)
    .slice(-8);
}

function sanitizeJob(job) {
  if (!job || typeof job !== "object") {
    return null;
  }

  const title = sanitizeString(job.title);
  const company = sanitizeString(job.company);

  if (!title || !company) {
    return null;
  }

  return {
    id: job.id ?? null,
    title,
    company,
    category: sanitizeString(job.category, "Unknown"),
    level: sanitizeString(job.level, "Unknown"),
    location: sanitizeString(job.location, "Not specified"),
    type: sanitizeString(job.type, "Not specified"),
    description: sanitizeString(job.description),
    overview: sanitizeString(job.overview),
    requirements: sanitizeStringArray(job.requirements || job.skills, 20),
    coreSkills: sanitizeStringArray(job.coreSkills, 10),
    niceToHave: sanitizeStringArray(job.niceToHave, 10),
  };
}

function sanitizeMatchData(matchData) {
  if (!matchData || typeof matchData !== "object") {
    return null;
  }

  return {
    matchScore:
      typeof matchData.matchScore === "number" && Number.isFinite(matchData.matchScore)
        ? Math.max(0, Math.min(100, Math.round(matchData.matchScore)))
        : null,
    matchedSkills: sanitizeStringArray(matchData.matchedSkills, 20),
    missingSkills: sanitizeStringArray(matchData.missingSkills, 20),
    explanation: sanitizeString(matchData.explanation),
  };
}

function sanitizePayload(body) {
  const message = sanitizeString(body?.message);
  const job = sanitizeJob(body?.job);

  if (!message) {
    const error = new Error("A user message is required.");
    error.status = 400;
    throw error;
  }

  if (!job) {
    const error = new Error("Selected job context is required.");
    error.status = 400;
    throw error;
  }

  return {
    message,
    job,
    cvText: sanitizeString(body?.cvText),
    extractedSkills: sanitizeStringArray(body?.extractedSkills, 30),
    matchData: sanitizeMatchData(body?.matchData),
    messages: sanitizeMessages(body?.messages),
    pageContext: sanitizeString(
      body?.pageContext,
      "Coach page focused on improving fit for the selected role."
    ),
  };
}

function writeSse(response, event, data) {
  response.write(`event: ${event}\n`);
  response.write(`data: ${JSON.stringify(data)}\n\n`);
}

async function streamLocalFallback(response, payload) {
  const fallbackText = createLocalCoachReply(payload);
  const chunkSize = 120;

  for (let index = 0; index < fallbackText.length; index += chunkSize) {
    writeSse(response, "chunk", {
      delta: fallbackText.slice(index, index + chunkSize),
    });
  }

  writeSse(response, "done", { text: fallbackText });
  response.end();
}

router.post("/stream", async (request, response, next) => {
  let payload;

  try {
    payload = sanitizePayload(request.body);
    const prompt = buildCoachPrompt(payload);

    response.setHeader("Content-Type", "text/event-stream; charset=utf-8");
    response.setHeader("Cache-Control", "no-cache, no-transform");
    response.setHeader("Connection", "keep-alive");
    response.flushHeaders?.();

    let fullText = "";

    await streamCoachResponse(prompt, {
      onTextDelta(delta) {
        if (!delta) {
          return;
        }

        fullText += delta;
        writeSse(response, "chunk", { delta });
      },
      onCompleted() {
        writeSse(response, "done", { text: fullText.trim() });
        response.end();
      },
    });
  } catch (error) {
    if (!response.headersSent) {
      next(error);
      return;
    }

    if (payload && Number(error?.status || 500) >= 500) {
      await streamLocalFallback(response, payload);
      return;
    }

    writeSse(response, "error", {
      error:
        error?.status === 401
          ? "The AI provider rejected the request. Check your Groq server API key."
          : error?.message || "The AI coach could not generate a reply.",
    });
    response.end();
  }
});

router.post("/message", async (request, response, next) => {
  try {
    const payload = sanitizePayload(request.body);
    const prompt = buildCoachPrompt(payload);
    let result;

    try {
      result = await createCoachResponse(prompt);
    } catch (error) {
      if (Number(error?.status || 500) < 500) {
        throw error;
      }

      result = {
        reply: createLocalCoachReply(payload),
        model: "local-fallback",
      };
    }

    response.json({
      reply: result.text || result.reply,
      model: result.model,
    });
  } catch (error) {
    next(error);
  }
});

export default router;

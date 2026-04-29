import OpenAI from "openai";

let client;
const PROVIDER_TIMEOUT_MS = 45000;

function getApiKey() {
  return process.env.GROQ_API_KEY || process.env.OPENAI_API_KEY || "";
}

function getBaseUrl() {
  return process.env.GROQ_BASE_URL || "https://api.groq.com/openai/v1";
}

function getClient() {
  if (!getApiKey()) {
    const error = new Error("Missing GROQ_API_KEY in server environment.");
    error.status = 500;
    throw error;
  }

  if (!client) {
    client = new OpenAI({
      apiKey: getApiKey(),
      baseURL: getBaseUrl(),
    });
  }

  return client;
}

function getModel() {
  return process.env.GROQ_MODEL || process.env.OPENAI_MODEL || "llama-3.3-70b-versatile";
}

function normalizeContentPart(part) {
  if (typeof part === "string") {
    return part;
  }

  if (part && typeof part === "object") {
    if (typeof part.text === "string") {
      return part.text;
    }

    if (typeof part.content === "string") {
      return part.content;
    }
  }

  return "";
}

function flattenPromptInput(input) {
  if (typeof input === "string") {
    return input;
  }

  if (!Array.isArray(input)) {
    return "";
  }

  return input
    .map((entry) => {
      if (!entry || typeof entry !== "object") {
        return "";
      }

      if (typeof entry.content === "string") {
        return entry.content;
      }

      if (Array.isArray(entry.content)) {
        return entry.content.map((part) => normalizeContentPart(part)).filter(Boolean).join("\n");
      }

      return "";
    })
    .filter(Boolean)
    .join("\n\n");
}

function createMessages(prompt) {
  return [
    {
      role: "system",
      content: prompt.instructions,
    },
    {
      role: "user",
      content: flattenPromptInput(prompt.input),
    },
  ];
}

function createRequestBody(stream = false) {
  return {
    model: getModel(),
    temperature: 0.4,
    max_tokens: Number(process.env.AI_MAX_TOKENS) || 1800,
    stream,
  };
}

function createRequestOptions() {
  return {
    signal: AbortSignal.timeout(PROVIDER_TIMEOUT_MS),
    timeout: PROVIDER_TIMEOUT_MS,
  };
}

function normalizeProviderError(error) {
  if (error?.name === "AbortError" || error?.code === "ABORT_ERR") {
    const timeoutError = new Error(
      "The AI provider timed out while generating a reply. Please try again."
    );
    timeoutError.status = 504;
    return timeoutError;
  }

  return error;
}

export async function streamCoachResponse(prompt, handlers) {
  let stream;

  try {
    stream = await getClient().chat.completions.create(
      {
        ...createRequestBody(true),
        messages: createMessages(prompt),
      },
      createRequestOptions()
    );
  } catch (error) {
    throw normalizeProviderError(error);
  }

  try {
    for await (const chunk of stream) {
      const delta = chunk.choices?.[0]?.delta?.content || "";

      if (delta) {
        handlers.onTextDelta?.(delta);
      }
    }

    handlers.onCompleted?.();
  } catch (error) {
    const normalizedError = normalizeProviderError(error);
    handlers.onError?.(normalizedError);
    throw normalizedError;
  }
}

export async function createCoachResponse(prompt) {
  let response;

  try {
    response = await getClient().chat.completions.create(
      {
        ...createRequestBody(false),
        messages: createMessages(prompt),
      },
      createRequestOptions()
    );
  } catch (error) {
    throw normalizeProviderError(error);
  }

  return {
    text: response.choices?.[0]?.message?.content?.trim() || "",
    model: response.model,
  };
}

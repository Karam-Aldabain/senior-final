const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

async function readErrorMessage(response) {
  const rawText = await response.text().catch(() => "");

  if (!rawText) {
    return "";
  }

  try {
    const parsed = JSON.parse(rawText);
    return parsed.error || rawText;
  } catch {
    return rawText;
  }
}

function parseSseChunk(rawChunk) {
  const lines = rawChunk.split("\n");
  let event = "message";
  const dataLines = [];

  lines.forEach((line) => {
    if (line.startsWith("event:")) {
      event = line.slice(6).trim();
      return;
    }

    if (line.startsWith("data:")) {
      dataLines.push(line.slice(5).trim());
    }
  });

  if (!dataLines.length) {
    return null;
  }

  return {
    event,
    data: JSON.parse(dataLines.join("\n")),
  };
}

export async function streamCoachChat(payload, { onChunk, signal } = {}) {
  const response = await fetch(`${API_BASE_URL}/api/coach-chat/stream`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    signal,
  });

  if (!response.ok || !response.body) {
    const errorText = await readErrorMessage(response);
    throw new Error(errorText || "The AI coach backend could not be reached.");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();

    if (done) {
      break;
    }

    buffer += decoder.decode(value, { stream: true });
    const events = buffer.split("\n\n");
    buffer = events.pop() || "";

    events.forEach((rawEvent) => {
      const parsed = parseSseChunk(rawEvent);

      if (!parsed) {
        return;
      }

      if (parsed.event === "chunk") {
        onChunk?.(parsed.data.delta || "");
        return;
      }

      if (parsed.event === "error") {
        throw new Error(parsed.data.error || "The AI coach stream failed.");
      }
    });
  }
}

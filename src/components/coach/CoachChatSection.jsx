import { useEffect, useMemo, useRef, useState } from "react";
import { LoaderCircle, SendHorizontal, Sparkles, Trash2 } from "lucide-react";
import CoachMessageBubble from "./CoachMessageBubble";
import CoachPromptChips from "./CoachPromptChips";
import { streamCoachChat } from "../../services/coachApi";
import {
  clearStoredCoachChat,
  readStoredCoachChat,
  writeStoredCoachChat,
} from "../../utils/storage";

function createMessage(role, content = "") {
  return {
    id: `${role}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    role,
    content,
    createdAt: new Date().toISOString(),
  };
}

function toApiHistory(messages) {
  return messages.map((message) => ({
    role: message.role,
    content: message.content,
  }));
}

function CoachChatSection({ job, plan, cvText, extractedSkills, matchData }) {
  const [messages, setMessages] = useState(() => readStoredCoachChat(job?.id));
  const [input, setInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");
  const scrollAnchorRef = useRef(null);
  const abortControllerRef = useRef(null);

  const helperText = useMemo(() => {
    if (cvText) {
      return "This coach is using your saved CV analysis, match score, and the selected job to answer with role-specific guidance.";
    }

    return "No CV analysis is saved yet, so the coach will still help using the selected job but the advice will be more general until you add CV data.";
  }, [cvText]);

  useEffect(() => {
    setMessages(readStoredCoachChat(job?.id));
    setError("");
    setInput("");
  }, [job?.id]);

  useEffect(() => {
    writeStoredCoachChat(job?.id, messages);
  }, [job?.id, messages]);

  useEffect(() => {
    scrollAnchorRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, isGenerating]);

  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  async function sendMessage(text) {
    const question = text.trim();
  
    if (!question || isGenerating) {
      return;
    }

    const nextUserMessage = createMessage("user", question);
    const nextAssistantMessage = createMessage("assistant", "");
    const historyForRequest = [...messages, nextUserMessage];

    setError("");
    setInput("");
    setIsGenerating(true);
    setMessages((currentMessages) => [
      ...currentMessages,
      nextUserMessage,
      nextAssistantMessage,
    ]);

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      await streamCoachChat(
        {
          message: question,
          job,
          cvText,
          extractedSkills,
          matchData: {
            matchScore: matchData?.matchScore ?? plan?.matchScore ?? null,
            matchedSkills: matchData?.matchedSkills || plan?.matchedSkills || [],
            missingSkills: matchData?.missingSkills || plan?.missingSkills || [],
            explanation: matchData?.explanation || plan?.explanation || "",
          },
          messages: toApiHistory(historyForRequest),
          pageContext:
            "The user is on the Improve My Match coach page and wants tactical guidance tied to the selected role.",
        },
        {
          signal: controller.signal,
          onChunk(delta) {
            setMessages((currentMessages) =>
              currentMessages.map((message) =>
                message.id === nextAssistantMessage.id
                  ? { ...message, content: `${message.content}${delta}` }
                  : message
              )
            );
          },
        }
      );
    } catch (streamError) {
      if (streamError?.name !== "AbortError") {
        setError(
          streamError?.message ||
            "The AI coach could not generate a reply right now. Please try again."
        );
      }

      setMessages((currentMessages) =>
        currentMessages.filter(
          (message) =>
            message.id !== nextAssistantMessage.id || message.content.trim().length > 0
        )
      );
    } finally {
      abortControllerRef.current = null;
      setIsGenerating(false);
    }
  }

  function handleSubmit(event) {
    event.preventDefault();
    sendMessage(input);
  }

  function handleClearChat() {
    abortControllerRef.current?.abort();
    setMessages([]);
    setError("");
    clearStoredCoachChat(job?.id);
  }

  return (
    <section className="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 bg-[linear-gradient(135deg,_rgba(15,23,42,1)_0%,_rgba(30,41,59,1)_58%,_rgba(2,132,199,0.9)_100%)] px-6 py-8 text-white md:px-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-semibold text-cyan-100">
              <Sparkles className="h-4 w-4" />
              Ask Your AI Career Coach
            </div>
            <h2 className="mt-4 text-3xl font-bold tracking-tight">Real AI chat for this exact role</h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-200">{helperText}</p>
          </div>

          <button
            type="button"
            onClick={handleClearChat}
            className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/15"
          >
            <Trash2 className="h-4 w-4" />
            Clear chat
          </button>
        </div>
      </div>

      <div className="space-y-6 p-6 md:p-8">
        <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
            Suggested prompts
          </p>
          <div className="mt-4">
            <CoachPromptChips disabled={isGenerating} onSelect={sendMessage} />
          </div>
        </div>

        <div className="h-[440px] overflow-y-auto rounded-[28px] border border-slate-200 bg-[radial-gradient(circle_at_top,_rgba(219,234,254,0.38)_0%,_rgba(248,250,252,0.9)_36%,_rgba(255,255,255,1)_100%)] p-4 md:p-6">
          {messages.length > 0 ? (
            <div className="space-y-4">
              {messages.map((message) => (
                <CoachMessageBubble
                  key={message.id}
                  message={message}
                  isStreaming={
                    isGenerating &&
                    message.id === messages[messages.length - 1]?.id &&
                    message.role === "assistant"
                  }
                />
              ))}
              <div ref={scrollAnchorRef} />
            </div>
          ) : (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <div className="rounded-3xl bg-white/90 p-8 shadow-sm ring-1 ring-slate-200">
                <p className="text-lg font-semibold text-slate-900">
                  Ask about missing skills, CV rewrites, projects, interview prep, or whether you should apply.
                </p>
                <p className="mt-3 max-w-xl text-sm leading-7 text-slate-600">
                  The coach already knows the selected job at {job.company}, your current fit score of {plan.matchScore}%, and the most important gaps such as {plan.missingSkills.slice(0, 3).join(", ") || "role-specific evidence"}.
                </p>
              </div>
              <div ref={scrollAnchorRef} />
            </div>
          )}
        </div>

        {error ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        ) : null}

        <form
          onSubmit={handleSubmit}
          className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm"
        >
          <label
            htmlFor="coach-chat-input"
            className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500"
          >
            Your question
          </label>
          <div className="mt-3 flex flex-col gap-3 md:flex-row">
            <textarea
              id="coach-chat-input"
              value={input}
              disabled={isGenerating}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  sendMessage(input);
                }
              }}
              placeholder="Example: Rewrite my CV summary for this job and tell me if I'm ready to apply."
              className="min-h-28 flex-1 resize-none rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-800 outline-none transition focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-70"
            />

            <button
              type="submit"
              disabled={isGenerating || !input.trim()}
              className="inline-flex min-w-44 items-center justify-center gap-2 rounded-3xl bg-blue-600 px-5 py-4 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              {isGenerating ? (
                <>
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <SendHorizontal className="h-4 w-4" />
                  Send
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

export default CoachChatSection;

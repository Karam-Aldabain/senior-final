import { Bot, UserRound } from "lucide-react";

function CoachMessageBubble({ message, isStreaming = false }) {
  const isUser = message.role === "user";

  return (
    <div className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser ? (
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-sm">
          <Bot className="h-5 w-5" />
        </div>
      ) : null}

      <div
        className={`max-w-3xl rounded-[24px] px-4 py-3 text-sm leading-7 shadow-sm ${
          isUser
            ? "bg-blue-600 text-white"
            : "border border-slate-200 bg-white text-slate-800"
        }`}
      >
        <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.18em] opacity-70">
          {isUser ? "You" : "AI Coach"}
        </p>
        <div className="whitespace-pre-wrap">
          {message.content || (isStreaming ? "Thinking..." : "")}
        </div>
      </div>

      {isUser ? (
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-blue-100 text-blue-700 shadow-sm">
          <UserRound className="h-5 w-5" />
        </div>
      ) : null}
    </div>
  );
}

export default CoachMessageBubble;

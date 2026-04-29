import { Bot, MessageSquare, SendHorizonal } from "lucide-react";
import { COACH_PROMPTS } from "../../utils/mockInterview";

function CoachBubble({ role, content }) {
  const isAssistant = role === "assistant";

  return (
    <div className={`flex ${isAssistant ? "justify-start" : "justify-end"}`}>
      <div
        className={`max-w-[88%] rounded-3xl px-4 py-3 text-sm leading-7 shadow-sm ${
          isAssistant
            ? "rounded-bl-md border border-slate-200 bg-white text-slate-700"
            : "rounded-br-md bg-blue-600 text-white"
        }`}
      >
        {content}
      </div>
    </div>
  );
}

function MockInterviewCoachPanel({
  messages,
  coachInput,
  onCoachInputChange,
  onPromptClick,
  onSend,
  isSending,
}) {
  return (
    <section className="rounded-[32px] border border-slate-200 bg-white p-5 shadow-sm md:p-6">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-100 text-blue-700">
          <MessageSquare className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Coach chat</h2>
          <p className="text-sm text-slate-600">Follow up on any answer, ask for a rewrite, or request a harder interviewer move.</p>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {COACH_PROMPTS.map((prompt) => (
          <button
            key={prompt}
            type="button"
            onClick={() => onPromptClick(prompt)}
            className="rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
          >
            {prompt}
          </button>
        ))}
      </div>

      <div className="mt-6 max-h-[380px] space-y-4 overflow-y-auto rounded-[28px] border border-slate-200 bg-slate-50/70 p-4">
        {!messages.length ? (
          <div className="rounded-[24px] border border-dashed border-slate-200 bg-white p-5">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
                <Bot className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-900">Coach is ready</h3>
                <p className="mt-2 text-sm leading-7 text-slate-600">
                  Ask for a stronger version of an answer, a harder follow-up, or a direct diagnosis of what is
                  keeping your responses from sounding interview-ready.
                </p>
              </div>
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <CoachBubble key={message.id} role={message.role} content={message.content} />
          ))
        )}
      </div>

      <div className="mt-5 flex flex-col gap-3">
        <textarea
          value={coachInput}
          onChange={(event) => onCoachInputChange(event.target.value)}
          rows={3}
          placeholder="How could I improve answer 3?"
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-blue-300 focus:ring-4 focus:ring-blue-100"
        />
        <div className="flex justify-end">
          <button
            type="button"
            onClick={onSend}
            disabled={isSending}
            className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <SendHorizonal className="h-4 w-4" />
            {isSending ? "Sending..." : "Ask coach"}
          </button>
        </div>
      </div>
    </section>
  );
}

export default MockInterviewCoachPanel;

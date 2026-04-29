import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  CircleDashed,
  MessageSquareQuote,
  Save,
  Sparkles,
  StopCircle,
} from "lucide-react";

function ScorePill({ label, value, tone = "blue" }) {
  const toneClasses = {
    blue: "border-blue-100 bg-blue-50 text-blue-700",
    emerald: "border-emerald-100 bg-emerald-50 text-emerald-700",
    amber: "border-amber-100 bg-amber-50 text-amber-700",
  };

  return (
    <div className={`rounded-2xl border px-4 py-3 ${toneClasses[tone]}`}>
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em]">{label}</p>
      <p className="mt-1 text-xl font-bold">{value}</p>
    </div>
  );
}

function FeedbackList({ title, items, tone }) {
  const dotClass = tone === "good" ? "bg-emerald-500" : "bg-amber-500";

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <h4 className="text-sm font-semibold text-slate-900">{title}</h4>
      <div className="mt-3 space-y-3">
        {(items || []).map((item) => (
          <div key={item} className="flex gap-3 text-sm leading-6 text-slate-600">
            <span className={`mt-2 h-2 w-2 flex-none rounded-full ${dotClass}`} />
            <span>{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function QuestionRail({ session, currentQuestionIndex, answerMap, onJump }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      {session.questions.map((question, index) => {
        const answer = answerMap[question.id];
        const isActive = index === currentQuestionIndex;
        const isDone = Boolean(answer?.answer || answer?.skipped);

        return (
          <button
            key={question.id}
            type="button"
            onClick={() => onJump(index)}
            className={`flex min-w-[94px] flex-col rounded-2xl border px-3 py-3 text-left transition ${
              isActive
                ? "border-blue-200 bg-blue-50 text-blue-800 shadow-sm"
                : "border-slate-200 bg-white text-slate-600 hover:border-blue-200 hover:bg-blue-50"
            }`}
          >
            <span className="text-[11px] font-semibold uppercase tracking-[0.14em]">Q{index + 1}</span>
            <span className="mt-1 text-xs">{question.category}</span>
            <span className={`mt-2 text-[11px] font-medium ${isDone ? "text-emerald-600" : "text-slate-400"}`}>
              {isDone ? "Reviewed" : "Pending"}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function MockInterviewSessionPanel({
  session,
  currentQuestion,
  currentQuestionIndex,
  currentDraft,
  currentAnswer,
  answerMap,
  completionStats,
  onDraftChange,
  onJumpToQuestion,
  onPrevious,
  onNext,
  onSave,
  onSkip,
  onEndInterview,
  isSaving,
  isCompleting,
}) {
  const feedback = currentAnswer?.feedback || null;

  return (
    <section className="grid gap-6 2xl:grid-cols-[1.16fr_0.84fr]">
      <div className="rounded-[32px] border border-slate-200 bg-white p-5 shadow-sm md:p-8">
        <div className="flex flex-col gap-5 border-b border-slate-100 pb-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-700">Interview Workspace</p>
              <h2 className="mt-2 text-2xl font-bold text-slate-900">{session.setup.role}</h2>
              <p className="mt-2 text-sm text-slate-600">
                Question {currentQuestionIndex + 1} of {session.questions.length} • {completionStats.completionRate}% complete
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <ScorePill label="Answered" value={completionStats.answeredCount} tone="blue" />
              <ScorePill label="Saved" value={session.answers.filter((item) => item.answer).length} tone="emerald" />
              <ScorePill label="Skipped" value={completionStats.skippedCount} tone="amber" />
            </div>
          </div>

          <div className="space-y-3">
            <div className="h-2 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-gradient-to-r from-blue-600 via-sky-500 to-indigo-600 transition-all duration-500"
                style={{ width: `${((currentQuestionIndex + 1) / session.questions.length) * 100}%` }}
              />
            </div>
            <QuestionRail
              session={session}
              currentQuestionIndex={currentQuestionIndex}
              answerMap={answerMap}
              onJump={onJumpToQuestion}
            />
          </div>
        </div>

        <div className="mt-6 rounded-[28px] border border-slate-200 bg-[linear-gradient(180deg,rgba(248,250,252,0.7),rgba(255,255,255,1))] p-5 md:p-6">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-blue-700">
              {currentQuestion.category}
            </span>
            <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600">
              {currentQuestion.difficultyNote}
            </span>
          </div>

          <h3 className="mt-4 text-xl font-semibold leading-8 text-slate-900 md:text-2xl md:leading-9">
            {currentQuestion.prompt}
          </h3>

          <div className="mt-5 flex flex-wrap gap-2">
            {(currentQuestion.focusAreas || []).map((item) => (
              <span
                key={item}
                className="rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-600 shadow-sm ring-1 ring-slate-200"
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <div className="mb-2 flex items-center justify-between gap-3">
            <label className="block text-sm font-semibold text-slate-800">Your answer</label>
            <span className="text-xs text-slate-500">
              {currentDraft.trim() ? `${currentDraft.trim().split(/\s+/).length} words` : "0 words"}
            </span>
          </div>
          <textarea
            value={currentDraft}
            onChange={(event) => onDraftChange(event.target.value)}
            rows={10}
            placeholder="Answer as if this were a real interview. Keep it direct, specific, and evidence-backed."
            className="w-full rounded-[28px] border border-slate-200 bg-white px-5 py-4 text-sm leading-7 text-slate-900 shadow-sm outline-none transition focus:border-blue-300 focus:ring-4 focus:ring-blue-100"
          />
          <div className="mt-3 flex flex-col gap-2 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
            <span>Drafts stay in local storage and sync with the current session as you move through the interview.</span>
            <span>Tip: answer first, then add one result or tradeoff before saving.</span>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3 md:flex-row md:flex-wrap md:items-center">
          <button
            type="button"
            onClick={onPrevious}
            disabled={currentQuestionIndex === 0}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </button>
          <button
            type="button"
            onClick={onSave}
            disabled={isSaving}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Save className="h-4 w-4" />
            {isSaving ? "Saving..." : "Save answer"}
          </button>
          <button
            type="button"
            onClick={onSkip}
            disabled={isSaving}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-3 text-sm font-semibold text-amber-700 transition hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <CircleDashed className="h-4 w-4" />
            Skip
          </button>
          <button
            type="button"
            onClick={onNext}
            disabled={currentQuestionIndex === session.questions.length - 1 || isSaving}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Next question
            <ChevronRight className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={onEndInterview}
            disabled={isCompleting}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 px-5 py-3 text-sm font-semibold text-rose-700 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-60 md:ml-auto"
          >
            <StopCircle className="h-4 w-4" />
            {isCompleting ? "Finishing..." : "End interview"}
          </button>
        </div>
      </div>

      <div className="space-y-6">
        <div className="rounded-[32px] border border-slate-200 bg-white p-5 shadow-sm md:p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-100 text-blue-700">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Live answer review</h3>
              <p className="text-sm text-slate-600">Each saved answer gets scored and coached immediately.</p>
            </div>
          </div>

          {!feedback ? (
            <div className="mt-6 rounded-[24px] border border-dashed border-slate-200 bg-slate-50 p-5">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-blue-700 shadow-sm">
                  <MessageSquareQuote className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-900">No review yet</h4>
                  <p className="mt-2 text-sm leading-7 text-slate-600">
                    Save this answer to unlock scoring, missed points, stronger answer patterns, and specific
                    coaching on what would make the response land better.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <ScorePill label="Overall" value={`${feedback.overallScore}/100`} tone="blue" />
                <ScorePill label="Confidence" value={`${feedback.confidenceScore}/100`} tone="emerald" />
                <ScorePill label="Clarity" value={`${feedback.clarityScore}/100`} tone="blue" />
                <ScorePill label="Structure" value={`${feedback.structureScore}/100`} tone="amber" />
              </div>

              <FeedbackList title="What landed well" items={feedback.strengths} tone="good" />
              <FeedbackList title="What weakened the answer" items={feedback.weaknesses} tone="warn" />
              <FeedbackList title="What the interviewer still wanted" items={feedback.missedPoints} tone="warn" />

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <h4 className="text-sm font-semibold text-slate-900">Stronger answer pattern</h4>
                <p className="mt-3 text-sm leading-7 text-slate-600">{feedback.sampleAnswer}</p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <h4 className="text-sm font-semibold text-slate-900">Coach notes</h4>
                <div className="mt-3 space-y-3">
                  {(feedback.coachingTips || []).map((tip) => (
                    <div key={tip} className="flex gap-3 text-sm leading-6 text-slate-600">
                      <CheckCircle2 className="mt-1 h-4 w-4 flex-none text-blue-600" />
                      <span>{tip}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default MockInterviewSessionPanel;

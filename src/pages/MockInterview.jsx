import { useEffect, useMemo, useRef, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Layers3,
  LoaderCircle,
  RefreshCcw,
  ShieldCheck,
  WandSparkles,
} from "lucide-react";
import MockInterviewCoachPanel from "../components/mockInterview/MockInterviewCoachPanel";
import MockInterviewHero from "../components/mockInterview/MockInterviewHero";
import MockInterviewSessionPanel from "../components/mockInterview/MockInterviewSessionPanel";
import MockInterviewSetupForm from "../components/mockInterview/MockInterviewSetupForm";
import MockInterviewSummaryPanel from "../components/mockInterview/MockInterviewSummaryPanel";
import {
  chatWithInterviewCoach,
  completeInterviewSession,
  createInterviewSession,
  fetchInterviewSession,
  restartInterviewSession,
  submitInterviewAnswer,
} from "../services/mockInterviewApi";
import {
  buildResultsExport,
  createEmptyDrafts,
  DEFAULT_INTERVIEW_SETUP,
  getAnswerMap,
  getCompletionStats,
  getModeLabel,
  parseSkillInput,
  sanitizeSetupPayload,
  stringifySkillInput,
  validateInterviewSetup,
} from "../utils/mockInterview";
import {
  clearStoredMockInterview,
  readStoredMockInterview,
  writeStoredMockInterview,
} from "../utils/storage";

function StatusBanner({ tone = "info", message }) {
  const toneMap = {
    info: "border-blue-100 bg-blue-50 text-blue-800",
    success: "border-emerald-100 bg-emerald-50 text-emerald-800",
    error: "border-rose-100 bg-rose-50 text-rose-800",
  };

  const Icon = tone === "error" ? AlertCircle : CheckCircle2;

  return (
    <div className={`flex items-start gap-3 rounded-2xl border px-4 py-3 text-sm ${toneMap[tone]}`}>
      <Icon className="mt-0.5 h-4 w-4 flex-none" />
      <span>{message}</span>
    </div>
  );
}

function EmptyWorkspaceCard() {
  return (
    <section className="rounded-[32px] border border-slate-200 bg-white p-5 shadow-sm md:p-8">
      <div className="rounded-[28px] border border-dashed border-slate-200 bg-[linear-gradient(180deg,rgba(248,250,252,0.9),rgba(255,255,255,1))] p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-700">
            <WandSparkles className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-slate-900">No interview session yet</h2>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600">
              Start from the setup panel to generate a tailored mock interview. Once the session is created,
              this area becomes your question flow, feedback workspace, coach chat, and final debrief.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function InsightCard({ icon: Icon, title, description }) {
  const IconComponent = Icon;

  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-100 text-blue-700">
        <IconComponent className="h-5 w-5" />
      </div>
      <h3 className="mt-4 text-lg font-semibold text-slate-900">{title}</h3>
      <p className="mt-2 text-sm leading-7 text-slate-600">{description}</p>
    </div>
  );
}

function SessionBrief({ session, onClear }) {
  return (
    <aside className="rounded-[32px] border border-slate-200 bg-white p-5 shadow-sm md:p-6">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-700">Session Brief</p>
      <h2 className="mt-2 text-xl font-semibold text-slate-900">
        {session ? "Current interview context" : "How this workspace behaves"}
      </h2>

      {session ? (
        <div className="mt-5 space-y-4 text-sm leading-7 text-slate-600">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="font-semibold text-slate-900">{session.setup.role}</p>
            <p className="mt-1">
              {session.setup.experienceLevel} • {session.setup.interviewType} • {session.setup.difficulty}
            </p>
            <p className="mt-1">{session.setup.companyName || "No company context added"}</p>
          </div>
          <p>
            Engine: <span className="font-semibold text-slate-900">{getModeLabel(session.mode)}</span>
          </p>
          <p>
            Questions are generated on the backend and the current workspace is preserved locally so refreshes
            do not break the flow.
          </p>

          {session.setup.skills?.length ? (
            <div className="flex flex-wrap gap-2">
              {session.setup.skills.slice(0, 6).map((skill) => (
                <span
                  key={skill}
                  className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600"
                >
                  {skill}
                </span>
              ))}
            </div>
          ) : null}

          <button
            type="button"
            onClick={onClear}
            className="mt-2 inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            <RefreshCcw className="h-4 w-4" />
            Clear saved session
          </button>
        </div>
      ) : (
        <div className="mt-5 space-y-4 text-sm leading-7 text-slate-600">
          <p>
            Sessions are created against the real backend and continue working even without a live provider key.
          </p>
          <p>
            The page is designed as a real interview workspace: setup, live questions, immediate review, coach follow-up, and final summary.
          </p>
          <div className="grid gap-3">
            <InsightCard
              icon={Layers3}
              title="Real workflow"
              description="You move through one question at a time rather than filling a disconnected form."
            />
            <InsightCard
              icon={ShieldCheck}
              title="Resilient by default"
              description="If the AI provider is unavailable, the backend falls back to a local interview engine without breaking the page."
            />
          </div>
        </div>
      )}
    </aside>
  );
}

function mergeDraftsWithAnswers(session, drafts) {
  const nextDrafts = { ...(drafts || {}) };

  (session?.questions || []).forEach((question) => {
    const savedAnswer = (session.answers || []).find((entry) => entry.questionId === question.id);

    if (!Object.prototype.hasOwnProperty.call(nextDrafts, question.id)) {
      nextDrafts[question.id] = savedAnswer?.answer || "";
    }
  });

  return nextDrafts;
}

function downloadResultsFile(content, fileName) {
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  anchor.click();
  URL.revokeObjectURL(url);
}

function MockInterview() {
  const setupRef = useRef(null);
  const workspaceRef = useRef(null);
  const [formState, setFormState] = useState(DEFAULT_INTERVIEW_SETUP);
  const [skillInput, setSkillInput] = useState(stringifySkillInput(DEFAULT_INTERVIEW_SETUP.skills));
  const [formErrors, setFormErrors] = useState({});
  const [session, setSession] = useState(null);
  const [drafts, setDrafts] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [coachInput, setCoachInput] = useState("");
  const [isHydrating, setIsHydrating] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [isSendingCoach, setIsSendingCoach] = useState(false);
  const [isRestarting, setIsRestarting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const answerMap = useMemo(() => getAnswerMap(session), [session]);
  const currentQuestion = session?.questions?.[currentQuestionIndex] || null;
  const currentAnswer = currentQuestion ? answerMap[currentQuestion.id] : null;
  const currentDraft = currentQuestion ? drafts[currentQuestion.id] ?? currentAnswer?.answer ?? "" : "";
  const completionStats = useMemo(() => getCompletionStats(session), [session]);

  useEffect(() => {
    async function hydrateFromStorage() {
      const stored = readStoredMockInterview();

      if (!stored) {
        setIsHydrating(false);
        return;
      }

      if (stored.setup) {
        setFormState((current) => ({ ...current, ...stored.setup }));
        setSkillInput(stringifySkillInput(stored.setup.skills || []));
      }

      if (!stored.sessionId) {
        setIsHydrating(false);
        return;
      }

      try {
        const liveSession = await fetchInterviewSession(stored.sessionId);
        setSession(liveSession);
        setCurrentQuestionIndex(
          Math.min(stored.currentQuestionIndex || 0, Math.max(0, liveSession.questions.length - 1))
        );
        setDrafts(mergeDraftsWithAnswers(liveSession, stored.drafts || {}));
        setSuccessMessage("Resumed your saved interview workspace.");
      } catch {
        clearStoredMockInterview();
        setErrorMessage("A saved setup was restored, but the previous backend session is no longer available.");
      } finally {
        setIsHydrating(false);
      }
    }

    void hydrateFromStorage();
  }, []);

  useEffect(() => {
    writeStoredMockInterview({
      sessionId: session?.id || "",
      currentQuestionIndex,
      drafts,
      setup: formState,
      session,
      savedAt: new Date().toISOString(),
    });
  }, [currentQuestionIndex, drafts, formState, session]);

  function scrollToSetup() {
    setupRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function scrollToWorkspace() {
    workspaceRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function handleFieldChange(field, value) {
    setFormState((current) => ({ ...current, [field]: value }));
  }

  function handleSkillInputChange(value) {
    setSkillInput(value);
    setFormState((current) => ({
      ...current,
      skills: parseSkillInput(value),
    }));
  }

  function handleApplySuggestion(values) {
    const nextState = {
      ...formState,
      ...values,
    };
    setFormState(nextState);
    setSkillInput(stringifySkillInput(nextState.skills || []));
  }

  async function hydrateNewSession(nextSession, nextDrafts = {}) {
    setSession(nextSession);
    setDrafts(mergeDraftsWithAnswers(nextSession, nextDrafts));
    setCurrentQuestionIndex(0);
    setCoachInput("");
    setFormState(nextSession.setup);
    setSkillInput(stringifySkillInput(nextSession.setup.skills || []));
    setTimeout(() => scrollToWorkspace(), 80);
  }

  async function handleCreateSession(event) {
    event?.preventDefault?.();
    setErrorMessage("");
    setSuccessMessage("");

    const errors = validateInterviewSetup(formState);
    setFormErrors(errors);

    if (Object.keys(errors).length) {
      scrollToSetup();
      return;
    }

    setIsCreating(true);

    try {
      const createdSession = await createInterviewSession(sanitizeSetupPayload(formState));
      await hydrateNewSession(createdSession, createEmptyDrafts(createdSession.questions));
      setSuccessMessage("Interview session generated.");
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsCreating(false);
    }
  }

  async function saveAnswerForQuestion(question, options = {}) {
    if (!session || !question) {
      return null;
    }

    const draftValue = String(drafts[question.id] ?? "").trim();
    const shouldSkip = Boolean(options.skip);
    const savedAnswer = answerMap[question.id];

    if (!shouldSkip && !draftValue) {
      setErrorMessage("Write an answer before saving, or use Skip.");
      return null;
    }

    if (!shouldSkip && savedAnswer?.answer === draftValue) {
      return session;
    }

    setIsSaving(true);
    setErrorMessage("");

    try {
      const result = await submitInterviewAnswer(session.id, {
        questionId: question.id,
        answer: shouldSkip ? "" : draftValue,
        skipped: shouldSkip,
      });

      setSession(result.session);
      setDrafts((current) => ({
        ...mergeDraftsWithAnswers(result.session, current),
        [question.id]: shouldSkip ? "" : draftValue,
      }));
      setSuccessMessage(shouldSkip ? "Question skipped and reviewed." : "Answer saved and reviewed.");
      return result.session;
    } catch (error) {
      setErrorMessage(error.message);
      return null;
    } finally {
      setIsSaving(false);
    }
  }

  async function handleSaveCurrent() {
    if (!currentQuestion) {
      return;
    }

    await saveAnswerForQuestion(currentQuestion);
  }

  async function handleSkipCurrent() {
    if (!currentQuestion) {
      return;
    }

    const updatedSession = await saveAnswerForQuestion(currentQuestion, { skip: true });

    if (updatedSession && currentQuestionIndex < updatedSession.questions.length - 1) {
      setCurrentQuestionIndex((index) => index + 1);
    }
  }

  async function handleNextQuestion() {
    if (!session || !currentQuestion) {
      return;
    }

    const draftValue = String(drafts[currentQuestion.id] ?? "").trim();
    const savedAnswer = answerMap[currentQuestion.id];

    if (draftValue && savedAnswer?.answer !== draftValue) {
      const updatedSession = await saveAnswerForQuestion(currentQuestion);

      if (!updatedSession) {
        return;
      }
    }

    setCurrentQuestionIndex((index) => Math.min(index + 1, session.questions.length - 1));
  }

  async function handleCompleteInterview() {
    if (!session) {
      return;
    }

    setIsCompleting(true);
    setErrorMessage("");

    try {
      const completedSession = await completeInterviewSession(session.id);
      setSession(completedSession);
      setDrafts((current) => mergeDraftsWithAnswers(completedSession, current));
      setSuccessMessage("Interview complete. Your debrief is ready.");
      setTimeout(() => scrollToWorkspace(), 80);
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsCompleting(false);
    }
  }

  async function handleCoachSend(promptOverride) {
    if (!session) {
      return;
    }

    const message = String(promptOverride || coachInput).trim();

    if (!message) {
      setErrorMessage("Type a coach question before sending.");
      return;
    }

    setIsSendingCoach(true);
    setErrorMessage("");

    try {
      const result = await chatWithInterviewCoach(session.id, { message });
      setSession(result.session);
      setCoachInput("");
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsSendingCoach(false);
    }
  }

  async function handleRestartInterview() {
    if (!session) {
      return;
    }

    setIsRestarting(true);
    setErrorMessage("");

    try {
      const restartedSession = await restartInterviewSession(session.id);
      await hydrateNewSession(restartedSession, createEmptyDrafts(restartedSession.questions));
      setSuccessMessage("Started a fresh interview with the same blueprint.");
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsRestarting(false);
    }
  }

  async function handleGenerateAnother() {
    if (!session) {
      return;
    }

    setIsCreating(true);
    setErrorMessage("");

    try {
      const newSession = await createInterviewSession(session.setup);
      await hydrateNewSession(newSession, createEmptyDrafts(newSession.questions));
      setSuccessMessage("Generated a new question set from the same setup.");
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsCreating(false);
    }
  }

  async function handleCopyResults() {
    if (!session) {
      return;
    }

    try {
      await navigator.clipboard.writeText(buildResultsExport(session));
      setSuccessMessage("Interview results copied to clipboard.");
    } catch {
      setErrorMessage("Clipboard copy failed in this browser.");
    }
  }

  function handleExportResults() {
    if (!session) {
      return;
    }

    downloadResultsFile(
      buildResultsExport(session),
      `${session.setup.role.replace(/\s+/g, "-").toLowerCase()}-mock-interview.txt`
    );
    setSuccessMessage("Interview results exported.");
  }

  function handleClearSession() {
    clearStoredMockInterview();
    setSession(null);
    setDrafts({});
    setCurrentQuestionIndex(0);
    setCoachInput("");
    setSuccessMessage("Cleared the saved interview session.");
  }

  const bestAnswer = session?.summary?.bestAnswerId
    ? (session.answers || []).find((entry) => entry.questionId === session.summary.bestAnswerId) || null
    : null;
  const weakestAnswer = session?.summary?.weakestAnswerId
    ? (session.answers || []).find((entry) => entry.questionId === session.summary.weakestAnswerId) || null
    : null;

  if (isHydrating) {
    return (
      <main className="bg-slate-50 px-6 py-10 md:py-14">
        <div className="mx-auto flex min-h-[70vh] max-w-7xl items-center justify-center">
          <div className="rounded-[32px] border border-slate-200 bg-white px-8 py-10 text-center shadow-sm">
            <LoaderCircle className="mx-auto h-8 w-8 animate-spin text-blue-600" />
            <h1 className="mt-4 text-xl font-semibold text-slate-900">Restoring interview workspace</h1>
            <p className="mt-2 max-w-md text-sm leading-7 text-slate-600">
              Checking local progress and syncing the current backend session so you can continue where you left off.
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-[linear-gradient(180deg,#f8fafc_0%,#f8fbff_38%,#f8fafc_100%)] px-4 py-8 md:px-6 md:py-14">
      <div className="mx-auto max-w-7xl space-y-8">
        <MockInterviewHero
          hasResume={Boolean(session)}
          onPrimaryAction={session ? scrollToWorkspace : scrollToSetup}
          onSecondaryAction={scrollToSetup}
        />

        <div className="grid gap-4">
          {errorMessage ? <StatusBanner tone="error" message={errorMessage} /> : null}
          {successMessage ? <StatusBanner tone="success" message={successMessage} /> : null}
        </div>

        <div className="grid gap-6 xl:grid-cols-[0.72fr_0.28fr]">
          <div ref={setupRef}>
            <MockInterviewSetupForm
              formState={formState}
              skillInput={skillInput}
              errors={formErrors}
              isSubmitting={isCreating}
              onFieldChange={handleFieldChange}
              onSkillInputChange={handleSkillInputChange}
              onApplySuggestion={handleApplySuggestion}
              onSubmit={handleCreateSession}
            />
          </div>

          <SessionBrief session={session} onClear={handleClearSession} />
        </div>

        <div ref={workspaceRef} className="space-y-6">
          {session ? (
            <>
              <div className="flex flex-wrap items-center gap-3 rounded-[28px] border border-slate-200 bg-white px-5 py-4 shadow-sm">
                <span className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-blue-700">
                  {getModeLabel(session.mode)}
                </span>
                <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">
                  {session.providerModel}
                </span>
                <span className="text-sm text-slate-600">
                  {`${session.setup.role} • ${session.setup.experienceLevel} • ${session.setup.interviewType}`}
                </span>
              </div>

              <MockInterviewSessionPanel
                session={session}
                currentQuestion={currentQuestion}
                currentQuestionIndex={currentQuestionIndex}
                currentDraft={currentDraft}
                currentAnswer={currentAnswer}
                answerMap={answerMap}
                completionStats={completionStats}
                onDraftChange={(value) =>
                  setDrafts((current) => ({
                    ...current,
                    [currentQuestion.id]: value,
                  }))
                }
                onJumpToQuestion={(index) => setCurrentQuestionIndex(index)}
                onPrevious={() => setCurrentQuestionIndex((index) => Math.max(0, index - 1))}
                onNext={handleNextQuestion}
                onSave={handleSaveCurrent}
                onSkip={handleSkipCurrent}
                onEndInterview={handleCompleteInterview}
                isSaving={isSaving}
                isCompleting={isCompleting}
              />

              <MockInterviewCoachPanel
                messages={session.coachMessages || []}
                coachInput={coachInput}
                onCoachInputChange={setCoachInput}
                onPromptClick={(prompt) => {
                  setCoachInput(prompt);
                  void handleCoachSend(prompt);
                }}
                onSend={() => handleCoachSend()}
                isSending={isSendingCoach}
              />

              {session.summary ? (
                <MockInterviewSummaryPanel
                  session={session}
                  bestAnswer={bestAnswer}
                  weakestAnswer={weakestAnswer}
                  onRestart={handleRestartInterview}
                  onGenerateAnother={handleGenerateAnother}
                  onCopy={handleCopyResults}
                  onExport={handleExportResults}
                  isRestarting={isRestarting}
                />
              ) : null}
            </>
          ) : (
            <EmptyWorkspaceCard />
          )}
        </div>
      </div>
    </main>
  );
}

export default MockInterview;

import { Copy, Download, RotateCcw, Sparkles } from "lucide-react";

function SummaryMetric({ label, value }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-bold text-slate-900">{value}</p>
    </div>
  );
}

function SummaryList({ title, items }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
      <div className="mt-3 space-y-3">
        {(items || []).map((item) => (
          <div key={item} className="flex gap-3 text-sm leading-6 text-slate-600">
            <span className="mt-2 h-2 w-2 flex-none rounded-full bg-blue-500" />
            <span>{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function MockInterviewSummaryPanel({
  session,
  bestAnswer,
  weakestAnswer,
  onRestart,
  onGenerateAnother,
  onCopy,
  onExport,
  isRestarting,
}) {
  const summary = session.summary;

  return (
    <section className="rounded-[32px] border border-slate-200 bg-white p-5 shadow-sm md:p-8">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">
            <Sparkles className="h-4 w-4" />
            Final Debrief
          </div>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">Your interview performance snapshot</h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">{summary.interviewerSummary}</p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={onRestart}
            disabled={isRestarting}
            className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RotateCcw className="h-4 w-4" />
            {isRestarting ? "Restarting..." : "Restart same setup"}
          </button>
          <button
            type="button"
            onClick={onGenerateAnother}
            className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-blue-700"
          >
            <Sparkles className="h-4 w-4" />
            Generate another
          </button>
          <button
            type="button"
            onClick={onCopy}
            className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            <Copy className="h-4 w-4" />
            Copy
          </button>
          <button
            type="button"
            onClick={onExport}
            className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            <Download className="h-4 w-4" />
            Export
          </button>
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryMetric label="Overall score" value={`${summary.overallScore}/100`} />
        <SummaryMetric label="Completion rate" value={`${summary.completionRate}%`} />
        <SummaryMetric label="Answered" value={summary.stats.answeredCount} />
        <SummaryMetric label="Skipped" value={summary.stats.skippedCount} />
      </div>

      <div className="mt-8 grid gap-5 xl:grid-cols-2">
        <SummaryList title="Top improvement areas" items={summary.topImprovementAreas} />
        <SummaryList title="Suggested next practice focus" items={summary.nextPracticeFocus} />
        <SummaryList title="What already feels strong" items={summary.overallStrengths} />
        <SummaryList title="What still sounds weak" items={summary.overallWeaknesses} />
      </div>

      <div className="mt-8 grid gap-5 xl:grid-cols-2">
        <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-5">
          <p className="text-sm font-semibold text-emerald-800">Best answer</p>
          <h3 className="mt-2 text-lg font-semibold text-slate-900">{bestAnswer?.questionPrompt || "Not available yet"}</h3>
          <p className="mt-3 text-sm leading-7 text-slate-700">
            {bestAnswer?.answer || "Complete and save more answers to surface your strongest response."}
          </p>
        </div>
        <div className="rounded-2xl border border-amber-100 bg-amber-50 p-5">
          <p className="text-sm font-semibold text-amber-800">Weakest answer</p>
          <h3 className="mt-2 text-lg font-semibold text-slate-900">{weakestAnswer?.questionPrompt || "Not available yet"}</h3>
          <p className="mt-3 text-sm leading-7 text-slate-700">
            {weakestAnswer?.answer || "Complete and save more answers to surface the response that needs the most work."}
          </p>
        </div>
      </div>
    </section>
  );
}

export default MockInterviewSummaryPanel;

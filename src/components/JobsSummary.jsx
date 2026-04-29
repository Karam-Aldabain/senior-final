import { BrainCircuit, BriefcaseBusiness, Sparkles, Target } from "lucide-react";
import { Link } from "react-router-dom";
import { writeStoredCoachJobId } from "../utils/storage";

function SummaryPill({ label, items, emptyCopy, tone = "default" }) {
  const toneClasses =
    tone === "warning"
      ? "bg-amber-50 text-amber-700"
      : tone === "success"
        ? "bg-emerald-50 text-emerald-700"
        : "bg-white text-slate-700";

  return (
    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">{label}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {items.length > 0 ? (
          items.map((item) => (
            <span key={item} className={`rounded-full px-3 py-1.5 text-sm font-semibold shadow-sm ${toneClasses}`}>
              {item}
            </span>
          ))
        ) : (
          <span className="text-sm text-slate-500">{emptyCopy}</span>
        )}
      </div>
    </div>
  );
}

function MetricCard({ icon, label, value, copy }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-blue-600 shadow-sm">
          {icon}
        </div>
        <p className="text-sm font-semibold text-slate-900">{label}</p>
      </div>
      <p className="mt-4 text-3xl font-bold text-slate-900">{value}</p>
      <p className="mt-2 text-sm leading-6 text-slate-500">{copy}</p>
    </div>
  );
}

function JobsSummary({ summary }) {
  const topJob = summary?.topJob;

  if (!summary) {
    return null;
  }

  return (
    <section className="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-sm">
      <div className="bg-[linear-gradient(135deg,_rgba(15,23,42,1)_0%,_rgba(30,41,59,1)_55%,_rgba(37,99,235,0.95)_100%)] px-6 py-8 text-white md:px-8">
        <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-semibold text-blue-100">
              <BrainCircuit className="h-4 w-4" />
              Match Summary
            </div>

            <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">
              {topJob ? `${topJob.title} at ${topJob.company} is your strongest match` : "Your profile summary"}
            </h2>

            <p className="mt-4 max-w-3xl text-base leading-8 text-slate-200">{summary.summarySentence}</p>

            <div className="mt-6 flex flex-wrap gap-3 text-sm font-semibold text-slate-200">
              <span className="rounded-full border border-white/10 bg-white/10 px-4 py-2">
                Best fit: {summary.bestFitSummary}
              </span>
              {topJob ? (
                <span className="rounded-full border border-white/10 bg-white/10 px-4 py-2">
                  Top score: {topJob.matchScore}%
                </span>
              ) : null}
            </div>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-white/10 p-5 backdrop-blur">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-100">Top Match Snapshot</p>
            {topJob ? (
              <>
                <h3 className="mt-3 text-2xl font-bold">{topJob.title}</h3>
                <p className="mt-1 text-slate-200">{topJob.company}</p>
                <div className="mt-4 flex flex-wrap gap-2 text-sm font-medium text-slate-200">
                  <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1.5">{topJob.location}</span>
                  <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1.5">{topJob.level}</span>
                  <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1.5">{topJob.category}</span>
                </div>
                <div className="mt-5 flex flex-wrap gap-3">
                  <Link
                    to={`/job/${topJob.id}`}
                    className="inline-flex items-center justify-center rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
                  >
                    View Details
                  </Link>
                  <Link
                    to={`/job/${topJob.id}/improve`}
                    onClick={() => writeStoredCoachJobId(topJob.id)}
                    className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/15"
                  >
                    Open Coach
                  </Link>
                </div>
              </>
            ) : (
              <p className="mt-3 text-slate-200">Analyze your CV to generate a top-match snapshot.</p>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-6 px-6 py-8 md:px-8 xl:grid-cols-[1fr_0.9fr]">
        <div>
          <div className="grid gap-4 sm:grid-cols-3">
            <MetricCard
              icon={<BriefcaseBusiness className="h-5 w-5" />}
              label="Recommended Jobs"
              value={summary.recommendedCount}
              copy="Closest roles ranked from your CV, not the raw dataset."
            />
            <MetricCard
              icon={<Sparkles className="h-5 w-5" />}
              label="Detected Skills"
              value={summary.detectedSkills.length}
              copy="Normalized skills extracted from your uploaded PDF."
            />
            <MetricCard
              icon={<Target className="h-5 w-5" />}
              label="Top Match"
              value={topJob ? `${topJob.matchScore}%` : "--"}
              copy="Your strongest current alignment across the job set."
            />
          </div>
        </div>

        <div className="grid gap-4">
          <SummaryPill
            label="Best-Fit Categories"
            items={summary.bestFitCategories}
            emptyCopy="Analyze your CV to reveal role direction."
            tone="success"
          />
          <SummaryPill
            label="Detected CV Skills"
            items={summary.detectedSkills.slice(0, 10)}
            emptyCopy="No strong skills detected yet."
          />
          <SummaryPill
            label="Top Missing Skills"
            items={summary.topMissingSkills}
            emptyCopy="No major skill gaps detected."
            tone="warning"
          />
        </div>
      </div>
    </section>
  );
}

export default JobsSummary;

import { ArrowLeft, BriefcaseBusiness, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

function CoachHeader({ job, plan }) {
  return (
    <section className="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-sm">
      <div className="bg-[linear-gradient(135deg,_rgba(15,23,42,1)_0%,_rgba(15,23,42,0.96)_35%,_rgba(30,41,59,1)_62%,_rgba(2,132,199,0.92)_100%)] px-6 py-8 text-white md:px-8 md:py-10">
        <div className="flex flex-wrap gap-3">
          <Link
            to={`/job/${job.id}`}
            className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/15"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Job Details
          </Link>
          <Link
            to="/jobs"
            className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/15"
          >
            Back to Job Assistant
          </Link>
        </div>

        <div className="mt-8 grid gap-8 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-semibold text-cyan-100">
              <Sparkles className="h-4 w-4" />
              AI Career Coach
            </div>

            <h1 className="mt-5 text-4xl font-bold tracking-tight md:text-5xl">{job.title}</h1>
            <p className="mt-3 text-lg text-slate-200">{job.company}</p>

            <div className="mt-5 flex flex-wrap gap-3 text-sm font-semibold text-slate-200">
              <span className="rounded-full border border-white/10 bg-white/10 px-4 py-2">{job.location}</span>
              <span className="rounded-full border border-white/10 bg-white/10 px-4 py-2">{job.level}</span>
              <span className="rounded-full border border-white/10 bg-white/10 px-4 py-2">{job.category}</span>
              <span className="rounded-full border border-white/10 bg-white/10 px-4 py-2">{job.type}</span>
            </div>

            <h2 className="mt-6 text-2xl font-bold tracking-tight md:text-3xl">{plan.headline}</h2>
            <p className="mt-4 max-w-3xl text-base leading-8 text-slate-200">{plan.subheadline}</p>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-white/10 p-6 backdrop-blur">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-100">Current Fit</p>
                <p className="mt-3 text-5xl font-bold">{plan.matchScore}%</p>
              </div>
              <div className="flex h-14 w-14 items-center justify-center rounded-3xl border border-white/10 bg-white/10 text-cyan-100">
                <BriefcaseBusiness className="h-6 w-6" />
              </div>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-slate-950/25 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-100">Matched Skills</p>
                <p className="mt-2 text-3xl font-bold">{plan.currentStanding.matchedCount}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-slate-950/25 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-100">Missing Skills</p>
                <p className="mt-2 text-3xl font-bold">{plan.currentStanding.missingCount}</p>
              </div>
            </div>

            <div className="mt-4 rounded-2xl border border-white/10 bg-slate-950/25 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-100">Coach Focus</p>
              <p className="mt-2 text-sm leading-6 text-slate-100">{plan.currentStanding.topFocus}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CoachHeader;

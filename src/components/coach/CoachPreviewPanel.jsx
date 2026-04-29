import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

function CoachPreviewPanel({ job, plan }) {
  return (
    <section className="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-sm">
      <div className="grid gap-0 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="border-b border-slate-200 bg-slate-950 px-6 py-8 text-white xl:border-b-0 xl:border-r">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-semibold text-cyan-100">
            <Sparkles className="h-4 w-4" />
            Coach Preview
          </div>
          <h2 className="mt-5 text-3xl font-bold tracking-tight">Improve your match with a role-specific coach plan</h2>
          <p className="mt-4 max-w-2xl text-base leading-8 text-slate-300">{plan.improvementEstimate}</p>

          <div className="mt-6 flex flex-wrap gap-3">
            <span className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-semibold text-slate-100">
              {plan.currentStanding.matchedCount} matched
            </span>
            <span className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-semibold text-slate-100">
              {plan.currentStanding.missingCount} gaps
            </span>
            <span className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-semibold text-slate-100">
              Focus: {plan.currentStanding.topFocus}
            </span>
          </div>
        </div>

        <div className="px-6 py-8">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-blue-600">What the coach includes</p>
          <div className="mt-5 space-y-3">
            <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-700">
              Personalized match breakdown with strengths, weak areas, and missing skills
            </div>
            <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-700">
              CV tailoring guidance, roadmap priorities, and sample rewritten bullets
            </div>
            <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-700">
              Role-specific project ideas and interview preparation tips
            </div>
          </div>

          <Link
            to={`/job/${job.id}/improve`}
            className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Open Full Coach
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

export default CoachPreviewPanel;

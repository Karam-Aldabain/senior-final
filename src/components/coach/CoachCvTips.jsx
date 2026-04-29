import { FileText, Sparkles } from "lucide-react";

function CoachCvTips({ plan, job }) {
  return (
    <section className="grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
      <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">CV Tailoring</p>
            <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
              How to improve your CV for this role
            </h2>
          </div>
        </div>

        <div className="mt-5 space-y-3">
          {plan.cvImprovements.map((item) => (
            <div key={item} className="rounded-2xl bg-slate-50 px-4 py-3">
              <p className="text-sm leading-6 text-slate-700">{item}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-slate-950 text-white shadow-sm">
        <div className="border-b border-white/10 bg-[radial-gradient(circle_at_top_right,_rgba(34,197,94,0.22),_transparent_36%),radial-gradient(circle_at_bottom_left,_rgba(59,130,246,0.24),_transparent_34%)] px-6 py-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-cyan-100">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-cyan-100">Improvement Estimate</p>
              <h2 className="mt-1 text-2xl font-bold tracking-tight">What would move the needle</h2>
            </div>
          </div>
        </div>

        <div className="space-y-5 px-6 py-6">
          <p className="text-base leading-8 text-slate-200">{plan.improvementEstimate}</p>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-sm font-semibold text-white">Tailoring reminder</p>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              Recruiters for {job.title} will notice stronger alignment when the first third of your CV already shows role keywords, relevant projects, and measurable outcomes.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-sm font-semibold text-white">Truth over keyword stuffing</p>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              Add missing keywords naturally through real experience bullets, projects, coursework, or focused practice. The goal is credible proof, not a longer skill list.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CoachCvTips;

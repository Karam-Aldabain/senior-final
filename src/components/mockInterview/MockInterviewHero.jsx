import { Bot, Sparkles, Target, TimerReset } from "lucide-react";

function HeroStat({ icon, label, value }) {
  const IconComponent = icon;

  return (
    <div className="rounded-[28px] border border-white/60 bg-white/80 p-4 shadow-sm backdrop-blur">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-100 text-blue-700">
          <IconComponent className="h-5 w-5" />
        </div>
        <div>
          <p className="text-lg font-bold text-slate-900">{value}</p>
          <p className="text-sm leading-6 text-slate-600">{label}</p>
        </div>
      </div>
    </div>
  );
}

function MockInterviewHero({ hasResume, onPrimaryAction, onSecondaryAction }) {
  return (
    <section className="relative overflow-hidden rounded-[36px] border border-blue-100/80 bg-[radial-gradient(circle_at_top,_rgba(191,219,254,0.95),_rgba(239,246,255,0.97)_36%,_rgba(255,255,255,1)_72%)] px-6 py-10 shadow-sm md:px-10 md:py-14">
      <div className="pointer-events-none absolute -left-10 top-10 h-40 w-40 rounded-full bg-sky-200/70 blur-3xl" />
      <div className="pointer-events-none absolute -right-10 top-12 h-44 w-44 rounded-full bg-blue-300/45 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-1/3 h-36 w-36 rounded-full bg-indigo-200/35 blur-3xl" />

      <div className="relative grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/90 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-blue-700">
            <Bot className="h-4 w-4" />
            Premium Interview Coach
          </div>

          <h1 className="mt-6 max-w-3xl text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
            Rehearse high-stakes interviews with sharper questions, deeper feedback, and live coaching.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600 md:text-lg">
            Shape a realistic hiring loop around your target role, answer one question at a time, and get
            feedback that focuses on what interviewers actually notice: structure, judgment, clarity, evidence, and role fit.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <button
              type="button"
              onClick={onPrimaryAction}
              className="inline-flex items-center justify-center rounded-2xl bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white shadow-md transition hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-lg"
            >
              {hasResume ? "Resume interview workspace" : "Start an interview session"}
            </button>
            <button
              type="button"
              onClick={onSecondaryAction}
              className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white/90 px-6 py-3.5 text-sm font-semibold text-slate-700 transition hover:bg-white hover:text-slate-900"
            >
              Refine setup
            </button>
          </div>

          <div className="mt-8 flex flex-wrap gap-2">
            {["One-question flow", "Role-specific prompts", "Answer-by-answer scoring", "Resume after refresh"].map((item) => (
              <span
                key={item}
                className="rounded-full border border-white/70 bg-white/75 px-3 py-1.5 text-xs font-medium text-slate-600 shadow-sm"
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="grid gap-4">
          <HeroStat icon={Target} value="Sharper prompts" label="Questions adapt to role, level, company context, and stack." />
          <HeroStat icon={Sparkles} value="Deeper feedback" label="Scores, missed points, stronger answer patterns, and coaching cues." />
          <HeroStat icon={TimerReset} value="Frictionless practice" label="Responsive layout, local resume support, and backend-driven sessions." />
        </div>
      </div>
    </section>
  );
}

export default MockInterviewHero;

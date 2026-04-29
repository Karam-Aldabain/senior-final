import { CheckCircle2, FilePenLine, GraduationCap, Lightbulb, Rocket } from "lucide-react";

function ActionSection({ title, icon, items, tone = "blue" }) {
  const toneClasses =
    tone === "emerald"
      ? "bg-emerald-50 text-emerald-700"
      : tone === "amber"
        ? "bg-amber-50 text-amber-700"
        : "bg-blue-50 text-blue-700";

  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-3">
        <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${toneClasses}`}>{icon}</div>
        <h3 className="text-xl font-bold tracking-tight text-slate-900">{title}</h3>
      </div>

      <div className="mt-5 space-y-3">
        {items.map((item) => (
          <div key={item} className="flex items-start gap-3 rounded-2xl bg-slate-50 px-4 py-3">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-slate-500" />
            <p className="text-sm leading-6 text-slate-700">{item}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function CoachActionPlan({ plan }) {
  return (
    <section className="space-y-5">
      <div className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-blue-600">Actionable Improvement Plan</p>
        <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">Concrete next steps for this exact job</h2>
        <p className="mt-3 text-base leading-7 text-slate-600">
          These recommendations are local and rule-based for now, but they are structured like a real coaching system so a future AI backend can replace the logic cleanly.
        </p>
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <ActionSection
          title="Quick Wins"
          icon={<Lightbulb className="h-5 w-5" />}
          items={plan.quickWins}
          tone="amber"
        />
        <ActionSection
          title="CV Improvements"
          icon={<FilePenLine className="h-5 w-5" />}
          items={plan.cvImprovements}
          tone="blue"
        />
        <ActionSection
          title="Skills to Learn Next"
          icon={<GraduationCap className="h-5 w-5" />}
          items={plan.skillsToLearnNext}
          tone="emerald"
        />
        <ActionSection
          title="Portfolio / Project Suggestions"
          icon={<Rocket className="h-5 w-5" />}
          items={plan.portfolioSuggestions}
          tone="blue"
        />
      </div>
    </section>
  );
}

export default CoachActionPlan;

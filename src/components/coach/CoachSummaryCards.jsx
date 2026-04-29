import { BrainCircuit, CheckCircle2, FileText, TriangleAlert } from "lucide-react";

function SummaryCard({ icon, label, value, copy, tone = "default" }) {
  const toneClasses =
    tone === "success"
      ? "bg-emerald-50 text-emerald-700"
      : tone === "warning"
        ? "bg-amber-50 text-amber-700"
        : "bg-blue-50 text-blue-700";

  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${toneClasses}`}>{icon}</div>
        <p className="text-sm font-semibold text-slate-900">{label}</p>
      </div>
      <p className="mt-4 text-3xl font-bold tracking-tight text-slate-900">{value}</p>
      <p className="mt-2 text-sm leading-6 text-slate-600">{copy}</p>
    </div>
  );
}

function CoachSummaryCards({ plan }) {
  return (
    <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
      <SummaryCard
        icon={<CheckCircle2 className="h-5 w-5" />}
        label="Matched Skills"
        value={plan.currentStanding.matchedCount}
        copy="Skills already visible in your current CV for this role."
        tone="success"
      />
      <SummaryCard
        icon={<TriangleAlert className="h-5 w-5" />}
        label="Priority Gaps"
        value={plan.currentStanding.missingCount}
        copy="Requirements you should prove, learn, or surface more clearly."
        tone="warning"
      />
      <SummaryCard
        icon={<BrainCircuit className="h-5 w-5" />}
        label="Coach Focus"
        value={plan.currentStanding.topFocus}
        copy="The most important next improvement area for this job."
      />
      <SummaryCard
        icon={<FileText className="h-5 w-5" />}
        label="Detected CV Skills"
        value={plan.currentStanding.extractedSkillsCount || "--"}
        copy={
          plan.hasPersonalizedData
            ? "Skills normalized from your analyzed CV."
            : "Analyze your CV to unlock a personalized skill inventory."
        }
      />
    </section>
  );
}

export default CoachSummaryCards;

import { CheckCircle2, FilePenLine, GraduationCap, Lightbulb, Target } from "lucide-react";

function ImprovementList({ title, icon, items, emptyCopy }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-100 text-blue-700">
          {icon}
        </div>
        <h3 className="text-lg font-bold text-slate-900">{title}</h3>
      </div>

      <div className="mt-4 space-y-3">
        {items.length > 0 ? (
          items.map((item) => (
            <div key={item} className="flex items-start gap-3 rounded-2xl bg-slate-50 px-4 py-3">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
              <p className="text-sm leading-6 text-slate-700">{item}</p>
            </div>
          ))
        ) : (
          <p className="text-sm text-slate-500">{emptyCopy}</p>
        )}
      </div>
    </div>
  );
}

function SkillGroup({ title, items, tone }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">{title}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {items.length > 0 ? (
          items.map((item) => (
            <span
              key={item}
              className={`rounded-full px-3 py-1.5 text-sm font-semibold ${
                tone === "missing" ? "bg-amber-50 text-amber-700" : "bg-emerald-50 text-emerald-700"
              }`}
            >
              {item}
            </span>
          ))
        ) : (
          <span className="text-sm text-slate-500">No items available.</span>
        )}
      </div>
    </div>
  );
}

function ImproveMatchPanel({ job, guide, compact = false }) {
  return (
    <div className="space-y-6">
      <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-blue-600">Improve My Match</p>
        <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">{guide.headline}</h2>
        <p className="mt-4 max-w-3xl text-slate-600 leading-7">{guide.explanation}</p>

        <div className="mt-6 grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-3xl bg-slate-50 p-5">
            <SkillGroup title="Currently Matched" items={guide.matchedSkills} />
          </div>
          <div className="rounded-3xl bg-slate-50 p-5">
            <SkillGroup title="Priority Gaps" items={guide.missingSkills} tone="missing" />
          </div>
        </div>

        <div className="mt-6 rounded-3xl bg-slate-900 p-5 text-white">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 text-blue-200">
              <Target className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-blue-100">What to emphasize next</p>
              <p className="mt-1 text-sm leading-6 text-slate-300">
                Focus on the missing skills that appear in this role, then rewrite your strongest project bullets so they clearly prove those capabilities.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className={`grid gap-6 ${compact ? "xl:grid-cols-2" : "xl:grid-cols-3"}`}>
        <ImprovementList
          title="Personalized Suggestions"
          icon={<Lightbulb className="h-5 w-5" />}
          items={guide.personalizedSuggestions}
          emptyCopy="Analyze your CV to generate role-specific suggestions."
        />
        <ImprovementList
          title="What To Add To Your CV"
          icon={<FilePenLine className="h-5 w-5" />}
          items={guide.cvAdditions}
          emptyCopy="No CV additions are available yet."
        />
        <ImprovementList
          title="Skills To Learn Next"
          icon={<GraduationCap className="h-5 w-5" />}
          items={guide.nextSkillsToLearn}
          emptyCopy="No extra skill suggestions are available yet."
        />
      </div>

      {!compact ? (
        <div className="rounded-[32px] border border-slate-200 bg-slate-900 p-6 text-white shadow-sm md:p-8">
          <h3 className="text-2xl font-bold tracking-tight">How to strengthen this application fast</h3>
          <p className="mt-4 max-w-3xl text-slate-300 leading-7">
            Rewrite your strongest project bullets so they mirror the role requirements truthfully: start with the feature you built, mention the stack, then close with a measurable outcome or ownership detail.
          </p>
          <p className="mt-3 max-w-3xl text-slate-300 leading-7">
            For {job.title}, emphasize the most relevant tools early in your CV summary and project sections instead of leaving them buried lower in the document.
          </p>
        </div>
      ) : null}
    </div>
  );
}

export default ImproveMatchPanel;

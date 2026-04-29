function BadgeList({ items, tone, emptyCopy }) {
  const classes =
    tone === "missing"
      ? "bg-amber-50 text-amber-700"
      : tone === "matched"
        ? "bg-emerald-50 text-emerald-700"
        : "bg-slate-100 text-slate-700";

  if (items.length === 0) {
    return <p className="text-sm leading-6 text-slate-500">{emptyCopy}</p>;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <span key={item} className={`rounded-full px-3 py-1.5 text-sm font-semibold ${classes}`}>
          {item}
        </span>
      ))}
    </div>
  );
}

function CopyList({ items, emptyCopy }) {
  if (items.length === 0) {
    return <p className="text-sm leading-6 text-slate-500">{emptyCopy}</p>;
  }

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div key={item} className="rounded-2xl bg-slate-50 px-4 py-3">
          <p className="text-sm leading-6 text-slate-700">{item}</p>
        </div>
      ))}
    </div>
  );
}

function BreakdownCard({ eyebrow, title, children }) {
  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">{eyebrow}</p>
      <h3 className="mt-3 text-xl font-bold tracking-tight text-slate-900">{title}</h3>
      <div className="mt-5">{children}</div>
    </div>
  );
}

function CoachSkillsBreakdown({ plan }) {
  return (
    <section className="space-y-5">
      <div className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-blue-600">Current Match Breakdown</p>
        <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">What already helps and what still needs work</h2>
        <p className="mt-3 text-base leading-7 text-slate-600">{plan.explanation}</p>
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <BreakdownCard eyebrow="Aligned Skills" title="Skills you already match">
          <BadgeList items={plan.matchedSkills} tone="matched" emptyCopy="No strong overlaps detected yet." />
        </BreakdownCard>
        <BreakdownCard eyebrow="Gaps" title="Skills you are still missing">
          <BadgeList items={plan.missingSkills} tone="missing" emptyCopy="No major gaps detected for this role." />
        </BreakdownCard>
        <BreakdownCard eyebrow="CV Strengths" title="Relevant strengths from your CV">
          <CopyList
            items={plan.strengths}
            emptyCopy="Analyze your CV to reveal the strongest signals this role can already use."
          />
        </BreakdownCard>
        <BreakdownCard eyebrow="Weak Areas" title="Role-specific weak areas">
          <CopyList items={plan.weakAreas} emptyCopy="No critical weak areas detected right now." />
        </BreakdownCard>
      </div>
    </section>
  );
}

export default CoachSkillsBreakdown;

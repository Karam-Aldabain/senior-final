function RoadmapColumn({ title, items, tone }) {
  const toneClasses =
    tone === "now"
      ? "border-blue-200 bg-blue-50"
      : tone === "next"
        ? "border-emerald-200 bg-emerald-50"
        : "border-slate-200 bg-slate-50";

  return (
    <div className={`rounded-[28px] border p-6 shadow-sm ${toneClasses}`}>
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">{title}</p>
      <div className="mt-5 space-y-3">
        {items.map((item) => (
          <div key={item} className="rounded-2xl bg-white/80 px-4 py-3">
            <p className="text-sm font-semibold text-slate-800">{item}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function CoachRoadmap({ roadmap }) {
  return (
    <section className="space-y-5">
      <div className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-blue-600">Skills Roadmap</p>
        <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">What to prioritize first</h2>
        <p className="mt-3 text-base leading-7 text-slate-600">
          This ordering is meant to keep your effort focused on the skills most likely to improve your fit for this role.
        </p>
      </div>

      <div className="grid gap-5 xl:grid-cols-3">
        <RoadmapColumn title="Learn Now" items={roadmap.learnNow} tone="now" />
        <RoadmapColumn title="Learn Next" items={roadmap.learnNext} tone="next" />
        <RoadmapColumn title="Nice to Have" items={roadmap.niceToHave} tone="later" />
      </div>
    </section>
  );
}

export default CoachRoadmap;

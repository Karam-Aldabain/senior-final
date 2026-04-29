function LoadingCard() {
  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="animate-pulse">
        <div className="flex items-center justify-between">
          <div className="h-12 w-12 rounded-2xl bg-slate-200" />
          <div className="h-8 w-24 rounded-full bg-slate-200" />
        </div>
        <div className="mt-6 h-6 w-2/3 rounded-full bg-slate-200" />
        <div className="mt-3 h-4 w-1/3 rounded-full bg-slate-200" />
        <div className="mt-6 space-y-3">
          <div className="h-4 w-full rounded-full bg-slate-200" />
          <div className="h-4 w-5/6 rounded-full bg-slate-200" />
          <div className="h-4 w-4/6 rounded-full bg-slate-200" />
        </div>
        <div className="mt-6 flex gap-2">
          <div className="h-8 w-20 rounded-full bg-slate-200" />
          <div className="h-8 w-24 rounded-full bg-slate-200" />
        </div>
      </div>
    </div>
  );
}

function LoadingJobsSection() {
  return (
    <section id="jobs-section" className="bg-slate-50 py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-blue-600">
            Analyzing
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
            Processing your CV and ranking the closest jobs
          </h2>
          <p className="mt-3 max-w-2xl text-slate-600 leading-7">
            Extracting skills, comparing role requirements, and generating improvement suggestions.
          </p>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <LoadingCard key={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default LoadingJobsSection;

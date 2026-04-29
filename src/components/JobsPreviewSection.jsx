import JobCard from "./JobCard";
import JobsSummary from "./JobsSummary";
import JobsToolbar from "./JobsToolbar";

function JobsPreviewSection({
  summary,
  filters,
  onFilterChange,
  onClearFilters,
  filterOptions,
  jobs,
  visibleJobs,
  savedJobs,
  onToggleSave,
  onShowMore,
  canShowMore,
  hasPoorMatches,
}) {
  const savedSet = new Set(savedJobs);

  return (
    <section id="jobs-section" className="bg-slate-50 py-20">
      <div className="mx-auto max-w-7xl space-y-8 px-6">
        <JobsSummary summary={summary} />

        <JobsToolbar
          filters={filters}
          onFilterChange={onFilterChange}
          onClearFilters={onClearFilters}
          filterOptions={filterOptions}
          savedCount={savedJobs.length}
          resultsCount={jobs.length}
        />

        {hasPoorMatches ? (
          <div className="rounded-[28px] border border-amber-200 bg-amber-50 p-5 text-amber-900 shadow-sm">
            <p className="font-semibold">These are still the closest local matches for your current CV.</p>
            <p className="mt-2 text-sm leading-6">
              The overlap is limited right now, so the assistant is intentionally showing the nearest roles while highlighting the missing skills that would raise your match fastest.
            </p>
          </div>
        ) : null}

        {jobs.length === 0 ? (
          <div className="rounded-[28px] border border-slate-200 bg-white p-8 text-center shadow-sm">
            <h3 className="text-2xl font-bold tracking-tight text-slate-900">No jobs match the current filters</h3>
            <p className="mx-auto mt-3 max-w-2xl text-slate-600 leading-7">
              Try lowering the minimum match, turning off saved-only mode, or broadening location, level, and category filters.
            </p>
          </div>
        ) : (
          <>
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {visibleJobs.map((job) => (
                <JobCard key={job.id} job={job} isSaved={savedSet.has(job.id)} onToggleSave={onToggleSave} />
              ))}
            </div>

            {canShowMore ? (
              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={onShowMore}
                  className="rounded-2xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Show More Jobs
                </button>
              </div>
            ) : null}
          </>
        )}
      </div>
    </section>
  );
}

export default JobsPreviewSection;

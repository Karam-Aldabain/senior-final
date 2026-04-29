import { Link } from "react-router-dom";

function CoachEmptyState({ job }) {
  return (
    <section className="rounded-[32px] border border-amber-200 bg-amber-50 p-6 shadow-sm md:p-8">
      <div className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-amber-700">Personalization Locked</p>
        <h2 className="mt-3 text-3xl font-bold tracking-tight text-amber-950">
          Analyze your CV first for a true role-specific coaching plan
        </h2>
        <p className="mt-4 text-base leading-7 text-amber-900">
          You opened the coach for {job.title} without saved CV analysis. The page is still showing a general improvement plan for this job, but matched skills, weak areas, and score guidance will become much more useful after you analyze your CV in the Job Assistant flow.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            to="/jobs"
            className="inline-flex items-center justify-center rounded-2xl bg-amber-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-amber-950"
          >
            Go to Job Assistant
          </Link>
          <Link
            to={`/job/${job.id}`}
            className="inline-flex items-center justify-center rounded-2xl border border-amber-300 bg-white px-5 py-3 text-sm font-semibold text-amber-900 transition hover:bg-amber-100/60"
          >
            Back to Job Details
          </Link>
        </div>
      </div>
    </section>
  );
}

export default CoachEmptyState;

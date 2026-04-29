import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Heart, LoaderCircle, Sparkles } from "lucide-react";
import { Link, useLocation, useParams } from "react-router-dom";
import CoachPreviewPanel from "../components/coach/CoachPreviewPanel";
import { fetchJobById } from "../services/jobsApi";
import { generateCoachPlan } from "../utils/generateCoachPlan";
import { readSavedJobs, readStoredAnalysis, writeSavedJobs, writeStoredCoachJobId } from "../utils/storage";

function JobDetails() {
  const { id } = useParams();
  const location = useLocation();
  const storedAnalysis = readStoredAnalysis();
  const [job, setJob] = useState(null);
  const [savedJobs, setSavedJobs] = useState(readSavedJobs);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadJob() {
      setIsLoading(true);

      try {
        const response = await fetchJobById(id);
        setJob(response);
      } catch (loadError) {
        setError(loadError.message);
      } finally {
        setIsLoading(false);
      }
    }

    void loadJob();
  }, [id]);

  const coachPlan = useMemo(() => (job ? generateCoachPlan(job, storedAnalysis) : null), [job, storedAnalysis]);
  const isSaved = job ? savedJobs.includes(job.id) : false;

  const handleToggleSave = () => {
    if (!job) {
      return;
    }

    const nextSavedJobs = isSaved
      ? savedJobs.filter((savedId) => savedId !== job.id)
      : [...savedJobs, job.id];

    setSavedJobs(nextSavedJobs);
    writeSavedJobs(nextSavedJobs);
  };

  if (isLoading) {
    return (
      <main className="flex min-h-[50vh] items-center justify-center bg-slate-50">
        <LoaderCircle className="h-8 w-8 animate-spin text-blue-600" />
      </main>
    );
  }

  if (!job || error) {
    return (
      <main className="px-6 py-16">
        <div className="mx-auto max-w-4xl rounded-[32px] border border-slate-200 bg-white p-10 text-center shadow-sm">
          <h1 className="text-2xl font-bold text-slate-900">Job not found</h1>
          <p className="mt-3 text-slate-600">{error || "The requested job could not be found."}</p>
          <Link
            to="/jobs"
            className="mt-6 inline-flex items-center justify-center rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Back to jobs
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-slate-50 px-6 py-16">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="flex flex-wrap gap-3">
          <Link
            to="/jobs"
            className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Jobs
          </Link>
          <Link
            to={`/job/${job.id}/improve`}
            state={location.state}
            onClick={() => writeStoredCoachJobId(job.id)}
            className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            <Sparkles className="h-4 w-4" />
            Improve My Match
          </Link>
          <button
            type="button"
            onClick={handleToggleSave}
            className={`inline-flex items-center gap-2 rounded-2xl border px-4 py-3 text-sm font-semibold transition ${
              isSaved
                ? "border-rose-200 bg-rose-50 text-rose-700"
                : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
            }`}
          >
            <Heart className={`h-4 w-4 ${isSaved ? "fill-current" : ""}`} />
            {isSaved ? "Saved" : "Save Job"}
          </button>
        </div>

        <section className="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-sm">
          <div className="bg-[linear-gradient(135deg,_rgba(15,23,42,1)_0%,_rgba(30,41,59,1)_55%,_rgba(37,99,235,0.95)_100%)] p-8 text-white md:p-10">
            <div className="flex flex-wrap items-start justify-between gap-6">
              <div className="max-w-3xl">
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-blue-200">Job Details</p>
                <h1 className="mt-3 text-4xl font-bold tracking-tight">{job.title}</h1>
                <p className="mt-3 text-lg text-slate-200">{job.company}</p>
                <div className="mt-6 flex flex-wrap gap-3 text-sm font-medium text-slate-200">
                  <span className="rounded-full border border-white/10 bg-white/10 px-4 py-2">{job.location}</span>
                  <span className="rounded-full border border-white/10 bg-white/10 px-4 py-2">{job.level}</span>
                  <span className="rounded-full border border-white/10 bg-white/10 px-4 py-2">{job.type}</span>
                  <span className="rounded-full border border-white/10 bg-white/10 px-4 py-2">{job.category}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {coachPlan ? (
                  <span
                    className={`rounded-full px-4 py-2 text-sm font-semibold ${
                      coachPlan.matchScore >= 80
                        ? "bg-emerald-50 text-emerald-700"
                        : coachPlan.matchScore >= 60
                          ? "bg-blue-50 text-blue-700"
                          : coachPlan.matchScore >= 40
                            ? "bg-amber-50 text-amber-700"
                            : "bg-rose-50 text-rose-700"
                    }`}
                  >
                    {coachPlan.matchScore}% match
                  </span>
                ) : null}
                {job.salary ? <span className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white">{job.salary}</span> : null}
              </div>
            </div>
          </div>

          <div className="p-8 md:p-10">
            <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
              <div className="rounded-3xl bg-slate-50 p-6">
                <h2 className="text-lg font-semibold text-slate-900">Role Overview</h2>
                <p className="mt-4 leading-8 text-slate-700">{job.overview || job.description}</p>
              </div>

              <div className="rounded-3xl bg-slate-900 p-6 text-white">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-200">Why this role</p>
                <p className="mt-4 leading-7 text-slate-200">{coachPlan?.explanation || job.description}</p>
              </div>
            </div>

            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {[
                { title: "Required Skills", items: job.requirements, tone: "bg-white text-slate-700", empty: "No skills listed." },
                { title: "Matched Skills", items: coachPlan?.matchedSkills || [], tone: "bg-emerald-50 text-emerald-700", empty: "Analyze your CV to unlock overlap." },
                { title: "Missing Skills", items: coachPlan?.missingSkills || [], tone: "bg-amber-50 text-amber-700", empty: "No major gaps detected." },
              ].map((section) => (
                <div key={section.title} className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                  <h2 className="text-lg font-semibold text-slate-900">{section.title}</h2>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {section.items.length > 0 ? (
                      section.items.map((skill) => (
                        <span key={skill} className={`rounded-full px-3 py-1.5 text-sm font-semibold ${section.tone}`}>
                          {skill}
                        </span>
                      ))
                    ) : (
                      <p className="text-sm text-slate-500">{section.empty}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {coachPlan ? <CoachPreviewPanel job={job} plan={coachPlan} /> : null}
      </div>
    </main>
  );
}

export default JobDetails;


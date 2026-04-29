import { ArrowUpRight, Heart, MapPin, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { writeStoredCoachJobId } from "../utils/storage";

const MATCH_TONE_CLASSES = {
  emerald: "border-emerald-200 bg-emerald-50 text-emerald-700",
  blue: "border-blue-200 bg-blue-50 text-blue-700",
  amber: "border-amber-200 bg-amber-50 text-amber-700",
  rose: "border-rose-200 bg-rose-50 text-rose-700",
};

function SkillPills({ items, tone, emptyCopy }) {
  const classes = tone === "missing" ? "bg-amber-50 text-amber-700" : "bg-blue-50 text-blue-700";

  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {items.length > 0 ? (
        items.slice(0, 5).map((item) => (
          <span key={item} className={`rounded-full px-3 py-1 text-xs font-semibold ${classes}`}>
            {item}
          </span>
        ))
      ) : (
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-500">
          {emptyCopy}
        </span>
      )}
    </div>
  );
}

function JobCard({ job, isSaved, onToggleSave }) {
  const hasMatch = typeof job.matchScore === "number";
  const level = job.level || job.experienceLevel;

  return (
    <article className="group rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-xl">
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-slate-900 text-sm font-bold tracking-wide text-white shadow-sm">
            {job.companyInitial}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">{job.category}</p>
            <h3 className="mt-1 text-xl font-bold tracking-tight text-slate-900">{job.title}</h3>
            <p className="mt-1 truncate text-sm font-medium text-slate-500">{job.company}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onToggleSave(job.id)}
          className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border transition ${
            isSaved
              ? "border-rose-200 bg-rose-50 text-rose-700"
              : "border-slate-200 bg-white text-slate-400 hover:border-rose-200 hover:text-rose-600"
          }`}
          aria-label={isSaved ? "Remove job from saved list" : "Save job"}
        >
          <Heart className={`h-5 w-5 ${isSaved ? "fill-current" : ""}`} />
        </button>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700">
          <MapPin className="h-3.5 w-3.5" />
          {job.location}
        </span>
        <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700">{level}</span>
        <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700">{job.type}</span>
        {job.salary ? <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700">{job.salary}</span> : null}
        {hasMatch ? (
          <span className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${MATCH_TONE_CLASSES[job.matchTone]}`}>
            {job.matchScore}% {job.matchLabel}
          </span>
        ) : null}
      </div>

      <p className="mt-5 text-sm leading-7 text-slate-600">{job.descriptionPreview || job.description}</p>

      {job.explanation ? (
        <div className="mt-5 rounded-2xl bg-slate-50 p-4">
          <div className="flex items-start gap-3">
            <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />
            <p className="text-sm leading-6 text-slate-700">{job.explanation}</p>
          </div>
        </div>
      ) : null}

      {hasMatch ? (
        <>
          <div className="mt-5">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Matched Skills</p>
            <SkillPills items={job.matchedSkills || []} tone="matched" emptyCopy="No clear overlaps yet" />
          </div>

          <div className="mt-5">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Missing Skills</p>
            <SkillPills items={job.missingSkills || []} tone="missing" emptyCopy="No major gaps detected" />
          </div>
        </>
      ) : (
        <div className="mt-5">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Key Skills</p>
          <SkillPills items={job.requirements || []} tone="matched" emptyCopy="No skills listed" />
        </div>
      )}

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Link
          to={`/job/${job.id}`}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          View Details
          <ArrowUpRight className="h-4 w-4" />
        </Link>
        <Link
          to={`/job/${job.id}/improve`}
          onClick={() => writeStoredCoachJobId(job.id)}
          className="inline-flex flex-1 items-center justify-center rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-700 transition hover:border-blue-300 hover:bg-blue-100"
        >
          Improve My Match
        </Link>
      </div>
    </article>
  );
}

export default JobCard;

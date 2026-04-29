import { BriefcaseBusiness, FileSearch, Sparkles } from "lucide-react";

function EmptyJobsSection() {
  return (
    <section id="jobs-section" className="bg-slate-50 py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm md:p-12">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 text-blue-700">
            <BriefcaseBusiness className="h-8 w-8" />
          </div>

          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-slate-900">
            Your ranked jobs will appear here
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-center text-slate-600 leading-7">
            Analyze your CV to unlock a polished recommendation feed with match scores, missing skills, saved jobs, and personalized improvement guidance.
          </p>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <Sparkles className="h-6 w-6 text-blue-600" />
              <p className="mt-4 font-semibold text-slate-900">Smart matching</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Local scoring ranks the closest roles based on your skills and role alignment.
              </p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <FileSearch className="h-6 w-6 text-blue-600" />
              <p className="mt-4 font-semibold text-slate-900">Actionable feedback</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                See exactly which skills are matched, missing, and worth adding to your CV.
              </p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <BriefcaseBusiness className="h-6 w-6 text-blue-600" />
              <p className="mt-4 font-semibold text-slate-900">Saved roles</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Favorite promising jobs and keep your progress after refresh.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default EmptyJobsSection;

import { MessageSquareMore } from "lucide-react";

function CoachInterviewTips({ tips }) {
  return (
    <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
      <div className="max-w-3xl">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
            <MessageSquareMore className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">Interview Preparation</p>
            <h2 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">Job-specific interview tips</h2>
          </div>
        </div>
        <p className="mt-4 text-base leading-7 text-slate-600">
          Use these prompts to prepare concise, technical answers that match the kind of discussion this role is likely to trigger.
        </p>
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-2">
        {tips.map((tip) => (
          <div key={tip} className="rounded-2xl bg-slate-50 px-4 py-4">
            <p className="text-sm leading-6 text-slate-700">{tip}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default CoachInterviewTips;

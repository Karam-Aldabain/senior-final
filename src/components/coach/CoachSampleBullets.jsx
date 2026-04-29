import { Quote } from "lucide-react";

function CoachSampleBullets({ bullets }) {
  return (
    <section className="space-y-5">
      <div className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-blue-600">Sample CV Bullets</p>
        <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">Example rewrites you can adapt</h2>
        <p className="mt-3 text-base leading-7 text-slate-600">
          These are role-shaped examples meant to show stronger wording, not lines you should copy verbatim without adjusting them to your real experience.
        </p>
      </div>

      <div className="grid gap-5 xl:grid-cols-3">
        {bullets.map((bullet) => (
          <div key={bullet} className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
              <Quote className="h-5 w-5" />
            </div>
            <p className="mt-5 text-base leading-7 text-slate-700">{bullet}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default CoachSampleBullets;

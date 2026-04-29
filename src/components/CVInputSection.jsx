import { CheckCircle2, Eraser, FileText, FileUp, LoaderCircle, Sparkles } from "lucide-react";

function StatCard({ label, value, muted }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-slate-50/80 p-4">
      <p className="text-sm text-slate-500">{label}</p>
      <p className={`mt-1 text-xl font-bold ${muted ? "text-slate-500" : "text-slate-900"}`}>{value}</p>
    </div>
  );
}

function CVInputSection({
  selectedFile,
  onSelectFile,
  onAnalyze,
  onClear,
  analysis,
  isLoading,
  error,
  successMessage,
  stats,
}) {
  return (
    <section id="cv-section" className="relative overflow-hidden bg-slate-950 py-20 text-white">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.35),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(34,197,94,0.18),_transparent_28%)]" />

      <div className="mx-auto grid max-w-7xl gap-8 px-6 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/8 px-4 py-2 text-sm font-semibold text-blue-100 backdrop-blur">
            <Sparkles className="h-4 w-4" />
            Job Assistant Workspace
          </div>

          <h2 className="mt-6 text-4xl font-bold tracking-tight md:text-5xl">
            Turn your PDF CV into ranked, actionable job matches
          </h2>

          <p className="mt-5 text-lg leading-8 text-slate-300">
            Upload a PDF, parse it on the backend, extract richer skills, and compare it against real jobs from MongoDB.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/6 p-4">
              <p className="text-sm font-semibold text-white">Parse PDF</p>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                Extract text and metadata from the uploaded resume on the backend.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/6 p-4">
              <p className="text-sm font-semibold text-white">Detect skills</p>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                Normalize technologies, tools, and strengths using a larger skill dictionary.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/6 p-4">
              <p className="text-sm font-semibold text-white">Rank jobs</p>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                Compare your CV against database-backed roles and highlight missing skills clearly.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-[28px] border border-white/10 bg-white p-6 text-slate-900 shadow-2xl shadow-black/20 md:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-blue-600">PDF CV Analysis</p>
              <h3 className="mt-2 text-2xl font-bold tracking-tight">Analyze your CV</h3>
              <p className="mt-2 max-w-xl text-sm leading-6 text-slate-600">
                The frontend uploads the PDF, the backend parses it with `pdf-parse`, extracts skills, and returns ranked job matches.
              </p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-700">
              <FileText className="h-6 w-6" />
            </div>
          </div>

          <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-slate-900">Upload PDF CV</p>
                <p className="mt-1 text-sm text-slate-500">
                  PDF only. Files are stored temporarily for parsing and then removed after analysis.
                </p>
              </div>
              <div className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-500 shadow-sm">
                8MB max
              </div>
            </div>

            <div className="mt-4 rounded-3xl border-2 border-dashed border-slate-200 bg-white p-6">
              <label className="flex cursor-pointer flex-col items-center justify-center gap-4 rounded-3xl bg-slate-50 px-6 py-10 text-center transition hover:bg-slate-100">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-blue-700">
                  <FileUp className="h-7 w-7" />
                </div>
                <div>
                  <p className="text-base font-semibold text-slate-900">
                    {selectedFile ? selectedFile.name : "Choose a PDF CV to upload"}
                  </p>
                  <p className="mt-2 text-sm text-slate-500">
                    Include real projects, tools, responsibilities, and measurable outcomes for the best extraction quality.
                  </p>
                </div>
                <span className="rounded-2xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white">
                  Select PDF
                </span>
                <input
                  type="file"
                  accept="application/pdf,.pdf"
                  onChange={(event) => onSelectFile(event.target.files?.[0] || null)}
                  className="hidden"
                />
              </label>
            </div>

            <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-500">
              <p>The uploaded file is now the source of CV analysis instead of local pasted text.</p>
              {selectedFile ? (
                <span className="rounded-full bg-blue-50 px-3 py-1 font-semibold text-blue-700">
                  {selectedFile.name}
                </span>
              ) : null}
            </div>
          </div>

          {error ? (
            <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
              {error}
            </div>
          ) : null}

          {successMessage ? (
            <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-600" />
                <div>
                  <p className="font-semibold text-emerald-800">{successMessage}</p>
                  <p className="mt-1 text-sm text-emerald-700">
                    Extracted skills, metadata, and matched jobs are ready below.
                  </p>
                </div>
              </div>
            </div>
          ) : null}

          {!selectedFile && !error ? (
            <div className="mt-4 rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-5 text-sm leading-6 text-slate-600">
              This flow now starts from a PDF upload. After analysis, the jobs feed can be sorted by strongest match.
            </div>
          ) : null}

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={onAnalyze}
              disabled={!selectedFile || isLoading}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              {isLoading ? <LoaderCircle className="h-5 w-5 animate-spin" /> : <Sparkles className="h-5 w-5" />}
              {isLoading ? "Uploading and analyzing..." : analysis ? "Re-analyze CV" : "Analyze PDF CV"}
            </button>

            <button
              type="button"
              onClick={onClear}
              disabled={!selectedFile && !analysis}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-300 bg-white px-5 py-3.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Eraser className="h-5 w-5" />
              Clear Analysis
            </button>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <StatCard label="Detected Skills" value={stats.detectedSkills} muted={!analysis} />
            <StatCard label="Matched Jobs" value={stats.recommendedJobs} muted={!analysis} />
            <StatCard label="Saved Jobs" value={stats.savedJobs} muted={false} />
          </div>

          {analysis?.metadata ? (
            <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <div className="flex flex-wrap gap-3 text-sm font-semibold text-slate-700">
                <span className="rounded-full bg-white px-3 py-1.5">{analysis.fileName || "PDF uploaded"}</span>
                <span className="rounded-full bg-white px-3 py-1.5">{analysis.metadata.pageCount || 0} pages</span>
                <span className="rounded-full bg-white px-3 py-1.5">{analysis.metadata.wordCount || 0} words</span>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {analysis.extractedSkills.slice(0, 12).map((skill) => (
                  <span key={skill} className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

export default CVInputSection;


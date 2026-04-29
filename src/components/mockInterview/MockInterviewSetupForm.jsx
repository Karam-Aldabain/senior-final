import {
  DIFFICULTY_OPTIONS,
  EXPERIENCE_LEVEL_OPTIONS,
  INTERVIEW_SETUP_SUGGESTIONS,
  INTERVIEW_TYPE_OPTIONS,
  QUESTION_COUNT_OPTIONS,
} from "../../utils/mockInterview";

function FieldShell({ label, hint, error, children }) {
  return (
    <label className="block">
      <div className="mb-2 flex items-center justify-between gap-3">
        <span className="text-sm font-semibold text-slate-800">{label}</span>
        {hint ? <span className="text-xs text-slate-500">{hint}</span> : null}
      </div>
      {children}
      {error ? <p className="mt-2 text-sm text-rose-600">{error}</p> : null}
    </label>
  );
}

function fieldClassName() {
  return "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-blue-300 focus:ring-4 focus:ring-blue-100";
}

function SelectField({ label, value, onChange, options }) {
  return (
    <FieldShell label={label}>
      <select value={value} onChange={onChange} className={fieldClassName()}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </FieldShell>
  );
}

function MockInterviewSetupForm({
  formState,
  skillInput,
  errors,
  isSubmitting,
  onFieldChange,
  onSkillInputChange,
  onApplySuggestion,
  onSubmit,
}) {
  return (
    <section className="rounded-[32px] border border-slate-200 bg-white p-5 shadow-sm md:p-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-700">Interview Blueprint</p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 md:text-[2rem]">
            Configure a practice loop that actually feels worth rehearsing
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
            The setup drives question tone, difficulty, and coaching quality. Add real context when you have it,
            or start from a focused preset and refine from there.
          </p>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {INTERVIEW_SETUP_SUGGESTIONS.map((preset) => (
          <button
            key={preset.label}
            type="button"
            onClick={() => onApplySuggestion(preset.values)}
            className="rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
          >
            {preset.label}
          </button>
        ))}
      </div>

      <form className="mt-8 space-y-6" onSubmit={onSubmit}>
        <div className="grid gap-5 lg:grid-cols-2">
          <FieldShell label="Target role" error={errors.role}>
            <input
              value={formState.role}
              onChange={(event) => onFieldChange("role", event.target.value)}
              placeholder="Frontend Developer"
              className={fieldClassName()}
            />
          </FieldShell>

          <FieldShell label="Company context" hint="Optional">
            <input
              value={formState.companyName}
              onChange={(event) => onFieldChange("companyName", event.target.value)}
              placeholder="Figma"
              className={fieldClassName()}
            />
          </FieldShell>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <SelectField
            label="Experience level"
            value={formState.experienceLevel}
            onChange={(event) => onFieldChange("experienceLevel", event.target.value)}
            options={EXPERIENCE_LEVEL_OPTIONS}
          />
          <SelectField
            label="Interview format"
            value={formState.interviewType}
            onChange={(event) => onFieldChange("interviewType", event.target.value)}
            options={INTERVIEW_TYPE_OPTIONS}
          />
          <SelectField
            label="Difficulty"
            value={formState.difficulty}
            onChange={(event) => onFieldChange("difficulty", event.target.value)}
            options={DIFFICULTY_OPTIONS}
          />
          <FieldShell label="Questions" error={errors.questionCount}>
            <select
              value={formState.questionCount}
              onChange={(event) => onFieldChange("questionCount", Number(event.target.value))}
              className={fieldClassName()}
            >
              {QUESTION_COUNT_OPTIONS.map((value) => (
                <option key={value} value={value}>
                  {value} questions
                </option>
              ))}
            </select>
          </FieldShell>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          <FieldShell label="Skills / stack" hint="Optional, comma separated">
            <input
              value={skillInput}
              onChange={(event) => onSkillInputChange(event.target.value)}
              placeholder="React, TypeScript, Tailwind, Node.js"
              className={fieldClassName()}
            />
          </FieldShell>

          <FieldShell label="Job description" hint="Optional, but high impact">
            <textarea
              value={formState.jobDescription}
              onChange={(event) => onFieldChange("jobDescription", event.target.value)}
              rows={6}
              placeholder="Paste the job description to increase question realism and role alignment."
              className={`${fieldClassName()} min-h-[148px] resize-y`}
            />
          </FieldShell>
        </div>

        <FieldShell label="CV or experience summary" hint="Optional">
          <textarea
            value={formState.cvText}
            onChange={(event) => onFieldChange("cvText", event.target.value)}
            rows={6}
            placeholder="Paste your resume, project highlights, or an experience summary to make feedback more tailored."
            className={`${fieldClassName()} min-h-[160px] resize-y`}
          />
        </FieldShell>

        <div className="rounded-[28px] border border-blue-100 bg-[linear-gradient(135deg,rgba(239,246,255,0.9),rgba(255,255,255,1))] px-5 py-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold text-slate-900">Recommended default</p>
              <p className="mt-2 text-sm leading-7 text-slate-600">
                Mixed format, five questions, medium difficulty. It gives you enough breadth for a realistic
                mini-loop without turning the page into a long-form drill.
              </p>
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center rounded-2xl bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white shadow-md transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Building interview..." : "Generate interview session"}
            </button>
          </div>
        </div>
      </form>
    </section>
  );
}

export default MockInterviewSetupForm;

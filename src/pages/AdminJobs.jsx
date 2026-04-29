import { useEffect, useState } from "react";
import { LoaderCircle, Pencil, Plus, Save, Trash2, X } from "lucide-react";
import { createJob, deleteJob, fetchJobs, updateJob } from "../services/jobsApi";
import { toJobFormValues, toJobPayload } from "../utils/jobForm";

const EMPTY_FORM = toJobFormValues();

function Field({ label, value, onChange, placeholder, textarea = false }) {
  const className =
    "rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100";

  return (
    <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
      {label}
      {textarea ? (
        <textarea
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          rows={4}
          className={`${className} resize-y`}
        />
      ) : (
        <input value={value} onChange={onChange} placeholder={placeholder} className={className} />
      )}
    </label>
  );
}

function AdminJobs() {
  const [jobs, setJobs] = useState([]);
  const [formValues, setFormValues] = useState(EMPTY_FORM);
  const [editingJobId, setEditingJobId] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const loadJobs = async () => {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetchJobs({ limit: 100, sortBy: "postedAt", sortOrder: "desc" });
      setJobs(response.items || []);
    } catch (loadError) {
      setError(loadError.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadJobs();
  }, []);

  const handleChange = (key, value) => {
    setFormValues((current) => ({ ...current, [key]: value }));
  };

  const resetForm = () => {
    setFormValues(EMPTY_FORM);
    setEditingJobId("");
  };

  const handleEdit = (job) => {
    setEditingJobId(job.id);
    setFormValues(toJobFormValues(job));
    setSuccessMessage("");
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSaving(true);
    setError("");
    setSuccessMessage("");

    try {
      const payload = toJobPayload(formValues);

      if (editingJobId) {
        await updateJob(editingJobId, payload);
        setSuccessMessage("Job updated successfully.");
      } else {
        await createJob(payload);
        setSuccessMessage("Job created successfully.");
      }

      resetForm();
      await loadJobs();
    } catch (saveError) {
      setError(saveError.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (jobId) => {
    setError("");
    setSuccessMessage("");

    try {
      await deleteJob(jobId);
      setSuccessMessage("Job deleted successfully.");
      if (editingJobId === jobId) {
        resetForm();
      }
      await loadJobs();
    } catch (deleteError) {
      setError(deleteError.message);
    }
  };

  return (
    <main className="bg-slate-50 px-6 py-12">
      <div className="mx-auto max-w-7xl space-y-8">
        <section className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-blue-600">Admin Jobs</p>
              <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                {editingJobId ? "Edit Job" : "Create Job"}
              </h1>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
                Manage the MongoDB-backed job catalog. Array fields are comma-separated.
              </p>
            </div>

            <button
              type="button"
              onClick={resetForm}
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              {editingJobId ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
              {editingJobId ? "Cancel Edit" : "New Job"}
            </button>
          </div>

          {error ? <div className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div> : null}
          {successMessage ? (
            <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              {successMessage}
            </div>
          ) : null}

          <form onSubmit={handleSubmit} className="mt-6 grid gap-4 lg:grid-cols-2">
            <Field label="Title" value={formValues.title} onChange={(event) => handleChange("title", event.target.value)} placeholder="Senior React Developer" />
            <Field label="Company" value={formValues.company} onChange={(event) => handleChange("company", event.target.value)} placeholder="NovaStack" />
            <Field label="Location" value={formValues.location} onChange={(event) => handleChange("location", event.target.value)} placeholder="Amman, Jordan" />
            <Field label="Type" value={formValues.type} onChange={(event) => handleChange("type", event.target.value)} placeholder="Remote / Hybrid / On-site" />
            <Field label="Salary" value={formValues.salary} onChange={(event) => handleChange("salary", event.target.value)} placeholder="$2,500 - $3,000 / month" />
            <Field label="Category" value={formValues.category} onChange={(event) => handleChange("category", event.target.value)} placeholder="Frontend Developer" />
            <Field label="Experience Level" value={formValues.experienceLevel} onChange={(event) => handleChange("experienceLevel", event.target.value)} placeholder="Junior / Mid-Level / Senior" />
            <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700">
              <input
                type="checkbox"
                checked={formValues.isFeatured}
                onChange={(event) => handleChange("isFeatured", event.target.checked)}
                className="h-4 w-4 rounded border-slate-300"
              />
              Featured job
            </label>
            <div className="lg:col-span-2">
              <Field label="Description" value={formValues.description} onChange={(event) => handleChange("description", event.target.value)} placeholder="High-level role summary" textarea />
            </div>
            <div className="lg:col-span-2">
              <Field label="Overview" value={formValues.overview} onChange={(event) => handleChange("overview", event.target.value)} placeholder="Longer overview used on details page" textarea />
            </div>
            <Field label="Requirements" value={formValues.requirements} onChange={(event) => handleChange("requirements", event.target.value)} placeholder="React, TypeScript, REST APIs" />
            <Field label="Core Skills" value={formValues.coreSkills} onChange={(event) => handleChange("coreSkills", event.target.value)} placeholder="React, TypeScript" />
            <Field label="Nice To Have" value={formValues.niceToHave} onChange={(event) => handleChange("niceToHave", event.target.value)} placeholder="Testing, Accessibility" />
            <Field label="Tags" value={formValues.tags} onChange={(event) => handleChange("tags", event.target.value)} placeholder="SaaS, Product UI" />
            <div className="lg:col-span-2">
              <Field label="Responsibilities" value={formValues.responsibilities} onChange={(event) => handleChange("responsibilities", event.target.value)} placeholder="Build features, collaborate with design, review code" textarea />
            </div>
            <div className="lg:col-span-2">
              <Field label="Benefits" value={formValues.benefits} onChange={(event) => handleChange("benefits", event.target.value)} placeholder="Medical insurance, learning budget, bonus" textarea />
            </div>

            <div className="lg:col-span-2 flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={isSaving}
                className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                {isSaving ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                {editingJobId ? "Update Job" : "Create Job"}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Reset
              </button>
            </div>
          </form>
        </section>

        <section className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900">All Jobs</h2>
              <p className="mt-2 text-sm text-slate-600">Database-backed jobs available to the main Jobs page.</p>
            </div>
            {isLoading ? <LoaderCircle className="h-6 w-6 animate-spin text-blue-600" /> : null}
          </div>

          <div className="mt-6 overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead>
                <tr className="text-left text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                  <th className="pb-3">Job</th>
                  <th className="pb-3">Location</th>
                  <th className="pb-3">Type</th>
                  <th className="pb-3">Level</th>
                  <th className="pb-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {jobs.map((job) => (
                  <tr key={job.id} className="text-sm text-slate-700">
                    <td className="py-4">
                      <p className="font-semibold text-slate-900">{job.title}</p>
                      <p className="text-slate-500">{job.company}</p>
                    </td>
                    <td className="py-4">{job.location}</td>
                    <td className="py-4">{job.type}</td>
                    <td className="py-4">{job.level}</td>
                    <td className="py-4">
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => handleEdit(job)}
                          className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 font-semibold text-slate-700 transition hover:bg-slate-50"
                        >
                          <Pencil className="h-4 w-4" />
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => void handleDelete(job.id)}
                          className="inline-flex items-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 px-3 py-2 font-semibold text-rose-700 transition hover:bg-rose-100"
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}

export default AdminJobs;


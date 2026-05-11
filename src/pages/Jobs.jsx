import { useEffect, useMemo, useState } from "react";
import { LoaderCircle, Plus, Save } from "lucide-react";
import CVInputSection from "../components/CVInputSection";
import EmptyJobsSection from "../components/EmptyJobsSection";
import Hero from "../components/Hero";
import JobsPreviewSection from "../components/JobsPreviewSection";
import LoadingJobsSection from "../components/LoadingJobsSection";
import { useAuth } from "../context/useAuth";
import { createJob, fetchJobs, uploadCvPdf } from "../services/jobsApi";
import { toJobFormValues, toJobPayload } from "../utils/jobForm";
import {
  clearStoredAnalysis,
  readSavedJobs,
  readStoredAnalysis,
  readStoredFilters,
  writeSavedJobs,
  writeStoredAnalysis,
  writeStoredFilters,
} from "../utils/storage";

const DEFAULT_FILTERS = {
  search: "",
  sortBy: "newest",
  location: "all",
  experienceLevel: "all",
  category: "all",
  type: "all",
  minMatch: 0,
  savedOnly: false,
};

const INITIAL_VISIBLE_COUNT = 6;
const EMPTY_FORM = toJobFormValues();

function Field({ label, value, onChange, placeholder, textarea = false }) {
  const className =
    "rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100";

  return (
    <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
      {label}
      {textarea ? (
        <textarea value={value} onChange={onChange} placeholder={placeholder} rows={4} className={`${className} resize-y`} />
      ) : (
        <input value={value} onChange={onChange} placeholder={placeholder} className={className} />
      )}
    </label>
  );
}

function Jobs() {
  const { user } = useAuth();
  const isCompany = user?.role === "company";
  const [selectedFile, setSelectedFile] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(readStoredAnalysis());
  const [jobsResponse, setJobsResponse] = useState({ items: [], pagination: null });
  const [formValues, setFormValues] = useState(EMPTY_FORM);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [filters, setFilters] = useState(readStoredFilters(DEFAULT_FILTERS));
  const [savedJobs, setSavedJobs] = useState(readSavedJobs);
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT);

  useEffect(() => {
    writeStoredFilters(filters);
  }, [filters]);

  useEffect(() => {
    writeSavedJobs(savedJobs);
  }, [savedJobs]);

  const loadJobs = async () => {
    setIsPageLoading(true);

    try {
      const response = await fetchJobs({ limit: 50, sortBy: "postedAt", sortOrder: "desc" });
      setJobsResponse(response);
    } catch (loadError) {
      setError(loadError.message);
    } finally {
      setIsPageLoading(false);
    }
  };

  useEffect(() => {
    void loadJobs();
  }, [user?.role]);

  const baseJobs = analysisResult?.rankedJobs?.length ? analysisResult.rankedJobs : jobsResponse.items;

  const filteredJobs = useMemo(() => {
    const searchTerm = filters.search.trim().toLowerCase();

    return baseJobs
      .filter((job) => (filters.location === "all" ? true : job.location === filters.location))
      .filter((job) => (filters.experienceLevel === "all" ? true : (job.level || job.experienceLevel) === filters.experienceLevel))
      .filter((job) => (filters.category === "all" ? true : job.category === filters.category))
      .filter((job) => (filters.type === "all" ? true : job.type === filters.type))
      .filter((job) => (typeof job.matchScore === "number" ? job.matchScore >= filters.minMatch : true))
      .filter((job) => (filters.savedOnly ? savedJobs.includes(job.id) : true))
      .filter((job) => {
        if (!searchTerm) {
          return true;
        }

        return [job.title, job.company, job.category, ...(job.requirements || []), ...(job.searchableSkills || [])]
          .join(" ")
          .toLowerCase()
          .includes(searchTerm);
      })
      .sort((firstJob, secondJob) => {
        if (filters.sortBy === "lowest") {
          return (firstJob.matchScore || 0) - (secondJob.matchScore || 0);
        }

        if (filters.sortBy === "newest") {
          return new Date(secondJob.postedAt || 0) - new Date(firstJob.postedAt || 0);
        }

        return (secondJob.matchScore || 0) - (firstJob.matchScore || 0);
      });
  }, [baseJobs, filters, savedJobs]);

  const visibleJobs = filteredJobs.slice(0, visibleCount);
  const hasRankedJobs = Boolean(analysisResult?.rankedJobs?.length);

  const filterOptions = useMemo(() => {
    const allJobs = analysisResult?.rankedJobs?.length ? analysisResult.rankedJobs : jobsResponse.items;
    const toOptions = (items, allLabel) => [
      { value: "all", label: allLabel },
      ...[...new Set(items.filter(Boolean))].map((item) => ({ value: item, label: item })),
    ];

    return {
      locations: toOptions(allJobs.map((job) => job.location), "All locations"),
      levels: toOptions(allJobs.map((job) => job.level || job.experienceLevel), "All levels"),
      categories: toOptions(allJobs.map((job) => job.category), "All categories"),
      types: toOptions(allJobs.map((job) => job.type), "All types"),
    };
  }, [analysisResult, jobsResponse.items]);

  const handleAnalyze = async () => {
    if (!selectedFile) {
      setError("Select a PDF CV before running analysis.");
      return;
    }

    setIsUploading(true);
    setError("");
    setSuccessMessage("");

    try {
      const response = await uploadCvPdf(selectedFile);
      const resetFilters = { ...DEFAULT_FILTERS };
      const nextAnalysis = {
        extractedSkills: response.extractedSkills || [],
        rankedJobs: response.jobs || [],
        summary: response.summary || null,
        metadata: response.metadata || null,
        fileName: response.file?.originalName || selectedFile.name,
        analyzedAt: new Date().toISOString(),
      };

      setAnalysisResult(nextAnalysis);
      setFilters(resetFilters);
      setVisibleCount(INITIAL_VISIBLE_COUNT);
      setSuccessMessage(`CV analyzed successfully. Ranked ${response.jobs?.length || 0} jobs from the database.`);
      writeStoredAnalysis(nextAnalysis);
      writeStoredFilters(resetFilters);
    } catch (uploadError) {
      setError(uploadError.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleClear = () => {
    setSelectedFile(null);
    setAnalysisResult(null);
    setSuccessMessage("");
    setError("");
    setVisibleCount(INITIAL_VISIBLE_COUNT);
    clearStoredAnalysis();
  };

  const handleFilterChange = (key, value) => {
    setFilters((current) => ({ ...current, [key]: value }));
    setVisibleCount(INITIAL_VISIBLE_COUNT);
  };

  const handleToggleSave = (jobId) => {
    setSavedJobs((current) =>
      current.includes(jobId) ? current.filter((id) => id !== jobId) : [...current, jobId]
    );
  };

  const handleFormChange = (key, value) => {
    setFormValues((current) => ({ ...current, [key]: value }));
  };

  const handleCompanySubmit = async (event) => {
    event.preventDefault();
    setIsSaving(true);
    setError("");
    setSuccessMessage("");

    try {
      await createJob(toJobPayload(formValues));
      setFormValues(EMPTY_FORM);
      setSuccessMessage("Job submitted for admin review.");
      await loadJobs();
    } catch (saveError) {
      setError(saveError.message);
    } finally {
      setIsSaving(false);
    }
  };

  const hasPoorMatches =
    Boolean(analysisResult?.rankedJobs?.length) && (analysisResult.rankedJobs[0]?.matchScore || 0) < 55;

  if (isCompany) {
    return (
      <main className="bg-slate-50 px-6 py-12">
        <div className="mx-auto max-w-7xl space-y-8">
          <section className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-blue-600">Company Jobs</p>
                <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">Submit a Job</h1>
                <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
                  New company jobs stay pending until an admin approves them.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setFormValues(EMPTY_FORM)}
                className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                <Plus className="h-4 w-4" />
                New Job
              </button>
            </div>

            {error ? <div className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div> : null}
            {successMessage ? (
              <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                {successMessage}
              </div>
            ) : null}

            <form onSubmit={handleCompanySubmit} className="mt-6 grid gap-4 lg:grid-cols-2">
              <Field label="Title" value={formValues.title} onChange={(event) => handleFormChange("title", event.target.value)} placeholder="Senior React Developer" />
              <Field label="Company" value={formValues.company} onChange={(event) => handleFormChange("company", event.target.value)} placeholder="NovaStack" />
              <Field label="Location" value={formValues.location} onChange={(event) => handleFormChange("location", event.target.value)} placeholder="Amman, Jordan" />
              <Field label="Type" value={formValues.type} onChange={(event) => handleFormChange("type", event.target.value)} placeholder="Remote / Hybrid / On-site" />
              <Field label="Salary" value={formValues.salary} onChange={(event) => handleFormChange("salary", event.target.value)} placeholder="$2,500 - $3,000 / month" />
              <Field label="Category" value={formValues.category} onChange={(event) => handleFormChange("category", event.target.value)} placeholder="Frontend Developer" />
              <Field label="Experience Level" value={formValues.experienceLevel} onChange={(event) => handleFormChange("experienceLevel", event.target.value)} placeholder="Junior / Mid-Level / Senior" />
              <div className="lg:col-span-2">
                <Field label="Description" value={formValues.description} onChange={(event) => handleFormChange("description", event.target.value)} placeholder="High-level role summary" textarea />
              </div>
              <div className="lg:col-span-2">
                <Field label="Overview" value={formValues.overview} onChange={(event) => handleFormChange("overview", event.target.value)} placeholder="Longer overview used on details page" textarea />
              </div>
              <Field label="Requirements" value={formValues.requirements} onChange={(event) => handleFormChange("requirements", event.target.value)} placeholder="React, TypeScript, REST APIs" />
              <Field label="Core Skills" value={formValues.coreSkills} onChange={(event) => handleFormChange("coreSkills", event.target.value)} placeholder="React, TypeScript" />
              <Field label="Nice To Have" value={formValues.niceToHave} onChange={(event) => handleFormChange("niceToHave", event.target.value)} placeholder="Testing, Accessibility" />
              <Field label="Tags" value={formValues.tags} onChange={(event) => handleFormChange("tags", event.target.value)} placeholder="SaaS, Product UI" />

              <div className="lg:col-span-2">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                >
                  {isSaving ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  Submit for Review
                </button>
              </div>
            </form>
          </section>

          <section className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-2xl font-bold tracking-tight text-slate-900">Your Jobs</h2>
              {isPageLoading ? <LoaderCircle className="h-6 w-6 animate-spin text-blue-600" /> : null}
            </div>
            <div className="mt-6 overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead>
                  <tr className="text-left text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                    <th className="pb-3">Job</th>
                    <th className="pb-3">Location</th>
                    <th className="pb-3">Type</th>
                    <th className="pb-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {jobsResponse.items.map((job) => (
                    <tr key={job.id} className="text-sm text-slate-700">
                      <td className="py-4">
                        <p className="font-semibold text-slate-900">{job.title}</p>
                        <p className="text-slate-500">{job.company}</p>
                      </td>
                      <td className="py-4">{job.location}</td>
                      <td className="py-4">{job.type}</td>
                      <td className="py-4 capitalize">{job.status}</td>
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

  return (
    <main className="min-h-screen bg-white">
      <Hero />

      <CVInputSection
        selectedFile={selectedFile}
        onSelectFile={setSelectedFile}
        onAnalyze={handleAnalyze}
        onClear={handleClear}
        analysis={analysisResult}
        isLoading={isUploading}
        error={error}
        successMessage={successMessage}
        stats={{
          detectedSkills: analysisResult?.extractedSkills?.length || "--",
          recommendedJobs: filteredJobs.length || (analysisResult ? 0 : "--"),
          savedJobs: savedJobs.length,
        }}
      />

      {isPageLoading ? (
        <LoadingJobsSection />
      ) : hasRankedJobs ? (
        <JobsPreviewSection
          summary={analysisResult?.summary}
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={() => {
            setFilters(DEFAULT_FILTERS);
            setVisibleCount(INITIAL_VISIBLE_COUNT);
          }}
          filterOptions={filterOptions}
          jobs={filteredJobs}
          visibleJobs={visibleJobs}
          savedJobs={savedJobs}
          onToggleSave={handleToggleSave}
          onShowMore={() => setVisibleCount((count) => count + 6)}
          canShowMore={visibleJobs.length < filteredJobs.length}
          hasPoorMatches={hasPoorMatches}
        />
      ) : analysisResult ? (
        <EmptyJobsSection />
      ) : (
        <JobsPreviewSection
          summary={null}
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={() => {
            setFilters(DEFAULT_FILTERS);
            setVisibleCount(INITIAL_VISIBLE_COUNT);
          }}
          filterOptions={filterOptions}
          jobs={filteredJobs}
          visibleJobs={visibleJobs}
          savedJobs={savedJobs}
          onToggleSave={handleToggleSave}
          onShowMore={() => setVisibleCount((count) => count + 6)}
          canShowMore={visibleJobs.length < filteredJobs.length}
          hasPoorMatches={false}
        />
      )}
    </main>
  );
}

export default Jobs;

import { useEffect, useMemo, useState } from "react";
import CVInputSection from "../components/CVInputSection";
import EmptyJobsSection from "../components/EmptyJobsSection";
import Hero from "../components/Hero";
import JobsPreviewSection from "../components/JobsPreviewSection";
import LoadingJobsSection from "../components/LoadingJobsSection";
import { fetchJobs, uploadCvPdf } from "../services/jobsApi";
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

function Jobs() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(readStoredAnalysis());
  const [jobsResponse, setJobsResponse] = useState({ items: [], pagination: null });
  const [isPageLoading, setIsPageLoading] = useState(true);
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

  useEffect(() => {
    async function loadJobs() {
      setIsPageLoading(true);

      try {
        const response = await fetchJobs({ limit: 50, sortBy: "postedAt", sortOrder: "desc" });
        setJobsResponse(response);
      } catch (loadError) {
        setError(loadError.message);
      } finally {
        setIsPageLoading(false);
      }
    }

    void loadJobs();
  }, []);

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

  const hasPoorMatches =
    Boolean(analysisResult?.rankedJobs?.length) && (analysisResult.rankedJobs[0]?.matchScore || 0) < 55;

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

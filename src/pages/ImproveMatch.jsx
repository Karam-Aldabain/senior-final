import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { LoaderCircle } from "lucide-react";
import CoachActionPlan from "../components/coach/CoachActionPlan";
import CoachCvTips from "../components/coach/CoachCvTips";
import CoachEmptyState from "../components/coach/CoachEmptyState";
import CoachHeader from "../components/coach/CoachHeader";
import CoachInterviewTips from "../components/coach/CoachInterviewTips";
import CoachChatSection from "../components/coach/CoachChatSection";
import CoachRoadmap from "../components/coach/CoachRoadmap";
import CoachSampleBullets from "../components/coach/CoachSampleBullets";
import CoachSkillsBreakdown from "../components/coach/CoachSkillsBreakdown";
import CoachSummaryCards from "../components/coach/CoachSummaryCards";
import { fetchJobById } from "../services/jobsApi";
import { generateCoachPlan } from "../utils/generateCoachPlan";
import { getStoredJobAnalysis, readStoredAnalysis, writeStoredCoachJobId } from "../utils/storage";

function ImproveMatch() {
  const { id } = useParams();
  const storedAnalysis = readStoredAnalysis();
  const [job, setJob] = useState(null);
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

  useEffect(() => {
    if (job) {
      writeStoredCoachJobId(job.id);
    }
  }, [job]);

  const storedJobAnalysis = job ? getStoredJobAnalysis(job.id) : null;
  const plan = useMemo(() => (job ? generateCoachPlan(job, storedAnalysis) : null), [job, storedAnalysis]);

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
    <main className="bg-slate-50 px-6 py-12 md:py-16">
      <div className="mx-auto max-w-7xl space-y-8">
        <CoachHeader job={job} plan={plan} />

        {!plan.hasPersonalizedData ? <CoachEmptyState job={job} /> : null}

        <CoachSummaryCards plan={plan} />
        <CoachSkillsBreakdown plan={plan} />
        <CoachActionPlan plan={plan} />
        <CoachCvTips plan={plan} job={job} />
        <CoachRoadmap roadmap={plan.roadmap} />
        <CoachSampleBullets bullets={plan.sampleBullets} />
        <CoachInterviewTips tips={plan.interviewTips} />
        <CoachChatSection
          job={job}
          plan={plan}
          cvText={storedAnalysis?.cvText || ""}
          extractedSkills={storedAnalysis?.extractedSkills || []}
          matchData={storedJobAnalysis || plan}
        />
      </div>
    </main>
  );
}

export default ImproveMatch;

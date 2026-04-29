import { dedupeSkills, formatSkill } from "./normalizeSkills";

export const DEFAULT_INTERVIEW_SETUP = {
  role: "Frontend Developer",
  experienceLevel: "mid",
  interviewType: "mixed",
  difficulty: "medium",
  questionCount: 5,
  companyName: "",
  jobDescription: "",
  skills: ["react", "javascript", "css"],
  cvText: "",
};

export const EXPERIENCE_LEVEL_OPTIONS = [
  { value: "entry", label: "Entry" },
  { value: "junior", label: "Junior" },
  { value: "mid", label: "Mid" },
  { value: "senior", label: "Senior" },
];

export const INTERVIEW_TYPE_OPTIONS = [
  { value: "mixed", label: "Mixed" },
  { value: "technical", label: "Technical" },
  { value: "behavioral", label: "Behavioral" },
  { value: "hr", label: "HR" },
];

export const DIFFICULTY_OPTIONS = [
  { value: "easy", label: "Easy" },
  { value: "medium", label: "Medium" },
  { value: "hard", label: "Hard" },
];

export const QUESTION_COUNT_OPTIONS = [3, 4, 5, 6, 7, 8];

export const COACH_PROMPTS = [
  "How could I improve answer 3?",
  "Give me a stronger technical answer",
  "Ask me a harder follow-up",
  "What mistakes am I making?",
];

export const INTERVIEW_SETUP_SUGGESTIONS = [
  {
    label: "Frontend Product",
    values: {
      role: "Frontend Developer",
      experienceLevel: "mid",
      interviewType: "mixed",
      difficulty: "medium",
      questionCount: 5,
      skills: ["react", "javascript", "tailwind", "rest api"],
      companyName: "Product Team",
    },
  },
  {
    label: "Senior Backend",
    values: {
      role: "Senior Backend Engineer",
      experienceLevel: "senior",
      interviewType: "technical",
      difficulty: "hard",
      questionCount: 6,
      skills: ["node.js", "postgresql", "system design", "redis"],
      companyName: "Platform Team",
    },
  },
  {
    label: "HR Rehearsal",
    values: {
      role: "Product Analyst",
      experienceLevel: "junior",
      interviewType: "hr",
      difficulty: "medium",
      questionCount: 4,
      skills: ["sql", "communication", "stakeholder management"],
      companyName: "Growth Team",
    },
  },
];

export function createEmptyDrafts(questions = []) {
  return questions.reduce((accumulator, question) => {
    accumulator[question.id] = "";
    return accumulator;
  }, {});
}

export function parseSkillInput(value) {
  return dedupeSkills(
    String(value || "")
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean)
  ).slice(0, 10);
}

export function stringifySkillInput(skills = []) {
  return skills.map((skill) => formatSkill(skill)).join(", ");
}

export function sanitizeSetupPayload(formState) {
  return {
    role: String(formState.role || "").trim(),
    experienceLevel: formState.experienceLevel || DEFAULT_INTERVIEW_SETUP.experienceLevel,
    interviewType: formState.interviewType || DEFAULT_INTERVIEW_SETUP.interviewType,
    difficulty: formState.difficulty || DEFAULT_INTERVIEW_SETUP.difficulty,
    questionCount: Number(formState.questionCount) || DEFAULT_INTERVIEW_SETUP.questionCount,
    companyName: String(formState.companyName || "").trim(),
    jobDescription: String(formState.jobDescription || "").trim(),
    skills: Array.isArray(formState.skills) ? formState.skills.filter(Boolean) : [],
    cvText: String(formState.cvText || "").trim(),
  };
}

export function validateInterviewSetup(formState) {
  const errors = {};

  if (!String(formState.role || "").trim()) {
    errors.role = "Target role is required.";
  }

  if (!Number.isFinite(Number(formState.questionCount))) {
    errors.questionCount = "Question count is required.";
  }

  return errors;
}

export function getAnswerMap(session) {
  return (session?.answers || []).reduce((accumulator, entry) => {
    accumulator[entry.questionId] = entry;
    return accumulator;
  }, {});
}

export function getCompletionStats(session) {
  const totalQuestions = session?.questions?.length || 0;
  const answers = session?.answers || [];
  const answeredCount = answers.filter((entry) => entry.answer || entry.skipped).length;

  return {
    totalQuestions,
    answeredCount,
    skippedCount: answers.filter((entry) => entry.skipped).length,
    completionRate: totalQuestions ? Math.round((answeredCount / totalQuestions) * 100) : 0,
  };
}

export function buildResultsExport(session) {
  if (!session) {
    return "";
  }

  const summary = session.summary;

  return [
    `Mock Interview Report`,
    `Role: ${session.setup.role}`,
    `Experience: ${session.setup.experienceLevel}`,
    `Interview type: ${session.setup.interviewType}`,
    `Difficulty: ${session.setup.difficulty}`,
    `Mode: ${session.mode}`,
    "",
    summary ? `Overall score: ${summary.overallScore}/100` : "Overall score: Pending",
    summary ? `Completion rate: ${summary.completionRate}%` : "",
    summary?.interviewerSummary || "",
    "",
    "Questions and feedback",
    ...(session.questions || []).flatMap((question, index) => {
      const answer = (session.answers || []).find((entry) => entry.questionId === question.id);

      return [
        `${index + 1}. ${question.prompt}`,
        `Answer: ${answer?.answer || (answer?.skipped ? "Skipped" : "Not answered")}`,
        `Score: ${answer?.feedback?.overallScore ?? "Pending"}`,
        `Strengths: ${(answer?.feedback?.strengths || []).join("; ") || "N/A"}`,
        `Weaknesses: ${(answer?.feedback?.weaknesses || []).join("; ") || "N/A"}`,
        "",
      ];
    }),
  ].join("\n");
}

export function findQuestionById(session, questionId) {
  return (session?.questions || []).find((question) => question.id === questionId) || null;
}

export function getModeLabel(mode) {
  return mode === "ai" ? "Live AI Interview Engine" : "Smart Local Interview Engine";
}

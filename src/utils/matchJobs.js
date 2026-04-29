import { extractSkillsFromCv } from "./extractSkills";
import {
  dedupeSkills,
  formatSkill,
  normalizeText,
  normalizeSkill,
  skillMatchesText,
} from "./normalizeSkills";

function getCompanyInitials(company = "") {
  return company
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join("");
}

function toDisplaySkills(skills = []) {
  return dedupeSkills(skills).map((skill) => formatSkill(skill));
}

function getMatchTone(score) {
  if (score >= 80) {
    return { label: "Excellent fit", tone: "emerald" };
  }

  if (score >= 60) {
    return { label: "Strong fit", tone: "blue" };
  }

  if (score >= 40) {
    return { label: "Moderate fit", tone: "amber" };
  }

  return { label: "Weak fit", tone: "rose" };
}

function uniqueRequirements(job) {
  return dedupeSkills(
    Array.isArray(job.requirements) && job.requirements.length > 0
      ? job.requirements
      : Array.isArray(job.skills)
        ? job.skills
        : []
  );
}

function uniqueCoreSkills(job, requirements) {
  const core =
    Array.isArray(job.coreSkills) && job.coreSkills.length > 0
      ? job.coreSkills
      : requirements.slice(0, Math.min(3, requirements.length));

  return dedupeSkills(core);
}

function getProfileSignals(cvText = "") {
  const lowered = cvText.toLowerCase();

  return {
    hasQuantifiedImpact: /\b\d+[%+]?/.test(lowered),
    mentionsProjects: /(project|built|developed|launched|shipped|implemented)/.test(lowered),
    mentionsDesign: /(design|figma|ux|ui)/.test(lowered),
    mentionsBackend: /(node|express|api|database|mongodb|sql)/.test(lowered),
    mentionsTesting: /(test|jest|vitest|cypress|playwright|qa)/.test(lowered),
  };
}

function createExplanation(job, matchedSkills, missingSkills, score, signals) {
  const matched = toDisplaySkills(matchedSkills);
  const missing = toDisplaySkills(missingSkills);

  if (score >= 80) {
    return `${job.title} is a strong fit because your CV already aligns with ${matched.slice(0, 3).join(", ")}${signals.hasQuantifiedImpact ? " and includes outcome-focused experience" : ""}${missing.length ? `. Adding stronger proof for ${missing.slice(0, 2).join(" and ")} would make the profile even tighter.` : "."}`;
  }

  if (score >= 60) {
    return `You already cover important parts of this role through ${matched.slice(0, 3).join(", ")}. The main gap is ${missing.slice(0, 2).join(" and ") || "deeper role-specific evidence"}, so a few sharper CV bullets could move this into a stronger match.`;
  }

  if (matched.length > 0) {
    return `This role is still within reach because your CV shows overlap in ${matched.slice(0, 2).join(" and ")}. To become competitive faster, add clearer proof of ${missing.slice(0, 3).join(", ") || "the role's core stack"}.`;
  }

  return `This is one of the closest options in the current dataset, but your CV does not yet show the core stack for this role. Start with ${missing.slice(0, 3).join(", ")} and tie each one to a real project or measurable result.`;
}

function buildImprovementSuggestions(job, matchedSkills, missingSkills, score) {
  const matched = toDisplaySkills(matchedSkills);
  const missing = toDisplaySkills(missingSkills);
  const highestPriority = missing.slice(0, 3);
  const headline = highestPriority.length
    ? `Close the gap on ${highestPriority.join(", ")} to improve your fit for ${job.title}.`
    : `Your profile already aligns well with ${job.title}.`;

  return {
    headline,
    personalizedSuggestions: [
      highestPriority[0]
        ? `Add one bullet that proves ${highestPriority[0]} with the feature you built, the stack you used, and the result you achieved.`
        : "Refine your strongest project bullets with impact, ownership, and technical depth.",
      matched.length
        ? `Move ${matched.slice(0, 2).join(" and ")} closer to the top of your CV summary and recent experience.`
        : "Reorder your CV so the work closest to this role appears before generic experience.",
      score < 60
        ? `Mirror the wording of the job requirements more closely where it is truthful, especially around ${highestPriority[1] || highestPriority[0] || "the role's core stack"}.`
        : "Quantify the strongest matching work to make the fit feel more credible to recruiters.",
    ].filter(Boolean),
    cvAdditions: highestPriority.length
      ? highestPriority.map(
          (skill) =>
            `Add a project or experience bullet that names ${skill}, explains what you delivered, and includes a concrete outcome or responsibility.`
        )
      : [
          "Add measurable impact, ownership, and delivery context to the best-matching projects on your CV.",
        ],
    nextSkillsToLearn: highestPriority.length ? highestPriority : ["TypeScript", "Testing", "REST APIs"],
  };
}

function getJobKeywords(job) {
  return dedupeSkills([
    ...(job.requirements || []),
    ...(job.coreSkills || []),
    ...(job.niceToHave || []),
    job.category,
    job.title,
  ]);
}

function buildJobAnalysis(job, normalizedCv, extractedSkills, signals) {
  const requirements = uniqueRequirements(job);
  const coreSkills = uniqueCoreSkills(job, requirements);
  const niceToHave = dedupeSkills(job.niceToHave || []);
  const cvSkillSet = new Set(extractedSkills.map((skill) => normalizeSkill(skill)));

  let matchedWeight = 0;
  let totalWeight = 0;

  const matchedSkills = [];
  const missingSkills = [];

  requirements.forEach((requirement) => {
    const isCore = coreSkills.includes(requirement);
    const weight = isCore ? 20 : 12;
    totalWeight += weight;

    if (cvSkillSet.has(requirement) || skillMatchesText(requirement, normalizedCv)) {
      matchedWeight += weight;
      matchedSkills.push(requirement);
    } else {
      missingSkills.push(requirement);
      if (isCore) {
        matchedWeight -= 2;
      }
    }
  });

  niceToHave.forEach((skill) => {
    totalWeight += 5;

    if (cvSkillSet.has(skill) || skillMatchesText(skill, normalizedCv)) {
      matchedWeight += 5;
      matchedSkills.push(skill);
    }
  });

  const normalizedCategory = normalizeSkill(job.category);
  const normalizedTitle = normalizeSkill(job.title);

  if (skillMatchesText(normalizedCategory, normalizedCv)) {
    matchedWeight += 6;
  }

  if (skillMatchesText(normalizedTitle, normalizedCv)) {
    matchedWeight += 8;
  }

  if (signals.mentionsProjects) {
    matchedWeight += 3;
  }

  if (signals.hasQuantifiedImpact) {
    matchedWeight += 2;
  }

  if (signals.mentionsDesign && job.category.toLowerCase().includes("front")) {
    matchedWeight += 3;
  }

  if (signals.mentionsBackend && ["Backend", "Full Stack"].includes(job.category)) {
    matchedWeight += 3;
  }

  if (signals.mentionsTesting && getJobKeywords(job).includes("testing")) {
    matchedWeight += 3;
  }

  const rawScore = totalWeight > 0 ? Math.round((Math.max(matchedWeight, 0) / totalWeight) * 100) : 0;
  const matchScore = Math.max(18, Math.min(rawScore, 98));
  const matchTone = getMatchTone(matchScore);
  const improvement = buildImprovementSuggestions(job, matchedSkills, missingSkills, matchScore);

  return {
    ...job,
    requirements: toDisplaySkills(requirements),
    coreSkills: toDisplaySkills(coreSkills),
    niceToHave: toDisplaySkills(niceToHave),
    matchedSkills: toDisplaySkills(matchedSkills),
    missingSkills: toDisplaySkills(missingSkills),
    companyInitials: getCompanyInitials(job.company),
    descriptionPreview: job.description,
    matchScore,
    matchLabel: matchTone.label,
    matchTone: matchTone.tone,
    explanation: createExplanation(job, matchedSkills, missingSkills, matchScore, signals),
    improvement,
  };
}

function summarizeRoles(rankedJobs) {
  const counts = rankedJobs.reduce((accumulator, job) => {
    accumulator[job.category] = (accumulator[job.category] || 0) + 1;
    return accumulator;
  }, {});

  return Object.entries(counts)
    .sort((first, second) => second[1] - first[1])
    .slice(0, 2)
    .map(([category]) => category);
}

function summarizeMissingSkills(rankedJobs) {
  const counts = rankedJobs.reduce((accumulator, job) => {
    job.missingSkills.slice(0, 3).forEach((skill) => {
      accumulator[skill] = (accumulator[skill] || 0) + 1;
    });
    return accumulator;
  }, {});

  return Object.entries(counts)
    .sort((first, second) => second[1] - first[1])
    .slice(0, 5)
    .map(([skill]) => skill);
}

function createSummary(extractedSkills, rankedJobs) {
  const topJob = rankedJobs[0] || null;
  const roleSummary = summarizeRoles(rankedJobs);
  const topMissingSkills = summarizeMissingSkills(rankedJobs);
  const bestFitSummary = roleSummary.length
    ? `${roleSummary.join(" and ")} roles`
    : "generalist early-career roles";
  const summarySentence = topJob
    ? `Based on your CV, you are strongest for ${bestFitSummary.toLowerCase()}, and ${topJob.title} at ${topJob.company} is the closest fit right now. Adding ${topMissingSkills.slice(0, 2).join(" and ") || "more role-specific project evidence"} would improve your strongest applications.`
    : "Add more role-specific skills and project detail to generate sharper recommendations.";

  return {
    topJob,
    recommendedCount: rankedJobs.length,
    detectedSkills: extractedSkills,
    bestFitCategories: roleSummary,
    bestFitSummary,
    topMissingSkills,
    summarySentence,
  };
}

export function matchJobs(cvText, jobs = []) {
  const normalizedCv = normalizeText(cvText);
  const extractedSkills = extractSkillsFromCv(cvText, jobs);
  const signals = getProfileSignals(cvText);

  const rankedJobs = jobs
    .map((job) => buildJobAnalysis(job, normalizedCv, extractedSkills, signals))
    .sort((firstJob, secondJob) => secondJob.matchScore - firstJob.matchScore);

  return {
    extractedSkills,
    rankedJobs,
    summary: createSummary(extractedSkills, rankedJobs),
  };
}

export function buildImprovementGuide(job, storedAnalysisJob) {
  const source = storedAnalysisJob || {
    ...job,
    matchedSkills: [],
    missingSkills: toDisplaySkills(job.requirements || []),
    explanation:
      "Analyze your CV from the Jobs page to unlock personalized matching details for this role.",
    improvement: {
      headline: `Focus on the core skills required for ${job.title}.`,
      personalizedSuggestions: [
        "Add project bullets that prove the required stack with concrete outcomes.",
        "Reorder your CV so the most relevant experience appears first.",
        "Match your wording to the job requirements where it is truthful and specific.",
      ],
      cvAdditions: (job.requirements || [])
        .slice(0, 4)
        .map((skill) => `Add evidence for ${skill} through projects, internships, or coursework.`),
      nextSkillsToLearn: (job.requirements || []).slice(0, 4),
    },
  };

  return {
    matchedSkills: source.matchedSkills || [],
    missingSkills: source.missingSkills || [],
    explanation: source.explanation,
    headline: source.improvement?.headline || `Improve your alignment with ${job.title}.`,
    personalizedSuggestions: source.improvement?.personalizedSuggestions || [],
    cvAdditions: source.improvement?.cvAdditions || [],
    nextSkillsToLearn: source.improvement?.nextSkillsToLearn || [],
  };
}

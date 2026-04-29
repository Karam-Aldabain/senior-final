import { extractSkillsFromText } from "../../shared/skills/extractSkillsFromText.js";
import {
  dedupeSkills,
  formatSkill,
  normalizeSkill,
  normalizeText,
  skillMatchesText,
} from "../../shared/skills/normalizeSkills.js";
import { serializeJob } from "./jobFormatters.js";

function toneFromScore(score) {
  if (score >= 80) {
    return { label: "Excellent fit", tone: "emerald" };
  }

  if (score >= 65) {
    return { label: "Strong fit", tone: "blue" };
  }

  if (score >= 45) {
    return { label: "Moderate fit", tone: "amber" };
  }

  return { label: "Stretch role", tone: "rose" };
}

function displaySkills(skills = []) {
  return dedupeSkills(skills).map((skill) => formatSkill(skill));
}

function collectJobSkills(job) {
  return dedupeSkills([
    ...(job.requirements || []),
    ...(job.coreSkills || []),
    ...(job.niceToHave || []),
    ...(job.tags || []),
    job.category,
    job.title,
  ]);
}

function buildExplanation(job, matchedSkills, missingSkills, matchScore) {
  if (matchedSkills.length === 0) {
    return `Low match right now because the CV does not show the core stack for ${job.title}. Start with ${missingSkills.slice(0, 3).join(", ")}.`;
  }

  if (matchScore >= 75) {
    return `Strong match because the CV includes ${matchedSkills.slice(0, 4).join(", ")}${missingSkills.length ? `, with smaller gaps around ${missingSkills.slice(0, 2).join(" and ")}.` : "."}`;
  }

  return `Partial match because the CV already covers ${matchedSkills.slice(0, 4).join(", ")}, but the role still expects ${missingSkills.slice(0, 3).join(", ")}.`;
}

function scoreJobAgainstCv(job, normalizedCvText, cvSkills) {
  const cvSkillSet = new Set(cvSkills.map((skill) => normalizeSkill(skill)));
  const requirements = dedupeSkills(job.requirements || []);
  const coreSkills = dedupeSkills(job.coreSkills?.length ? job.coreSkills : requirements.slice(0, 4));
  const niceToHave = dedupeSkills(job.niceToHave || []);

  let earned = 0;
  let total = 0;

  const matchedSkills = [];
  const missingSkills = [];

  requirements.forEach((requirement) => {
    const isCore = coreSkills.includes(requirement);
    const weight = isCore ? 12 : 7;
    total += weight;

    if (cvSkillSet.has(requirement) || skillMatchesText(requirement, normalizedCvText)) {
      earned += weight;
      matchedSkills.push(requirement);
    } else {
      missingSkills.push(requirement);
    }
  });

  niceToHave.forEach((skill) => {
    total += 3;
    if (cvSkillSet.has(skill) || skillMatchesText(skill, normalizedCvText)) {
      earned += 3;
      matchedSkills.push(skill);
    }
  });

  if (skillMatchesText(job.title, normalizedCvText)) {
    earned += 4;
    total += 4;
  }

  if (skillMatchesText(job.category, normalizedCvText)) {
    earned += 3;
    total += 3;
  }

  const matchScore = total > 0 ? Math.max(0, Math.min(100, Math.round((earned / total) * 100))) : 0;
  const tone = toneFromScore(matchScore);

  return {
    matchedSkills: displaySkills(matchedSkills),
    missingSkills: displaySkills(missingSkills),
    matchScore,
    matchLabel: tone.label,
    matchTone: tone.tone,
    explanation: buildExplanation(job, displaySkills(matchedSkills), displaySkills(missingSkills), matchScore),
  };
}

function buildSummary(extractedSkills, rankedJobs) {
  const topJob = rankedJobs[0] || null;
  const topMissingSkills = [...new Set(rankedJobs.flatMap((job) => job.missingSkills).slice(0, 8))];
  const bestFitCategories = [...new Set(rankedJobs.slice(0, 5).map((job) => job.category))];

  return {
    detectedSkills: extractedSkills,
    detectedSkillsCount: extractedSkills.length,
    topJob,
    recommendedCount: rankedJobs.length,
    bestFitCategories,
    bestFitSummary: bestFitCategories.length ? `${bestFitCategories.join(", ")} roles` : "Generalist roles",
    topMissingSkills,
    summarySentence: topJob
      ? `${topJob.title} at ${topJob.company} is the strongest current match. The biggest gaps across the ranked roles are ${topMissingSkills.slice(0, 3).join(", ") || "role-specific project depth"}.`
      : "Upload a CV to generate a ranked job summary.",
  };
}

export function matchJobsAgainstCv(rawText = "", jobs = []) {
  const { extractedSkills, metadata } = extractSkillsFromText(rawText);
  const normalizedCvText = normalizeText(rawText);

  const rankedJobs = jobs
    .map((job) => ({
      ...serializeJob(job),
      ...scoreJobAgainstCv(job, normalizedCvText, extractedSkills),
      searchableSkills: collectJobSkills(job).map((skill) => formatSkill(skill)),
      descriptionPreview: job.overview || job.description,
    }))
    .sort((firstJob, secondJob) => secondJob.matchScore - firstJob.matchScore);

  return {
    rawText,
    extractedSkills,
    metadata,
    rankedJobs,
    summary: buildSummary(extractedSkills, rankedJobs),
  };
}


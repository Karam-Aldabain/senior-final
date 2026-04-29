function formatList(items = []) {
  return Array.isArray(items) && items.length > 0 ? items.join(", ") : "none listed";
}

function createPriorityGaps(matchData, job) {
  const missingSkills = matchData?.missingSkills || [];

  if (missingSkills.length > 0) {
    return missingSkills.slice(0, 3);
  }

  return (job.requirements || []).slice(0, 3);
}

function createOpening(payload) {
  const score = typeof payload.matchData?.matchScore === "number" ? `${payload.matchData.matchScore}%` : "an unknown";
  return `For ${payload.job.title} at ${payload.job.company}, your current fit looks like ${score} match.`;
}

function createActionSteps(payload) {
  const topGaps = createPriorityGaps(payload.matchData, payload.job);
  const matchedSkills = payload.matchData?.matchedSkills || payload.extractedSkills || [];

  const steps = [
    `Rewrite your CV summary so it explicitly targets ${payload.job.title} and mentions ${formatList(
      matchedSkills.slice(0, 3)
    )}.`,
    `Add 2-3 project or experience bullets that prove ${formatList(topGaps)} with concrete outcomes, tools, and scope.`,
    `Prepare short interview stories around ${formatList((payload.job.coreSkills || []).slice(0, 3))}.`,
  ];

  return steps.map((step) => `- ${step}`).join("\n");
}

function createCvSuggestions(payload) {
  const topGaps = createPriorityGaps(payload.matchData, payload.job);

  return [
    "- Lead each bullet with an action verb and end with a measurable result where possible.",
    `- Mirror the job language for key requirements such as ${formatList((payload.job.requirements || []).slice(0, 4))}.`,
    `- If you lack direct experience in ${formatList(topGaps)}, use coursework, personal projects, freelance work, or labs as evidence instead of leaving the gap unaddressed.`,
  ].join("\n");
}

export function createLocalCoachReply(payload) {
  const topGaps = createPriorityGaps(payload.matchData, payload.job);

  return [
    createOpening(payload),
    "",
    `Your strongest evidence right now: ${formatList((payload.matchData?.matchedSkills || []).slice(0, 5))}.`,
    `The main gaps to close: ${formatList(topGaps)}.`,
    "",
    "Best next steps",
    createActionSteps(payload),
    "",
    "CV improvements",
    createCvSuggestions(payload),
    "",
    `Your question was: "${payload.message}"`,
    "The live AI provider is unavailable, so this reply was generated from the local job and CV context already in the app.",
  ].join("\n");
}

function clipText(value, maxLength = 5000) {
  if (typeof value !== "string") {
    return "";
  }

  const normalized = value.trim();

  if (normalized.length <= maxLength) {
    return normalized;
  }

  return `${normalized.slice(0, maxLength)}\n...[truncated for brevity]`;
}

function formatList(items) {
  return Array.isArray(items) && items.length > 0 ? items.join(", ") : "Not provided";
}

function formatScore(matchScore) {
  return typeof matchScore === "number" ? `${matchScore}%` : "Not available";
}

function formatTranscript(messages = []) {
  if (!Array.isArray(messages) || messages.length === 0) {
    return "No previous chat history.";
  }

  return messages
    .map((item) => `${item.role === "assistant" ? "Coach" : "User"}: ${clipText(item.content, 1200)}`)
    .join("\n");
}

function createContextBlock({ job, cvText, extractedSkills, matchData, pageContext }) {
  return [
    "JOB CONTEXT",
    `Title: ${job.title}`,
    `Company: ${job.company}`,
    `Category: ${job.category}`,
    `Level: ${job.level}`,
    `Location: ${job.location}`,
    `Work type: ${job.type}`,
    `Overview: ${clipText(job.overview || job.description || "Not provided", 1200)}`,
    `Required skills: ${formatList(job.requirements)}`,
    `Core skills: ${formatList(job.coreSkills)}`,
    `Nice to have: ${formatList(job.niceToHave)}`,
    "",
    "CANDIDATE CONTEXT",
    `CV text: ${clipText(cvText || "No CV provided. Advice should be more general until CV analysis exists.", 4500)}`,
    `Extracted CV skills: ${formatList(extractedSkills)}`,
    `Match score: ${formatScore(matchData?.matchScore)}`,
    `Matched skills: ${formatList(matchData?.matchedSkills)}`,
    `Missing skills: ${formatList(matchData?.missingSkills)}`,
    `Current explanation: ${clipText(matchData?.explanation || "No match explanation available.", 1000)}`,
    "",
    "PAGE CONTEXT",
    pageContext || "Coach page focused on improving fit for the selected role.",
  ].join("\n");
}

export function buildCoachPrompt({
  job,
  message,
  cvText,
  extractedSkills,
  matchData,
  messages,
  pageContext,
}) {
  const instructions = [
    "You are a premium AI Job Coach for a job-matching platform.",
    "Your job is to give practical, personalized, and job-specific advice using the supplied job, CV, and match context.",
    "Stay tightly focused on the selected role instead of giving generic career advice.",
    "Be honest about readiness to apply. If context is missing, say what is missing and give the best job-specific advice possible.",
    "When useful, use short bullet lists with concrete next steps, rewritten CV bullets, interview talking points, project ideas, or a weekly learning roadmap.",
    "If asked to rewrite CV content, write it directly and make it stronger, more specific, and more aligned to the role.",
    "If the user is missing skills, explain which gaps matter most, why they matter for screening, and what action would improve fit fastest.",
    "Do not invent experience, results, degrees, employers, or tools that are not grounded in the provided context.",
    "Keep the tone direct, supportive, and realistic.",
  ].join(" ");

  const input = [
    {
      role: "user",
      content: [
        {
          type: "input_text",
          text: [
            "Use this as the ground-truth context for the conversation.",
            "",
            createContextBlock({
              job,
              cvText,
              extractedSkills,
              matchData,
              pageContext,
            }),
            "",
            "RECENT CHAT HISTORY",
            formatTranscript(messages),
          ].join("\n"),
        },
      ],
    },
    {
      role: "user",
      content: [{ type: "input_text", text: clipText(message, 3000) }],
    },
  ];

  return {
    instructions,
    input,
  };
}

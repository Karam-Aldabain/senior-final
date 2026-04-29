function normalizeText(value) {
  return typeof value === "string" ? value.toLowerCase() : "";
}

function titleCase(value) {
  return String(value || "")
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0]?.toUpperCase() + part.slice(1))
    .join(" ");
}

function unique(items) {
  return [...new Set(items.filter(Boolean))];
}

function extractMeaningfulPhrases(text, limit = 6) {
  const matches = String(text || "")
    .split(/[.\n,;:()]/)
    .map((item) => item.trim())
    .filter((item) => item.length > 18 && item.length < 110);

  return unique(matches).slice(0, limit);
}

function extractKeywords(text, limit = 8) {
  const stopWords = new Set([
    "with",
    "from",
    "that",
    "this",
    "will",
    "have",
    "your",
    "about",
    "into",
    "their",
    "where",
    "while",
    "using",
    "build",
    "built",
    "work",
    "works",
    "team",
    "role",
  ]);

  const words = String(text || "")
    .toLowerCase()
    .split(/[^a-z0-9+#.-]+/)
    .filter((item) => item.length > 3 && !stopWords.has(item));

  return unique(words).slice(0, limit);
}

function pickFromArray(items, index) {
  if (!items.length) {
    return "";
  }

  return items[index % items.length];
}

function inferRoleLens(role) {
  const normalizedRole = normalizeText(role);

  if (normalizedRole.includes("frontend") || normalizedRole.includes("ui")) {
    return {
      deliverable: "a polished user-facing feature",
      collaboration: "design and backend partners",
      qualityAxis: "performance, accessibility, and maintainability",
    };
  }

  if (normalizedRole.includes("backend") || normalizedRole.includes("api")) {
    return {
      deliverable: "a reliable backend capability",
      collaboration: "frontend and platform engineers",
      qualityAxis: "reliability, observability, and clean service boundaries",
    };
  }

  if (normalizedRole.includes("data")) {
    return {
      deliverable: "an analysis or data pipeline improvement",
      collaboration: "stakeholders and engineering partners",
      qualityAxis: "correctness, interpretability, and operational trust",
    };
  }

  return {
    deliverable: "a high-impact project",
    collaboration: "cross-functional teammates",
    qualityAxis: "delivery quality, communication, and sound judgment",
  };
}

const QUESTION_BANK = {
  hr: [
    ({ role, company, roleLens }) =>
      `What convinced you to target ${role} roles, and why would ${company} be a strong next step for the kind of ${roleLens.deliverable} work you want to own?`,
    ({ role, company, jdTheme }) =>
      `If you joined ${company} as a ${role}, what would you want your first 60 to 90 days to look like, especially around ${jdTheme}?`,
    ({ role, company }) =>
      `What makes you stand out for this ${role} opportunity at ${company}, beyond matching the checklist on paper?`,
    ({ roleLens }) =>
      `What kind of environment helps you do your best work when expectations are high and you need to collaborate closely with ${roleLens.collaboration}?`,
  ],
  technical: [
    ({ role, primarySkill, roleLens, jdTheme }) =>
      `Imagine you are asked to ship ${roleLens.deliverable} as a ${role}. How would you scope the work, make technical tradeoffs around ${primarySkill}, and keep quality high for ${jdTheme}?`,
    ({ role, skillCluster }) =>
      `Tell me about a technically messy problem related to ${skillCluster}. How would you break it down, reduce risk, and decide what to solve first for a ${role}?`,
    ({ company, roleLens }) =>
      `Suppose you inherit a weak implementation shortly after joining ${company}. How would you evaluate architecture, delivery risk, and refactoring priorities while still moving ${roleLens.deliverable} forward?`,
    ({ role, primarySkill, skillsContext }) =>
      `How would you explain your decision-making process if you had two viable approaches for a ${role} problem involving ${primarySkill}, but each option affected ${skillsContext} differently?`,
  ],
  behavioral: [
    ({ roleLens }) =>
      `Tell me about a time you had to influence a decision related to ${roleLens.deliverable} without formal authority. What was your approach, and what changed because of it?`,
    ({ role, jdTheme }) =>
      `Describe a moment when your first plan for a ${role} responsibility did not work. How did you adapt, and what did you learn that would help you handle ${jdTheme} better next time?`,
    ({ roleLens }) =>
      `Give me an example of balancing speed and quality when collaborating with ${roleLens.collaboration}. How did you decide what was acceptable and what needed more rigor?`,
    ({ role }) =>
      `Tell me about a disagreement that affected delivery in a ${role} context. How did you handle it, and what would you repeat or change now?`,
  ],
};

const SAMPLE_ANSWER_FRAGMENTS = {
  entry: "show learning speed, self-awareness, and the ability to turn guidance into execution",
  junior: "connect direct execution to clear ownership, practical tradeoffs, and growth",
  mid: "demonstrate independent problem solving, prioritization, and strong collaboration habits",
  senior: "show judgment, leadership leverage, risk framing, and clear business awareness",
};

function buildQuestionCategories(interviewType, questionCount) {
  if (interviewType !== "mixed") {
    return Array.from({ length: questionCount }, () => interviewType);
  }

  const base = ["behavioral", "technical", "hr"];
  return Array.from({ length: questionCount }, (_, index) => base[index % base.length]);
}

function buildContext(setup) {
  const roleLens = inferRoleLens(setup.role);
  const primarySkill = setup.skills[0] || "your core stack";
  const skillsContext = setup.skills.slice(0, 3).join(", ") || "the main parts of the role";
  const skillCluster = skillsContext;
  const company = setup.companyName || "this team";
  const phrases = extractMeaningfulPhrases(setup.jobDescription, 6);
  const keywords = extractKeywords(`${setup.jobDescription} ${setup.cvText}`, 8);
  const jdTheme =
    phrases[0] ||
    (keywords.length ? keywords.slice(0, 3).join(", ") : `${titleCase(setup.difficulty)}-level execution`);

  return {
    role: setup.role,
    company,
    primarySkill,
    skillsContext,
    skillCluster,
    roleLens,
    jdTheme,
    phrases,
    keywords,
  };
}

function buildExpectedPoints({ setup, category, context }) {
  const expected = [
    `Anchor the answer in responsibilities that matter for a ${setup.role}.`,
    `Show judgment that feels appropriate for the ${setup.experienceLevel} level.`,
  ];

  if (category === "technical") {
    expected.push(`Explain tradeoffs around ${context.primarySkill} and delivery quality.`);
    expected.push("Make priorities, edge cases, and risk management explicit.");
  }

  if (category === "behavioral") {
    expected.push("Use a clear Situation, Task, Action, Result structure.");
    expected.push("Make your own contribution and the outcome easy to understand.");
  }

  if (category === "hr") {
    expected.push(`Show why this role is a deliberate fit, not just a generic application.`);
    expected.push(`Connect your motivation to the company's likely needs and team context.`);
  }

  if (setup.skills.length) {
    expected.push(`Reference relevant strengths in ${setup.skills.slice(0, 3).join(", ")} when useful.`);
  }

  if (setup.companyName) {
    expected.push(`Tie your answer back to how you would create value at ${setup.companyName}.`);
  }

  return expected.slice(0, 5);
}

function buildFocusAreas(setup, category, context) {
  return unique([
    setup.role,
    titleCase(category),
    titleCase(setup.difficulty),
    ...setup.skills.slice(0, 3),
    ...context.keywords.slice(0, 2),
  ]).slice(0, 6);
}

function buildDifficultyNote(setup, category) {
  const levelLabel = `${titleCase(setup.difficulty)} ${category}`;
  const seniorityNote =
    setup.experienceLevel === "senior"
      ? "expects strategic judgment and team-level thinking"
      : setup.experienceLevel === "mid"
        ? "expects independent execution and tradeoff awareness"
        : "expects strong fundamentals and clear reasoning";

  return `${levelLabel} round that ${seniorityNote}.`;
}

export function generateFallbackQuestions(setup) {
  const categories = buildQuestionCategories(setup.interviewType, setup.questionCount);
  const context = buildContext(setup);

  return categories.map((category, index) => {
    const template = pickFromArray(QUESTION_BANK[category], index);

    return {
      id: `question-${index + 1}`,
      index,
      category,
      prompt: template({
        ...context,
        role: setup.role,
      }),
      focusAreas: buildFocusAreas(setup, category, context),
      expectedPoints: buildExpectedPoints({ setup, category, context }),
      difficultyNote: buildDifficultyNote(setup, category),
    };
  });
}

function countKeywordHits(answer, expectedPoints) {
  const normalizedAnswer = normalizeText(answer);
  const keywords = expectedPoints
    .flatMap((point) => normalizeText(point).split(/[^a-z0-9+#]+/))
    .filter((word) => word.length > 4);

  const uniqueKeywords = [...new Set(keywords)];
  return uniqueKeywords.reduce(
    (count, keyword) => count + (normalizedAnswer.includes(keyword) ? 1 : 0),
    0
  );
}

function detectStarSignals(answer) {
  const normalizedAnswer = normalizeText(answer);
  return ["situation", "task", "action", "result"].reduce(
    (count, word) => count + (normalizedAnswer.includes(word) ? 1 : 0),
    0
  );
}

function detectMetricSignals(answer) {
  return (String(answer || "").match(/\b\d+[%x]?\b/g) || []).length;
}

function detectTradeoffSignals(answer) {
  const normalized = normalizeText(answer);
  return ["tradeoff", "because", "risk", "priority", "constraint", "decided"].reduce(
    (count, word) => count + (normalized.includes(word) ? 1 : 0),
    0
  );
}

function buildSampleAnswer(question, setup) {
  const opener =
    question.category === "behavioral"
      ? "Open with the situation and the specific responsibility you owned."
      : "Open with your direct answer or recommendation in one sentence.";

  return [
    opener,
    `Then ${SAMPLE_ANSWER_FRAGMENTS[setup.experienceLevel]}.`,
    `Make sure you explicitly cover ${question.expectedPoints.slice(0, 3).join(", ")}.`,
    setup.companyName
      ? `Close by connecting the example to what ${setup.companyName} would likely expect from this role.`
      : "Close by linking your example to business impact, team impact, or delivery quality.",
  ].join(" ");
}

export function generateFallbackFeedback(session, answerEntry) {
  const answer = answerEntry.answer || "";
  const wordCount = answer.trim() ? answer.trim().split(/\s+/).length : 0;
  const keywordHits = countKeywordHits(answer, answerEntry.expectedPoints || []);
  const starSignals = detectStarSignals(answer);
  const metricSignals = detectMetricSignals(answer);
  const tradeoffSignals = detectTradeoffSignals(answer);
  const skippedPenalty = answerEntry.skipped ? 40 : 0;

  const overallScore = Math.max(
    24,
    Math.min(
      97,
      34 +
        Math.min(wordCount, 230) * 0.16 +
        keywordHits * 6 +
        starSignals * 4 +
        metricSignals * 2 +
        tradeoffSignals * 3 -
        skippedPenalty
    )
  );

  const clarityScore = Math.max(
    26,
    Math.min(96, overallScore + (wordCount > 65 ? 3 : -6) + (tradeoffSignals ? 2 : 0))
  );
  const structureScore = Math.max(
    22,
    Math.min(96, overallScore + starSignals * 6 + (wordCount < 45 ? -8 : 0))
  );
  const confidenceScore = Math.max(
    22,
    Math.min(
      95,
      overallScore + (normalizeText(answer).includes("i led") ? 4 : 0) + metricSignals * 2 - (answerEntry.skipped ? 10 : 0)
    )
  );

  const missedPoints = (answerEntry.expectedPoints || []).filter((point) => {
    const keywords = normalizeText(point).split(/[^a-z0-9+#]+/).filter((word) => word.length > 4);
    return !keywords.some((keyword) => normalizeText(answer).includes(keyword));
  });

  const strengths = [];

  if (wordCount >= 90) {
    strengths.push("You gave enough detail to show depth instead of staying at a generic summary level.");
  }

  if (tradeoffSignals >= 2) {
    strengths.push("You showed decision-making logic rather than only listing actions, which makes the answer feel more senior.");
  }

  if (metricSignals >= 1) {
    strengths.push("Concrete numbers or measurable outcomes made the answer more credible.");
  }

  if (starSignals >= 2 && answerEntry.category === "behavioral") {
    strengths.push("The answer has visible story structure, so your contribution and outcome are easier to follow.");
  }

  if (!strengths.length) {
    strengths.push("You stayed on the actual interviewer prompt instead of drifting into unrelated background.");
  }

  const weaknesses = [];

  if (wordCount < 60) {
    weaknesses.push("The answer is still too short to prove ownership, depth, or strong judgment.");
  }

  if (keywordHits < 2) {
    weaknesses.push("Important evaluation points were only implied, so the interviewer would need to infer too much.");
  }

  if (tradeoffSignals < 1 && answerEntry.category !== "hr") {
    weaknesses.push("You describe actions, but not enough of the reasoning behind your choices and priorities.");
  }

  if (starSignals < 2 && answerEntry.category === "behavioral") {
    weaknesses.push("The story arc is weak, so the impact and your specific contribution do not land clearly.");
  }

  if (metricSignals < 1 && answerEntry.category !== "hr") {
    weaknesses.push("There is not enough evidence, scale, or measurable outcome to make the answer memorable.");
  }

  if (!weaknesses.length) {
    weaknesses.push("The answer is solid overall, but it would still benefit from sharper specificity and a stronger closing takeaway.");
  }

  return {
    overallScore: Math.round(overallScore),
    confidenceScore: Math.round(confidenceScore),
    clarityScore: Math.round(clarityScore),
    structureScore: Math.round(structureScore),
    strengths,
    weaknesses,
    missedPoints: missedPoints.length
      ? missedPoints.slice(0, 4)
      : ["Add one more concrete detail, outcome, or tradeoff so the answer sounds more complete and convincing."],
    sampleAnswer: buildSampleAnswer(answerEntry, session.setup),
    coachingTips: [
      `Lead faster with your main answer and keep it anchored to what matters in a ${session.setup.role} interview.`,
      "Use one concrete example, one clear result, and one sentence explaining why you chose that approach.",
      answerEntry.category === "behavioral"
        ? "Tighten the story into Situation, Task, Action, Result instead of blending everything together."
        : "State the tradeoffs and priorities explicitly so the interviewer can hear how you think.",
    ],
    roleSpecificSuggestions: [
      `Make it easier to hear why you are ready for ${session.setup.experienceLevel}-level expectations in this role.`,
      session.setup.skills.length
        ? `Reference ${session.setup.skills.slice(0, 2).join(" and ")} more directly when they are part of the story.`
        : `Tie your examples more directly to the day-to-day responsibilities of a ${session.setup.role}.`,
    ],
  };
}

export function generateFallbackSummary(session) {
  const completedAnswers = session.answers.filter((entry) => entry.feedback && !entry.skipped);
  const averageScore = completedAnswers.length
    ? Math.round(
        completedAnswers.reduce((sum, entry) => sum + entry.feedback.overallScore, 0) /
          completedAnswers.length
      )
    : 0;
  const answeredCount = session.answers.filter((entry) => entry.answer || entry.skipped).length;
  const completionRate = Math.round((answeredCount / session.questions.length) * 100);
  const sortedByScore = [...completedAnswers].sort(
    (left, right) => right.feedback.overallScore - left.feedback.overallScore
  );
  const bestAnswer = sortedByScore[0] || null;
  const weakestAnswer = sortedByScore[sortedByScore.length - 1] || null;
  const topImprovementAreas = [
    ...new Set(session.answers.flatMap((entry) => entry.feedback?.weaknesses || [])),
  ].slice(0, 4);

  return {
    overallScore: averageScore,
    completionRate,
    bestAnswerId: bestAnswer?.questionId || null,
    weakestAnswerId: weakestAnswer?.questionId || null,
    topImprovementAreas: topImprovementAreas.length
      ? topImprovementAreas
      : ["Increase specificity, structure, and role alignment across your answers."],
    nextPracticeFocus: [
      "Open faster with a direct answer before adding context.",
      "Use more evidence: metrics, scale, ownership, and outcomes.",
      session.setup.interviewType === "technical"
        ? "Practice talking through tradeoffs and priorities in a more structured way."
        : "Practice turning broad stories into tighter, evidence-backed examples.",
    ],
    overallStrengths: [
      "You worked through a full interview flow with question-by-question feedback instead of isolated prompts.",
      "Your stronger answers already contain material that can be sharpened into interview-ready stories.",
    ],
    overallWeaknesses: [
      "Some answers still rely on broad claims instead of explicit proof, metrics, or tradeoff reasoning.",
      "A more deliberate structure would make your strongest points land faster and more clearly.",
    ],
    interviewerSummary: `This ${session.setup.interviewType} session for ${session.setup.role} currently reads as roughly ${averageScore || 0}/100. The biggest improvement path is not adding more words, but making your answers more explicit, evidence-backed, and better structured for how interviewers actually listen.`,
  };
}

export function generateFallbackCoachReply(session, message) {
  const normalizedMessage = normalizeText(message);
  const answerMatch = normalizedMessage.match(/answer\s+(\d+)/);
  const answerIndex = answerMatch ? Math.max(0, Number(answerMatch[1]) - 1) : null;
  const answerEntry =
    answerIndex !== null ? session.answers.find((entry) => entry.index === answerIndex) : null;

  if (normalizedMessage.includes("harder follow-up")) {
    const question = answerEntry || session.answers.find((entry) => entry.answer);
    return [
      `Harder follow-up: ${question?.questionPrompt || "Your initial recommendation sounds reasonable, but what would you do if the team challenged the cost, scope, or timeline assumptions behind it?"}`,
      "",
      "What a stronger answer should include:",
      "- Your decision framework and the tradeoffs you would surface first.",
      "- How you would adapt if the constraints changed.",
      "- How you would keep quality and momentum while handling pushback.",
    ].join("\n");
  }

  if (normalizedMessage.includes("stronger") || normalizedMessage.includes("improve")) {
    const target = answerEntry || session.answers.find((entry) => entry.answer);

    if (target) {
      return [
        `For question ${target.index + 1}, the main upgrade is making your answer more explicit about ${target.expectedPoints
          .slice(0, 2)
          .join(" and ")}.`,
        "",
        `Stronger answer direction: ${buildSampleAnswer(target, session.setup)}`,
        "",
        "Rewrite checklist:",
        "- Start with your direct answer immediately.",
        "- Add one concrete example with ownership, decision-making, and result.",
        "- End by linking the example back to what this role actually needs.",
      ].join("\n");
    }
  }

  return [
    `For ${session.setup.role}, the next gains will come from sharper structure and more explicit proof of impact, not just longer answers.`,
    "",
    "Coach focus:",
    "- Answer the prompt faster in your opening line.",
    "- Make your ownership obvious instead of implied.",
    "- Add one metric, outcome, or tradeoff to each meaningful example.",
    "",
    `Your prompt was: "${message}"`,
    "The live AI provider was unavailable, so this coaching reply was generated from the interview context already stored on the backend.",
  ].join("\n");
}

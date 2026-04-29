function clipText(value, maxLength = 5000) {
  if (typeof value !== "string") {
    return "";
  }

  const normalized = value.trim();
  return normalized.length > maxLength
    ? `${normalized.slice(0, maxLength)}\n...[truncated]`
    : normalized;
}

function formatList(items = []) {
  return Array.isArray(items) && items.length ? items.join(", ") : "Not provided";
}

function createSessionContext(session) {
  const { setup, questions = [], answers = [], status } = session;

  return [
    "INTERVIEW SETUP",
    `Role: ${setup.role}`,
    `Experience level: ${setup.experienceLevel}`,
    `Interview type: ${setup.interviewType}`,
    `Difficulty: ${setup.difficulty}`,
    `Company: ${setup.companyName || "Not provided"}`,
    `Skills: ${formatList(setup.skills)}`,
    `Question count: ${setup.questionCount}`,
    `Job description: ${clipText(setup.jobDescription || "Not provided", 1800)}`,
    `CV text: ${clipText(setup.cvText || "Not provided", 2200)}`,
    "",
    "QUESTIONS",
    questions
      .map(
        (question, index) =>
          `${index + 1}. [${question.category}] ${question.prompt}\nExpected points: ${formatList(
            question.expectedPoints
          )}`
      )
      .join("\n\n"),
    "",
    "CURRENT ANSWERS",
    answers.length
      ? answers
          .map(
            (entry) =>
              `Q${entry.index + 1}: ${entry.questionPrompt}\nAnswer: ${clipText(
                entry.answer || (entry.skipped ? "Skipped" : "No answer"),
                1800
              )}`
          )
          .join("\n\n")
      : "No answers yet.",
    "",
    `Session status: ${status}`,
  ].join("\n");
}

export function buildInterviewQuestionsPrompt(setup) {
  return {
    instructions: [
      "You are an expert interview designer for a premium AI career platform.",
      "Create realistic, role-specific interview questions that sound like a strong human interviewer running an actual hiring loop.",
      "Return strict JSON only with this shape:",
      '{"questions":[{"category":"technical","prompt":"...","focusAreas":["..."],"expectedPoints":["..."],"difficultyNote":"..."}]}',
      "Generate exactly the requested number of questions.",
      "Tailor questions to role, level, interview type, company, skills, job description, and CV text when provided.",
      "Avoid generic filler and avoid vague prompts such as 'tell me about yourself' unless the setup clearly calls for it.",
      "Questions should feel useful for real practice, with enough context and tension to trigger a thoughtful answer.",
      "Expected points should reflect what a strong interviewer would actually listen for.",
    ].join(" "),
    input: [
      {
        role: "user",
        content: [
          {
            type: "input_text",
            text: [
              `Role: ${setup.role}`,
              `Experience level: ${setup.experienceLevel}`,
              `Interview type: ${setup.interviewType}`,
              `Difficulty: ${setup.difficulty}`,
              `Question count: ${setup.questionCount}`,
              `Company: ${setup.companyName || "Not provided"}`,
              `Skills: ${formatList(setup.skills)}`,
              `Job description: ${clipText(setup.jobDescription || "Not provided", 2500)}`,
              `CV text: ${clipText(setup.cvText || "Not provided", 2500)}`,
            ].join("\n"),
          },
        ],
      },
    ],
  };
}

export function buildAnswerFeedbackPrompt(session, answerEntry) {
  return {
    instructions: [
      "You are a rigorous interview evaluator for a premium mock interview product.",
      "Return strict JSON only using this shape:",
      '{"overallScore":82,"confidenceScore":80,"clarityScore":78,"structureScore":85,"strengths":["..."],"weaknesses":["..."],"missedPoints":["..."],"sampleAnswer":"...","coachingTips":["..."],"roleSpecificSuggestions":["..."]}',
      "Score fairly based on the question difficulty, expected points, and candidate seniority.",
      "Make the feedback specific, concrete, and actionable. Do not invent experience not present in the answer.",
      "Prefer feedback that explains exactly why the answer landed well or weakly instead of generic praise or generic criticism.",
      "If the answer lacks detail, say what is missing and what kind of detail would improve it.",
    ].join(" "),
    input: [
      {
        role: "user",
        content: [
          {
            type: "input_text",
            text: [
              createSessionContext(session),
              "",
              "QUESTION TO EVALUATE",
              `Prompt: ${answerEntry.questionPrompt}`,
              `Category: ${answerEntry.category}`,
              `Expected points: ${formatList(answerEntry.expectedPoints)}`,
              `Candidate answer: ${clipText(answerEntry.answer || "Skipped", 4000)}`,
            ].join("\n"),
          },
        ],
      },
    ],
  };
}

export function buildInterviewSummaryPrompt(session) {
  return {
    instructions: [
      "You are generating the final summary dashboard for a premium mock interview tool.",
      "Return strict JSON only using this shape:",
      '{"overallScore":84,"completionRate":100,"bestAnswerId":"...","weakestAnswerId":"...","topImprovementAreas":["..."],"nextPracticeFocus":["..."],"overallStrengths":["..."],"overallWeaknesses":["..."],"interviewerSummary":"..."}',
      "Use the answer feedback already available in the session and keep the analysis concrete.",
      "The interviewerSummary should read like a concise but insightful debrief from a strong coach, not a generic recap.",
    ].join(" "),
    input: [
      {
        role: "user",
        content: [
          {
            type: "input_text",
            text: createSessionContext(session),
          },
        ],
      },
    ],
  };
}

export function buildInterviewCoachPrompt(session, message) {
  return {
    instructions: [
      "You are an interview coach embedded inside a mock interview platform.",
      "Use the interview setup, questions, answers, and feedback as the source of truth.",
      "Answer directly, specifically, and practically.",
      "If the user asks for a stronger answer, provide one.",
      "If they ask for a harder follow-up, ask exactly one sharper follow-up question first, then explain what a good answer should include.",
      "Keep formatting compact and useful.",
      "Avoid bland coaching language. Make the advice sound like an experienced interviewer helping the candidate level up quickly.",
    ].join(" "),
    input: [
      {
        role: "user",
        content: [
          {
            type: "input_text",
            text: `${createSessionContext(session)}\n\nUser request: ${clipText(message, 2000)}`,
          },
        ],
      },
    ],
  };
}

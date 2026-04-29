import {
  dedupeSkills,
  formatSkill,
  normalizeSkill,
  normalizeText,
  skillMatchesText,
} from "./normalizeSkills";

function getProfileSignals(cvText = "") {
  const lowered = cvText.toLowerCase();

  return {
    hasQuantifiedImpact: /\b\d+[%+]?/.test(lowered),
    mentionsProjects: /(project|built|developed|launched|shipped|implemented|created)/.test(lowered),
    mentionsDesign: /(design|figma|ux|ui)/.test(lowered),
    mentionsBackend: /(node|express|api|database|mongodb|sql|auth)/.test(lowered),
    mentionsTesting: /(test|jest|vitest|cypress|playwright|qa)/.test(lowered),
    mentionsLeadership: /(led|owned|mentored|architected|drove|managed)/.test(lowered),
    mentionsCollaboration: /(team|collaborated|cross-functional|stakeholder|designer|product)/.test(lowered),
  };
}

function uniqueList(items = []) {
  return [...new Set(items.filter(Boolean))];
}

function uniqueSkills(skills = []) {
  return dedupeSkills(skills).map((skill) => formatSkill(skill));
}

function takeTop(items = [], limit = 4) {
  return uniqueList(items).slice(0, limit);
}

function resolveJobAnalysis(job, analyzedCvData) {
  if (!analyzedCvData) {
    return null;
  }

  if (Array.isArray(analyzedCvData.rankedJobs)) {
    return analyzedCvData.rankedJobs.find((item) => String(item.id) === String(job.id)) || null;
  }

  if (String(analyzedCvData.id) === String(job.id)) {
    return analyzedCvData;
  }

  return null;
}

function buildGeneralScore(job) {
  const requirementCount = Array.isArray(job.requirements) ? job.requirements.length : 0;
  return Math.max(32, 54 - requirementCount * 2);
}

export function getSkillSuggestions(skill, context = {}) {
  const normalized = normalizeSkill(skill);
  const label = formatSkill(skill);
  const title = context.jobTitle || "this role";

  switch (normalized) {
    case "typescript":
      return {
        quickWins: `If you have used ${label} informally, mention it explicitly in a project bullet instead of leaving it implied through React work.`,
        cv: `Add one bullet that shows typed props, interfaces, or safer API models using ${label}.`,
        learn: `Learn ${label} basics first: types, interfaces, generics, and typing API responses in React.`,
        portfolio: `Build a small ${label} project for ${title} with typed components, API calls, and clear folder structure.`,
        interview: `Be ready to explain why ${label} improves maintainability, refactoring safety, and developer experience.`,
      };
    case "testing":
      return {
        quickWins: "Add any evidence of unit, integration, or UI testing you have already done, even if it was limited to a few important flows.",
        cv: "Rewrite one experience bullet to mention what you tested, which tool you used, and why it mattered for release confidence.",
        learn: "Practice Jest, React Testing Library, or API testing basics so you can discuss coverage, assertions, and edge cases.",
        portfolio: "Add tests to one existing project and document the key scenarios you covered, such as form validation or API error states.",
        interview: "Prepare examples of how you decide what to test first and how you debug failing test cases.",
      };
    case "react":
      return {
        quickWins: "Bring your strongest component-driven project closer to the top of the CV and mention reusable UI work explicitly.",
        cv: "Use bullets that show component architecture, state handling, and real feature delivery instead of only listing React in the skills section.",
        learn: "Strengthen hooks, component composition, async state patterns, and performance basics.",
        portfolio: "Ship a polished React project with reusable components, loading states, and deployment links.",
        interview: "Expect questions about component structure, props vs state, side effects, and how you break down larger UI problems.",
      };
    case "rest api":
      return {
        quickWins: "Mention API integration, loading states, error handling, and how data moved through the feature.",
        cv: "Turn generic frontend bullets into API-driven bullets that describe fetching, rendering, and user outcomes.",
        learn: "Practice REST fundamentals, async requests, status codes, pagination, and handling failed requests cleanly.",
        portfolio: "Add a project that consumes a real API and clearly shows loading, empty, success, and error states.",
        interview: "Be ready to explain how you fetch data, manage errors, and keep UI state reliable when APIs fail.",
      };
    case "tailwind":
      return {
        quickWins: "Call out Tailwind directly if you used utility-first styling instead of burying it under generic CSS wording.",
        cv: "Describe how you used Tailwind for responsive layouts, design consistency, or faster UI implementation.",
        learn: "Improve layout systems, component styling patterns, and maintainable design token usage with Tailwind.",
        portfolio: "Show one visually polished interface with responsive behavior and reusable UI patterns.",
        interview: "Prepare to discuss when utility-first CSS is helpful and how you keep large UI codebases maintainable.",
      };
    case "responsive design":
      return {
        quickWins: "Highlight mobile-first work, breakpoints, and layout decisions instead of saying only that the UI was responsive.",
        cv: "Add a bullet describing how you adapted pages for mobile, tablet, and desktop behavior.",
        learn: "Review responsive layout systems, fluid sizing, breakpoint strategy, and content prioritization.",
        portfolio: "Capture one project that clearly demonstrates desktop and mobile views with thoughtful interaction details.",
        interview: "Expect to explain how you choose breakpoints and debug layout issues across screen sizes.",
      };
    case "accessibility":
      return {
        quickWins: "If you improved keyboard navigation, labels, or semantic HTML anywhere, surface it in a bullet now.",
        cv: "Mention accessible forms, semantic markup, focus handling, or WCAG-minded implementation in a relevant project.",
        learn: "Study semantic HTML, keyboard navigation, ARIA basics, color contrast, and accessible forms.",
        portfolio: "Audit one project for accessibility and document the improvements you made.",
        interview: "Prepare to explain how you approach accessible components and validate usability for keyboard and screen-reader users.",
      };
    case "performance":
      return {
        quickWins: "Quantify any speed, rendering, or load-time improvement already present in your work history.",
        cv: "Rewrite one bullet to show how you reduced load time, improved rendering, or optimized bundle-heavy UI work.",
        learn: "Study profiling, lazy loading, memoization tradeoffs, and frontend performance metrics.",
        portfolio: "Add a short case study showing a before-and-after performance improvement.",
        interview: "Be ready to discuss how you identify bottlenecks and what tradeoffs you consider before optimizing.",
      };
    case "nodejs":
      return {
        quickWins: "Mention any backend scripts, APIs, or server-side tooling you built with Node.js, even if the project was small.",
        cv: "Describe request handling, backend logic, or data processing rather than listing Node.js without context.",
        learn: "Strengthen Express, middleware, async flows, environment config, and server debugging.",
        portfolio: "Build a small Node.js API with validation, error handling, and a clear README.",
        interview: "Expect questions on async operations, API structure, middleware, and backend debugging decisions.",
      };
    case "express":
      return {
        quickWins: "Reference routes, middleware, or controller structure if you have built API endpoints before.",
        cv: "Add a backend bullet that explains what endpoints you created and how they supported a real feature.",
        learn: "Practice routing, middleware, validation, auth basics, and structured error handling in Express.",
        portfolio: "Create an Express service with CRUD endpoints, validation, and clean project organization.",
        interview: "Prepare to discuss route design, middleware purpose, and how you keep server logic maintainable.",
      };
    case "mongodb":
      return {
        quickWins: "Call out schema design, collections, or CRUD operations if you used MongoDB in any project.",
        cv: "Describe how data was stored, queried, or modeled rather than listing MongoDB as a standalone keyword.",
        learn: "Practice schema modeling, indexing basics, query patterns, and integration with backend services.",
        portfolio: "Extend a project with MongoDB-backed persistence and document the data model.",
        interview: "Expect questions about when you would use MongoDB, how you structure data, and how APIs interact with it.",
      };
    case "sql":
      return {
        quickWins: "Mention joins, filtering, dashboards, or reporting work if your projects touched relational data at all.",
        cv: "Add one bullet showing how you queried or analyzed structured data with SQL.",
        learn: "Study SELECTs, joins, aggregation, subqueries, and basic schema reasoning.",
        portfolio: "Create a mini analytics or reporting project that uses SQL queries and explains the insights generated.",
        interview: "Be ready for questions on joins, grouping, query logic, and how you troubleshoot incorrect results.",
      };
    case "git":
      return {
        quickWins: "Replace generic collaboration wording with direct evidence of Git, pull requests, branches, or version control workflows.",
        cv: "Mention Git or GitHub in project bullets where teamwork, review, or release coordination mattered.",
        learn: "Get comfortable with branching, pull requests, rebasing basics, and resolving simple merge conflicts.",
        portfolio: "Keep a clean public project history that shows iterative delivery and documentation updates.",
        interview: "Prepare examples of how you collaborate through Git, review changes, and recover from mistakes safely.",
      };
    default:
      return {
        quickWins: `If you have used ${label} anywhere, surface it directly in your CV instead of leaving it hidden inside a broad project description.`,
        cv: `Add a bullet that shows ${label} in action with the task you handled and the result it supported.`,
        learn: `Spend focused time learning the fundamentals of ${label} and practice it in a small job-relevant exercise.`,
        portfolio: `Create or update one project that demonstrates ${label} clearly for ${title}.`,
        interview: `Prepare to explain what you built with ${label}, the tradeoffs you faced, and what you would improve next.`,
      };
  }
}

export function getCategorySuggestions(category = "") {
  const normalized = normalizeSkill(category);

  switch (normalized) {
    case "frontend":
    case "ui engineering":
    case "web development":
      return {
        quickWins: [
          "Highlight responsive UI work, reusable components, and how you handled API-driven states.",
          "Show stronger design collaboration if your CV already mentions Figma, UX, or close product feedback loops.",
        ],
        cv: [
          "Push frontend keywords like React, accessibility, Tailwind, and responsive design into the summary and latest experience.",
          "Rewrite project bullets to explain user-facing features, not only the technologies used.",
        ],
        learn: [
          "Prioritize component architecture, accessibility, browser debugging, and polished UI states.",
          "Practice explaining tradeoffs between speed of delivery, maintainability, and user experience.",
        ],
        portfolio: [
          "Include a multi-section product UI with loading, error, empty, and success states.",
          "Add a case study showing responsive layouts and component reuse across several pages.",
        ],
        interview: [
          "Prepare to explain component design, state management, API fetching, and responsive decisions.",
          "Expect debugging questions around layout issues, stale UI state, and user interaction edge cases.",
        ],
      };
    case "backend":
      return {
        quickWins: [
          "Surface any API, server logic, auth, or database work before generic frontend tasks.",
          "Show problem-solving and debugging experience tied to backend reliability.",
        ],
        cv: [
          "Use bullets that describe endpoints, validation, database access, or service logic clearly.",
          "Mention Git collaboration and measurable backend outcomes such as performance or stability improvements.",
        ],
        learn: [
          "Prioritize API design, databases, auth, structured errors, and debugging server flows.",
          "Practice thinking through request lifecycle, data models, and failure handling.",
        ],
        portfolio: [
          "Build a backend service with CRUD endpoints, validation, and a documented database schema.",
          "Add a project that combines authentication, persistence, and deployment basics.",
        ],
        interview: [
          "Prepare to discuss API design, middleware, database choices, and debugging techniques.",
          "Be ready to explain how you protect routes, validate input, and structure backend code.",
        ],
      };
    case "full stack":
    case "software engineering":
      return {
        quickWins: [
          "Show that you can move between UI delivery and backend logic instead of appearing only frontend-heavy.",
          "Use one project to prove end-to-end ownership from interface to API or data layer.",
        ],
        cv: [
          "Balance frontend and backend evidence across your latest projects instead of clustering one side only.",
          "Mention measurable outcomes, cross-functional work, and delivery ownership clearly.",
        ],
        learn: [
          "Strengthen system thinking, API integration, debugging across the stack, and pragmatic architecture choices.",
          "Practice explaining how frontend and backend decisions affect each other.",
        ],
        portfolio: [
          "Show one complete product-style project with frontend, API, persistence, and deployment.",
          "Document architecture decisions briefly so reviewers can see your reasoning.",
        ],
        interview: [
          "Prepare to explain how data flows from UI to backend and how you debug issues across layers.",
          "Expect questions on tradeoffs, ownership, and how you prioritize improvements in a product feature.",
        ],
      };
    case "data":
      return {
        quickWins: [
          "Push SQL, Python, dashboards, or analysis work higher in the CV if those skills exist at all.",
          "Use metrics and business outcomes wherever possible because data roles reward evidence of impact.",
        ],
        cv: [
          "Describe the dataset, the analysis performed, and the decision or insight produced.",
          "Mention dashboards, reporting, automation, and communication of findings to non-technical audiences.",
        ],
        learn: [
          "Focus on SQL, Python analysis, data cleaning, and visual storytelling.",
          "Practice explaining your analysis process clearly from raw data to recommendation.",
        ],
        portfolio: [
          "Build a dashboard or analysis case study using a public dataset.",
          "Document the question, the method, and the key insight rather than only sharing charts.",
        ],
        interview: [
          "Expect SQL questions, analysis reasoning, and communication-focused prompts.",
          "Be ready to explain assumptions, data quality checks, and how you validate results.",
        ],
      };
    default:
      return {
        quickWins: ["Mirror the role language more closely and surface the most relevant project evidence first."],
        cv: ["Tailor your summary and project bullets so they read like proof for this specific role."],
        learn: ["Focus on the core stack first, then add adjacent workflow or collaboration skills."],
        portfolio: ["Include one role-relevant project that makes your strongest capabilities obvious within a minute."],
        interview: ["Prepare concise stories about your projects, tradeoffs, and debugging approach."],
      };
  }
}

export function getLevelSuggestions(level = "") {
  const lowered = String(level).toLowerCase();

  if (lowered.includes("intern")) {
    return {
      quickWins: [
        "Lean on coursework, hackathons, internships, and personal projects if formal experience is still limited.",
      ],
      cv: [
        "Keep bullets practical and concrete: what you built, with which tools, and what you learned or improved.",
      ],
      learn: [
        "Strengthen fundamentals, debugging habits, and collaboration basics before chasing advanced tooling.",
      ],
      portfolio: [
        "A polished project with a clear README matters more here than a large but unfinished codebase.",
      ],
      interview: [
        "Expect questions on fundamentals, learning ability, and how you approach unfamiliar problems.",
      ],
    };
  }

  if (lowered.includes("junior")) {
    return {
      quickWins: [
        "Use projects and internships to prove readiness quickly, especially when professional experience is still short.",
      ],
      cv: [
        "Emphasize fundamentals, execution quality, and proof that you can contribute without heavy hand-holding.",
      ],
      learn: [
        "Focus on fundamentals, debugging, communication, and shipping complete features end to end.",
      ],
      portfolio: [
        "Show two or three complete projects rather than many shallow experiments.",
      ],
      interview: [
        "Be ready to explain your reasoning clearly even when the project scope was small.",
      ],
    };
  }

  if (lowered.includes("mid")) {
    return {
      quickWins: [
        "Add ownership language showing features you drove, decisions you made, and the impact of your work.",
      ],
      cv: [
        "Quantify delivery impact and show that you can own quality, maintainability, and team collaboration.",
      ],
      learn: [
        "Practice system tradeoffs, stakeholder communication, and technical decision-making beyond implementation alone.",
      ],
      portfolio: [
        "One case study explaining architecture and tradeoffs is more valuable than several generic project cards.",
      ],
      interview: [
        "Expect deeper questions about tradeoffs, ownership, and why you chose a particular technical approach.",
      ],
    };
  }

  return {
    quickWins: ["Show the strongest proof of delivery, ownership, and impact that your background can support honestly."],
    cv: ["Tailor the CV to the level of responsibility expected in the role."],
    learn: ["Close role-critical gaps first, then strengthen broader engineering judgment."],
    portfolio: ["Use portfolio work to make capability and ownership easy to verify."],
    interview: ["Prepare stories that match the level of responsibility in the job description."],
  };
}

function buildStrengths(job, matchedSkills, extractedSkills, signals) {
  const strengths = [];

  if (matchedSkills.length > 0) {
    strengths.push(
      `Your CV already overlaps with ${matchedSkills.slice(0, 4).join(", ")}, which gives you a credible base for ${job.title}.`
    );
  }

  if (signals.mentionsProjects) {
    strengths.push("You already describe hands-on project work, which makes it easier to tailor your experience into job-ready proof.");
  }

  if (signals.hasQuantifiedImpact) {
    strengths.push("You include measurable outcomes, which recruiters read as stronger evidence than tool lists alone.");
  }

  if (signals.mentionsDesign && ["frontend", "ui engineering", "web development"].includes(normalizeSkill(job.category))) {
    strengths.push("Your CV hints at design-aware delivery, which is especially useful for user-facing product roles.");
  }

  if (signals.mentionsBackend && ["backend", "full stack", "software engineering"].includes(normalizeSkill(job.category))) {
    strengths.push("There is already some backend signal in your CV, so you can position yourself as more than a single-layer contributor.");
  }

  if (signals.mentionsCollaboration) {
    strengths.push("Collaboration language is present, which helps the profile feel more realistic and team-ready.");
  }

  if (strengths.length === 0 && extractedSkills.length > 0) {
    strengths.push(`Your CV still gives you a usable starting point through detected skills such as ${extractedSkills.slice(0, 4).join(", ")}.`);
  }

  return takeTop(strengths, 4);
}

function buildWeakAreas(job, missingSkills, coreSkills, signals, hasPersonalizedData) {
  const weakAreas = [];

  if (missingSkills.length > 0) {
    weakAreas.push(
      `The clearest skill gaps for this role are ${missingSkills.slice(0, 4).join(", ")}${missingSkills.length > 4 ? ", and other supporting skills" : ""}.`
    );
  }

  const missingCore = coreSkills.filter((skill) => missingSkills.includes(skill));
  if (missingCore.length > 0) {
    weakAreas.push(`You are missing core signals around ${missingCore.join(", ")}, which are likely to matter early in screening.`);
  }

  if (!signals.hasQuantifiedImpact) {
    weakAreas.push("Your CV would be stronger with measurable outcomes, not just task descriptions.");
  }

  if (!signals.mentionsProjects) {
    weakAreas.push("The CV needs clearer project evidence so recruiters can connect your skills to actual delivery.");
  }

  if (!signals.mentionsTesting && (missingSkills.includes("Testing") || coreSkills.includes("Testing"))) {
    weakAreas.push("Testing depth is not visible yet, so this role may look riskier until you add explicit proof.");
  }

  if (!signals.mentionsLeadership && String(job.level).toLowerCase().includes("mid")) {
    weakAreas.push("For a mid-level role, the profile needs more ownership language around decisions, delivery, or scope.");
  }

  if (!hasPersonalizedData) {
    weakAreas.push("These gaps are inferred from the role requirements because your CV has not been analyzed yet.");
  }

  return takeTop(weakAreas, 4);
}

function buildSampleBullets(category, matchedSkills, focusSkills) {
  const categoryKey = normalizeSkill(category);
  const primary = focusSkills[0] || matchedSkills[0] || "React";
  const secondary = focusSkills[1] || matchedSkills[1] || "REST APIs";

  if (["frontend", "ui engineering", "web development"].includes(categoryKey)) {
    return [
      `Built responsive ${matchedSkills.includes("React") ? "React" : "frontend"} interfaces with reusable components, ${primary}, and polished user flows across multiple pages.`,
      `Integrated ${secondary} with loading, empty, and error states while improving usability and consistency in production-facing UI.`,
      `Collaborated through Git and design feedback loops to ship accessible, maintainable interface updates with clear product impact.`,
    ];
  }

  if (categoryKey === "backend") {
    return [
      `Built backend services with ${primary} and structured API endpoints to support product features and reliable data flows.`,
      `Implemented validation, error handling, and ${secondary} integration to improve service stability and developer maintainability.`,
      `Collaborated through Git-based workflows to deliver server-side improvements, fix bugs, and support production debugging.`,
    ];
  }

  if (["full stack", "software engineering"].includes(categoryKey)) {
    return [
      `Built end-to-end product features across the UI and backend using ${primary}, ${secondary}, and pragmatic debugging across layers.`,
      `Connected frontend flows to API-backed services, improving feature completeness, usability, and delivery speed.`,
      `Collaborated in Git-based workflows to ship production-ready changes and refine features through iterative feedback.`,
    ];
  }

  if (categoryKey === "data") {
    return [
      `Used ${primary} to analyze structured data, surface trends, and support clearer product or business decisions.`,
      `Built reporting or dashboard views with ${secondary} and communicated findings in a way stakeholders could act on.`,
      `Improved data quality and analysis reliability through repeatable workflows, validation checks, and documented assumptions.`,
    ];
  }

  return [
    `Built practical features using ${primary} and translated technical work into clear, outcome-focused delivery.`,
    `Used ${secondary} in project work and collaborated through version control to ship reliable improvements.`,
    `Improved product quality through debugging, iteration, and stronger communication of technical decisions.`,
  ];
}

function buildRoadmap(missingSkills, niceToHave, categorySuggestions) {
  const learnNow = missingSkills.slice(0, 3);
  const learnNext = uniqueList([
    ...missingSkills.slice(3, 6),
    ...categorySuggestions.learn.map((item) => item.split(",")[0]),
  ]).slice(0, 3);
  const niceToHaveList = uniqueSkills(niceToHave).slice(0, 3);

  return {
    learnNow: learnNow.length > 0 ? learnNow : ["CV tailoring", "Project evidence", "Interview stories"],
    learnNext: learnNext.length > 0 ? learnNext : ["Testing depth", "Collaboration signals", "Measurable impact"],
    niceToHave: niceToHaveList.length > 0 ? niceToHaveList : ["Performance", "Accessibility", "Documentation"],
  };
}

function buildImprovementEstimate(job, missingSkills, hasPersonalizedData) {
  if (!hasPersonalizedData) {
    return `Analyze your CV to estimate the most meaningful improvements for ${job.title}. For now, the coach is showing role-based priorities.`;
  }

  if (missingSkills.length === 0) {
    return "Your fit is already strong. Sharper proof, measurable outcomes, and stronger interview stories are the main remaining leverage points.";
  }

  if (missingSkills.length <= 2) {
    return `Adding evidence for ${missingSkills.join(" and ")} could materially strengthen your fit for this role without changing your whole profile.`;
  }

  return `Closing the first ${Math.min(3, missingSkills.length)} gaps, then reflecting them in your CV and portfolio, would likely make this application feel much more competitive.`;
}

export function generateCoachPlan(job, analyzedCvData = null) {
  const jobAnalysis = resolveJobAnalysis(job, analyzedCvData);
  const cvText = analyzedCvData?.cvText || "";
  const normalizedCv = normalizeText(cvText);
  const extractedSkills = uniqueSkills(analyzedCvData?.extractedSkills || []);
  const requirements = uniqueSkills(job.requirements || job.skills || []);
  const coreSkills = uniqueSkills(job.coreSkills?.length ? job.coreSkills : requirements.slice(0, 3));
  const niceToHave = uniqueSkills(job.niceToHave || []);
  const cvSkillSet = new Set(extractedSkills.map((skill) => normalizeSkill(skill)));
  const inferredMatched = requirements.filter(
    (skill) => cvSkillSet.has(normalizeSkill(skill)) || skillMatchesText(skill, normalizedCv)
  );
  const matchedSkills = uniqueSkills(jobAnalysis?.matchedSkills?.length ? jobAnalysis.matchedSkills : inferredMatched);
  const missingSkills = uniqueSkills(
    jobAnalysis?.missingSkills?.length
      ? jobAnalysis.missingSkills
      : requirements.filter((skill) => !matchedSkills.includes(formatSkill(skill)))
  );
  const signals = getProfileSignals(cvText);
  const hasPersonalizedData = Boolean(jobAnalysis);
  const categorySuggestions = getCategorySuggestions(job.category);
  const levelSuggestions = getLevelSuggestions(job.level);
  const prioritizedMissing = uniqueSkills([
    ...coreSkills.filter((skill) => missingSkills.includes(skill)),
    ...missingSkills,
  ]).slice(0, 4);
  const skillSuggestionObjects = prioritizedMissing.map((skill) =>
    getSkillSuggestions(skill, { jobTitle: job.title, category: job.category, level: job.level })
  );

  const quickWins = takeTop(
    [
      ...skillSuggestionObjects.map((item) => item.quickWins),
      ...categorySuggestions.quickWins,
      ...levelSuggestions.quickWins,
    ],
    5
  );

  const cvImprovements = takeTop(
    [
      `Tailor your summary toward ${job.title} at ${job.company} by leading with ${matchedSkills.slice(0, 3).join(", ") || "the most relevant job keywords"}.`,
      ...skillSuggestionObjects.map((item) => item.cv),
      ...categorySuggestions.cv,
      ...levelSuggestions.cv,
      !signals.hasQuantifiedImpact ? "Quantify outcomes in at least two bullets so your impact is visible, not implied." : "",
      matchedSkills.length > 0
        ? `Move ${matchedSkills.slice(0, 3).join(", ")} into recent experience bullets so recruiters see role alignment immediately.`
        : "Use the first project bullets to prove the stack this role asks for instead of keeping skills only in a separate list.",
    ],
    6
  );

  const skillsToLearnNext = takeTop(
    [
      ...skillSuggestionObjects.map((item) => item.learn),
      ...categorySuggestions.learn,
      ...levelSuggestions.learn,
    ],
    5
  );

  const portfolioSuggestions = takeTop(
    [
      ...skillSuggestionObjects.map((item) => item.portfolio),
      ...categorySuggestions.portfolio,
      ...levelSuggestions.portfolio,
    ],
    5
  );

  const interviewTips = takeTop(
    [
      ...categorySuggestions.interview,
      ...skillSuggestionObjects.map((item) => item.interview),
      ...levelSuggestions.interview,
      missingSkills.length > 0
        ? `Have a crisp answer for how you plan to close gaps in ${missingSkills.slice(0, 2).join(" and ")} without overstating your experience.`
        : "Prepare detailed examples that prove depth, ownership, and product thinking instead of repeating tool names.",
    ],
    6
  );

  const strengths = buildStrengths(job, matchedSkills, extractedSkills, signals);
  const weakAreas = buildWeakAreas(job, missingSkills, coreSkills, signals, hasPersonalizedData);
  const roadmap = buildRoadmap(missingSkills, niceToHave, categorySuggestions);
  const sampleBullets = buildSampleBullets(job.category, matchedSkills, prioritizedMissing);
  const explanation =
    jobAnalysis?.explanation ||
    `This local coach is focusing on the clearest gap areas for ${job.title}: ${prioritizedMissing.join(", ") || "stronger role-specific evidence"}.`;

  return {
    jobId: job.id,
    jobTitle: job.title,
    company: job.company,
    category: job.category,
    level: job.level,
    matchScore: typeof jobAnalysis?.matchScore === "number" ? jobAnalysis.matchScore : buildGeneralScore(job),
    headline: `Here is how to improve your fit for this ${job.title} role.`,
    subheadline: hasPersonalizedData
      ? `Your CV already shows ${matchedSkills.length} matching skills. The fastest gains are around ${prioritizedMissing.slice(0, 2).join(" and ") || "sharper proof of impact"}.`
      : `You have not analyzed your CV yet, so this plan is based on the role requirements for ${job.title}.`,
    explanation,
    hasPersonalizedData,
    matchedSkills,
    missingSkills,
    strengths,
    weakAreas,
    quickWins,
    cvImprovements,
    skillsToLearnNext,
    portfolioSuggestions,
    interviewTips,
    roadmap,
    sampleBullets,
    improvementEstimate: buildImprovementEstimate(job, prioritizedMissing, hasPersonalizedData),
    currentStanding: {
      matchedCount: matchedSkills.length,
      missingCount: missingSkills.length,
      extractedSkillsCount: extractedSkills.length,
      topFocus: prioritizedMissing[0] || "Stronger role-specific proof",
    },
    extractedSkills,
    analyzedAt: analyzedCvData?.analyzedAt || null,
  };
}

import {
  dedupeSkills,
  formatSkill,
  getAllCanonicalSkills,
  getCanonicalSkillMap,
  normalizeText,
  skillMatchesText,
} from "./normalizeSkills.js";

const INFERENCE_PATTERNS = [
  { pattern: /\b(component|frontend|front end|ui|single page app|client side)\b/i, skills: ["React", "Responsive Design"] },
  { pattern: /\b(api|endpoint|axios|fetch|integration|http requests?)\b/i, skills: ["REST APIs"] },
  { pattern: /\b(node|server|backend|middleware|controller)\b/i, skills: ["Node.js", "Express"] },
  { pattern: /\b(database|schema|query|aggregation|joins?)\b/i, skills: ["SQL", "Database Design"] },
  { pattern: /\b(test|qa|automation|coverage|regression)\b/i, skills: ["Testing"] },
  { pattern: /\b(jest|vitest|cypress|playwright|selenium)\b/i, skills: ["Testing"] },
  { pattern: /\b(figma|prototype|wireframe|design system|usability)\b/i, skills: ["Figma", "UI Design"] },
  { pattern: /\b(wcag|accessibility|semantic html|keyboard navigation)\b/i, skills: ["Accessibility"] },
  { pattern: /\b(performance|optimi[sz]e|lazy load|bundle|profiling)\b/i, skills: ["Performance Optimization"] },
  { pattern: /\b(aws|azure|gcp|cloud|deployment|infrastructure)\b/i, skills: ["AWS"] },
  { pattern: /\b(docker|container|kubernetes|ci\/cd|github actions)\b/i, skills: ["Docker", "CI/CD"] },
  { pattern: /\b(dashboard|reporting|analysis|insights|tableau|power bi)\b/i, skills: ["Data Analysis", "Data Visualization"] },
  { pattern: /\b(product|roadmap|stakeholder|prioritization|experiment)\b/i, skills: ["Product Thinking", "Stakeholder Management"] },
  { pattern: /\b(team|collaborat|cross functional|stakeholder|mentored)\b/i, skills: ["Teamwork", "Communication"] },
  { pattern: /\b(debug|resolve|problem|troubleshoot|investigate)\b/i, skills: ["Problem Solving"] },
];

const MAX_GRAM = 4;

function extractDictionaryMatches(normalizedText) {
  return getAllCanonicalSkills().filter((skill) => skillMatchesText(skill, normalizedText));
}

function extractTokenMatches(text = "") {
  const canonicalMap = getCanonicalSkillMap();
  const words = text
    .toLowerCase()
    .replace(/[^a-z0-9+#.\s/-]/g, " ")
    .replace(/[._/\\-]/g, " ")
    .split(/\s+/)
    .filter(Boolean);

  const matches = [];

  for (let index = 0; index < words.length; index += 1) {
    for (let size = MAX_GRAM; size >= 1; size -= 1) {
      const candidate = words.slice(index, index + size).join(" ").trim();
      const canonical = canonicalMap[candidate];
      if (canonical) {
        matches.push(canonical);
      }
    }
  }

  return matches;
}

function inferSkillsFromPatterns(text = "", normalizedText) {
  const inferred = [];

  INFERENCE_PATTERNS.forEach(({ pattern, skills }) => {
    if (pattern.test(text) || skills.some((skill) => skillMatchesText(skill, normalizedText))) {
      inferred.push(...skills);
    }
  });

  return inferred;
}

function buildMetadata(rawText = "", extractedSkills = []) {
  const words = rawText.trim().split(/\s+/).filter(Boolean);
  const sentences = rawText
    .split(/[.!?]+/)
    .map((item) => item.trim())
    .filter(Boolean);

  return {
    wordCount: words.length,
    sentenceCount: sentences.length,
    skillCount: extractedSkills.length,
    topSkills: extractedSkills.slice(0, 12),
  };
}

export function extractSkillsFromText(rawText = "") {
  const normalizedText = normalizeText(rawText);
  const extractedSkills = dedupeSkills([
    ...extractDictionaryMatches(normalizedText),
    ...extractTokenMatches(rawText),
    ...inferSkillsFromPatterns(rawText, normalizedText),
  ]).map((skill) => formatSkill(skill));

  return {
    extractedSkills,
    metadata: buildMetadata(rawText, extractedSkills),
  };
}


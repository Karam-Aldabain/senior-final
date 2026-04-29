import { SKILL_DICTIONARY, SKILL_DISPLAY_LABELS } from "./skillDictionary.js";

function baseNormalize(value = "") {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9+#.\s/-]/g, " ")
    .replace(/[._/\\-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const canonicalEntries = SKILL_DICTIONARY.map((skill) => ({
  canonical: skill.name,
  canonicalKey: baseNormalize(skill.name),
  aliases: [skill.name, ...(skill.aliases || [])].map((alias) => baseNormalize(alias)).filter(Boolean),
}));

const aliasToCanonical = canonicalEntries.reduce((accumulator, entry) => {
  entry.aliases.forEach((alias) => {
    accumulator[alias] = entry.canonical;
  });
  return accumulator;
}, {});

export function normalizeSkill(skill = "") {
  const normalized = baseNormalize(skill);
  return aliasToCanonical[normalized] || normalized;
}

export function normalizeText(text = "") {
  return ` ${baseNormalize(text)} `;
}

export function formatSkill(skill = "") {
  const canonical = normalizeSkill(skill);
  if (SKILL_DISPLAY_LABELS[canonical]) {
    return SKILL_DISPLAY_LABELS[canonical];
  }

  return canonical
    .split(" ")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function getCanonicalSkillMap() {
  return { ...aliasToCanonical };
}

export function getSkillSearchTerms(skill = "") {
  const canonical = normalizeSkill(skill);
  const match = canonicalEntries.find((entry) => entry.canonical === canonical);
  return match ? [...new Set(match.aliases)] : [baseNormalize(skill)].filter(Boolean);
}

export function dedupeSkills(skills = []) {
  const seen = new Set();

  return skills
    .map((skill) => normalizeSkill(skill))
    .filter(Boolean)
    .filter((skill) => {
      if (seen.has(skill)) {
        return false;
      }

      seen.add(skill);
      return true;
    });
}

export function skillMatchesText(skill, normalizedText) {
  return getSkillSearchTerms(skill).some((term) => normalizedText.includes(` ${term} `));
}

export function getAllCanonicalSkills() {
  return canonicalEntries.map((entry) => entry.canonical);
}

export function getSkillCategory(skill = "") {
  const canonical = normalizeSkill(skill);
  return SKILL_DICTIONARY.find((entry) => entry.name === canonical)?.category || "general";
}


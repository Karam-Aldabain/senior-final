import { extractSkillsFromText } from "../../shared/skills/extractSkillsFromText.js";

export function buildSkillLibrary(jobs = []) {
  return jobs.flatMap((job) => [
    ...(Array.isArray(job.requirements) ? job.requirements : []),
    ...(Array.isArray(job.coreSkills) ? job.coreSkills : []),
    ...(Array.isArray(job.niceToHave) ? job.niceToHave : []),
    job.category,
    job.title,
  ]);
}

export function extractSkillsFromCv(cvText) {
  return extractSkillsFromText(cvText).extractedSkills;
}

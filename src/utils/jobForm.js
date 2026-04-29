export function stringifyArrayField(value = []) {
  if (!Array.isArray(value)) {
    return "";
  }

  return value.join(", ");
}

export function parseArrayField(value = "") {
  return String(value)
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function toJobFormValues(job = {}) {
  return {
    title: job.title || "",
    company: job.company || "",
    location: job.location || "",
    type: job.type || "Remote",
    salary: job.salary || "",
    category: job.category || "",
    experienceLevel: job.experienceLevel || job.level || "Junior",
    description: job.description || "",
    overview: job.overview || "",
    requirements: stringifyArrayField(job.requirements),
    coreSkills: stringifyArrayField(job.coreSkills),
    niceToHave: stringifyArrayField(job.niceToHave),
    responsibilities: stringifyArrayField(job.responsibilities),
    benefits: stringifyArrayField(job.benefits),
    tags: stringifyArrayField(job.tags),
    isFeatured: Boolean(job.isFeatured),
  };
}

export function toJobPayload(formValues) {
  return {
    ...formValues,
    requirements: parseArrayField(formValues.requirements),
    coreSkills: parseArrayField(formValues.coreSkills),
    niceToHave: parseArrayField(formValues.niceToHave),
    responsibilities: parseArrayField(formValues.responsibilities),
    benefits: parseArrayField(formValues.benefits),
    tags: parseArrayField(formValues.tags),
  };
}


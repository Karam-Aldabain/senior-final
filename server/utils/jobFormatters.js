export function getCompanyInitial(company = "") {
  return String(company)
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join("");
}

export function normalizeStringArray(value) {
  if (Array.isArray(value)) {
    return [...new Set(value.map((item) => String(item).trim()).filter(Boolean))];
  }

  if (typeof value === "string") {
    return [...new Set(value.split(",").map((item) => item.trim()).filter(Boolean))];
  }

  return [];
}

export function sanitizeJobPayload(payload = {}) {
  return {
    title: String(payload.title || "").trim(),
    company: String(payload.company || "").trim(),
    location: String(payload.location || "").trim(),
    type: String(payload.type || "").trim(),
    salary: String(payload.salary || "").trim(),
    category: String(payload.category || "").trim(),
    experienceLevel: String(payload.experienceLevel || "").trim(),
    description: String(payload.description || "").trim(),
    overview: String(payload.overview || "").trim(),
    requirements: normalizeStringArray(payload.requirements),
    coreSkills: normalizeStringArray(payload.coreSkills),
    niceToHave: normalizeStringArray(payload.niceToHave),
    responsibilities: normalizeStringArray(payload.responsibilities),
    benefits: normalizeStringArray(payload.benefits),
    tags: normalizeStringArray(payload.tags),
    isFeatured: Boolean(payload.isFeatured),
    postedAt: payload.postedAt ? new Date(payload.postedAt) : new Date(),
    logo: String(payload.logo || "").trim(),
    companyInitial: String(payload.companyInitial || getCompanyInitial(payload.company || "")).trim(),
  };
}

export function validateJobPayload(payload) {
  const requiredFields = ["title", "company", "location", "type", "category", "experienceLevel", "description"];
  const missingFields = requiredFields.filter((field) => !payload[field]);

  if (missingFields.length > 0) {
    const error = new Error(`Missing required fields: ${missingFields.join(", ")}`);
    error.status = 400;
    throw error;
  }
}

export function serializeJob(job, extra = {}) {
  const source = typeof job.toObject === "function" ? job.toObject() : job;
  return {
    ...source,
    id: String(source._id),
    companyInitial: source.companyInitial || getCompanyInitial(source.company),
    level: source.experienceLevel,
    ...extra,
  };
}


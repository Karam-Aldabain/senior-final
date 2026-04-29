function buildRegex(value) {
  return new RegExp(String(value).trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
}

export function buildJobsQuery(query = {}) {
  const filters = {};

  if (query.category) {
    filters.category = buildRegex(query.category);
  }

  if (query.location) {
    filters.location = buildRegex(query.location);
  }

  if (query.type) {
    filters.type = buildRegex(query.type);
  }

  if (query.experienceLevel) {
    filters.experienceLevel = buildRegex(query.experienceLevel);
  }

  if (query.search) {
    const searchRegex = buildRegex(query.search);
    filters.$or = [
      { title: searchRegex },
      { company: searchRegex },
      { category: searchRegex },
      { requirements: searchRegex },
      { coreSkills: searchRegex },
      { niceToHave: searchRegex },
      { tags: searchRegex },
    ];
  }

  return filters;
}

export function buildSort(query = {}) {
  const allowedSorts = {
    postedAt: "postedAt",
    title: "title",
    company: "company",
    location: "location",
    experienceLevel: "experienceLevel",
    category: "category",
  };

  const sortBy = allowedSorts[query.sortBy] || "postedAt";
  const sortOrder = query.sortOrder === "asc" ? 1 : -1;

  return { [sortBy]: sortOrder };
}

export function getPagination(query = {}) {
  const page = Math.max(1, Number(query.page || 1));
  const limit = Math.min(100, Math.max(1, Number(query.limit || 12)));
  const skip = (page - 1) * limit;

  return { page, limit, skip };
}

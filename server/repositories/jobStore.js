import fs from "fs/promises";
import path from "path";
import { DatabaseSync } from "node:sqlite";
import { fileURLToPath } from "url";
import { Job } from "../config/db.js";
import { seedJobs } from "../data/seedJobs.js";
import { sanitizeJobPayload } from "../utils/jobFormatters.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const LOCAL_STORE_PATH = path.resolve(__dirname, "../data/jobs.local.json");
const SQLITE_STORE_PATH = path.resolve(__dirname, "../data/app.sqlite");

function parseArray(value) {
  try {
    const parsed = JSON.parse(value || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function sqliteRowToJob(row) {
  return {
    _id: row.id,
    title: row.title,
    company: row.company,
    location: row.location,
    type: row.type,
    salary: row.salary || "",
    category: row.category,
    experienceLevel: row.experience_level,
    description: row.description,
    overview: row.overview || "",
    requirements: parseArray(row.requirements),
    coreSkills: parseArray(row.core_skills),
    niceToHave: parseArray(row.nice_to_have),
    responsibilities: parseArray(row.responsibilities),
    benefits: parseArray(row.benefits),
    tags: parseArray(row.tags),
    isFeatured: Boolean(row.is_featured),
    postedAt: row.posted_at,
    logo: row.logo || "",
    companyInitial: row.company_initial || "",
    status: row.status || "approved",
    userId: null,
  };
}

function normalizeStoredJob(job = {}) {
  const normalized = {
    ...job,
    postedAt: job.postedAt ? new Date(job.postedAt) : new Date(),
    status: job.status || "approved",
    userId: job.userId || null,
  };

  if (!job._id && !job.id) {
    delete normalized._id;
  }

  return normalized;
}

async function loadSqliteJobs() {
  try {
    await fs.access(SQLITE_STORE_PATH);
    const sqlite = new DatabaseSync(SQLITE_STORE_PATH, { readOnly: true });
    const rows = sqlite.prepare("SELECT * FROM jobs ORDER BY posted_at DESC").all();
    sqlite.close();
    return rows.map(sqliteRowToJob);
  } catch {
    return [];
  }
}

async function loadJsonJobs() {
  try {
    const raw = await fs.readFile(LOCAL_STORE_PATH, "utf8");
    const parsed = JSON.parse(raw || "[]");
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
  } catch {
    // Fall back to seed data when the previous local store is absent or invalid.
  }

  return seedJobs;
}

async function ensureMigrated() {
  const count = await Job.countDocuments();

  if (count > 0) {
    return;
  }

  const sqliteJobs = await loadSqliteJobs();
  const initialJobs = sqliteJobs.length > 0 ? sqliteJobs : await loadJsonJobs();

  await Job.insertMany(
    initialJobs.map((job) =>
      normalizeStoredJob({
        ...sanitizeJobPayload(job),
        _id: job._id || job.id,
        postedAt: job.postedAt,
        status: job.status || "approved",
        userId: job.userId || null,
      })
    ),
    { ordered: false }
  );
}

export async function listJobs(filters = {}, sort = { postedAt: -1 }, { skip = 0, limit = 12 } = {}) {
  await ensureMigrated();
  return Job.find(filters).sort(sort).skip(skip).limit(limit).lean();
}

export async function countJobs(filters = {}) {
  await ensureMigrated();
  return Job.countDocuments(filters);
}

export async function getAllJobs(sort = { postedAt: -1 }, filters = {}) {
  await ensureMigrated();
  return Job.find(filters).sort(sort).lean();
}

export async function getJobById(id) {
  await ensureMigrated();
  return Job.findById(id).lean();
}

export async function createJob(payload) {
  await ensureMigrated();
  const job = await Job.create(normalizeStoredJob(payload));
  return job.toObject();
}

export async function updateJobById(id, payload) {
  await ensureMigrated();
  return Job.findByIdAndUpdate(
    id,
    {
      ...payload,
      postedAt: payload.postedAt ? new Date(payload.postedAt) : undefined,
    },
    { new: true, runValidators: true }
  ).lean();
}

export async function deleteJobById(id) {
  await ensureMigrated();
  return Job.findByIdAndDelete(id).lean();
}

export async function replaceAllJobs(jobs) {
  await Job.deleteMany({});
  await Job.insertMany(
    jobs.map((job) =>
      normalizeStoredJob({
        ...job,
        status: job.status || "approved",
      })
    )
  );
  return getAllJobs({ postedAt: -1 });
}

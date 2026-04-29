import fs from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import { fileURLToPath } from "url";
import { seedJobs } from "../data/seedJobs.js";
import { sanitizeJobPayload } from "../utils/jobFormatters.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const STORE_PATH = path.resolve(__dirname, "../data/jobs.local.json");

let writeQueue = Promise.resolve();

function sortItems(items, sort = { postedAt: -1 }) {
  const [[field, direction]] = Object.entries(sort);
  const sortDirection = direction === 1 ? 1 : -1;

  return [...items].sort((left, right) => {
    const leftValue = left[field];
    const rightValue = right[field];

    if (field === "postedAt") {
      const leftTime = new Date(leftValue).getTime();
      const rightTime = new Date(rightValue).getTime();
      return (leftTime - rightTime) * sortDirection;
    }

    return String(leftValue ?? "").localeCompare(String(rightValue ?? "")) * sortDirection;
  });
}

function matchesValue(source, matcher) {
  if (matcher instanceof RegExp) {
    if (Array.isArray(source)) {
      return source.some((item) => matcher.test(String(item)));
    }

    return matcher.test(String(source ?? ""));
  }

  return source === matcher;
}

function matchesFilters(job, filters = {}) {
  for (const [key, value] of Object.entries(filters)) {
    if (key === "$or") {
      if (!value.some((rule) => matchesFilters(job, rule))) {
        return false;
      }

      continue;
    }

    if (!matchesValue(job[key], value)) {
      return false;
    }
  }

  return true;
}

function normalizeStoredJob(job) {
  return {
    ...job,
    _id: String(job._id),
    postedAt: new Date(job.postedAt || Date.now()).toISOString(),
  };
}

async function writeStore(items) {
  const payload = JSON.stringify(items, null, 2);
  await fs.writeFile(STORE_PATH, `${payload}\n`, "utf8");
}

async function ensureStore() {
  try {
    await fs.access(STORE_PATH);
  } catch {
    const initialJobs = seedJobs.map((job) => ({
      ...sanitizeJobPayload(job),
      _id: randomUUID(),
      postedAt: new Date(job.postedAt || Date.now()).toISOString(),
    }));

    await writeStore(initialJobs);
  }
}

async function readStore() {
  await ensureStore();
  const raw = await fs.readFile(STORE_PATH, "utf8");
  const parsed = JSON.parse(raw || "[]");
  return parsed.map(normalizeStoredJob);
}

async function updateStore(mutator) {
  writeQueue = writeQueue.then(async () => {
    const currentItems = await readStore();
    const nextItems = await mutator(currentItems);
    await writeStore(nextItems);
    return nextItems;
  });

  return writeQueue;
}

export async function listJobs(filters = {}, sort = { postedAt: -1 }, { skip = 0, limit = 12 } = {}) {
  const items = await readStore();
  return sortItems(items.filter((job) => matchesFilters(job, filters)), sort).slice(skip, skip + limit);
}

export async function countJobs(filters = {}) {
  const items = await readStore();
  return items.filter((job) => matchesFilters(job, filters)).length;
}

export async function getAllJobs(sort = { postedAt: -1 }) {
  const items = await readStore();
  return sortItems(items, sort);
}

export async function getJobById(id) {
  const items = await readStore();
  return items.find((job) => job._id === String(id)) || null;
}

export async function createJob(payload) {
  const nextJob = normalizeStoredJob({
    ...payload,
    _id: randomUUID(),
    postedAt: payload.postedAt ? new Date(payload.postedAt).toISOString() : new Date().toISOString(),
  });

  await updateStore((items) => [...items, nextJob]);
  return nextJob;
}

export async function updateJobById(id, payload) {
  let updatedJob = null;

  await updateStore((items) =>
    items.map((job) => {
      if (job._id !== String(id)) {
        return job;
      }

      updatedJob = normalizeStoredJob({
        ...job,
        ...payload,
        _id: job._id,
        postedAt: payload.postedAt ? new Date(payload.postedAt).toISOString() : job.postedAt,
      });

      return updatedJob;
    })
  );

  return updatedJob;
}

export async function deleteJobById(id) {
  let deletedJob = null;

  await updateStore((items) =>
    items.filter((job) => {
      if (job._id === String(id)) {
        deletedJob = job;
        return false;
      }

      return true;
    })
  );

  return deletedJob;
}

export async function replaceAllJobs(jobs) {
  const nextItems = jobs.map((job) =>
    normalizeStoredJob({
      ...job,
      _id: job._id || randomUUID(),
      postedAt: job.postedAt ? new Date(job.postedAt).toISOString() : new Date().toISOString(),
    })
  );

  await updateStore(() => nextItems);
  return nextItems;
}

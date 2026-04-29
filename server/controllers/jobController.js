import { countJobs, createJob as createStoredJob, deleteJobById, getJobById as getStoredJobById, listJobs as listStoredJobs, updateJobById } from "../repositories/jobStore.js";
import { sanitizeJobPayload, serializeJob, validateJobPayload } from "../utils/jobFormatters.js";
import { buildJobsQuery, buildSort, getPagination } from "../utils/queryJobs.js";

export async function listJobs(request, response) {
  const filters = buildJobsQuery(request.query);
  const sort = buildSort(request.query);
  const pagination = getPagination(request.query);

  const [jobs, total] = await Promise.all([
    listStoredJobs(filters, sort, pagination),
    countJobs(filters),
  ]);

  response.json({
    items: jobs.map((job) => serializeJob(job)),
    pagination: {
      page: pagination.page,
      limit: pagination.limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / pagination.limit)),
    },
  });
}

export async function getJobById(request, response) {
  const job = await getStoredJobById(request.params.id);

  if (!job) {
    const error = new Error("Job not found.");
    error.status = 404;
    throw error;
  }

  response.json(serializeJob(job));
}

export async function createJob(request, response) {
  const payload = sanitizeJobPayload(request.body);
  validateJobPayload(payload);
  const job = await createStoredJob(payload);

  response.status(201).json(serializeJob(job));
}

export async function updateJob(request, response) {
  const payload = sanitizeJobPayload(request.body);
  validateJobPayload(payload);

  const job = await updateJobById(request.params.id, payload);

  if (!job) {
    const error = new Error("Job not found.");
    error.status = 404;
    throw error;
  }

  response.json(serializeJob(job));
}

export async function deleteJob(request, response) {
  const job = await deleteJobById(request.params.id);

  if (!job) {
    const error = new Error("Job not found.");
    error.status = 404;
    throw error;
  }

  response.json({
    ok: true,
    id: request.params.id,
  });
}

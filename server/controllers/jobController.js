import { countJobs, createJob as createStoredJob, deleteJobById, getJobById as getStoredJobById, listJobs as listStoredJobs, updateJobById } from "../repositories/jobStore.js";
import { sanitizeJobPayload, serializeJob, validateJobPayload } from "../utils/jobFormatters.js";
import { buildJobsQuery, buildSort, getPagination } from "../utils/queryJobs.js";

function applyRoleFilters(filters, request) {
  if (request.user?.role === "admin" && request.query.scope === "all") {
    if (request.query.status) {
      return { ...filters, status: request.query.status };
    }

    return filters;
  }

  if (request.user?.role === "company") {
    return { ...filters, userId: request.user.id };
  }

  return { ...filters, status: "approved" };
}

function canAccessJob(job, user) {
  if (job.status === "approved") {
    return true;
  }

  if (user?.role === "admin") {
    return true;
  }

  return user?.role === "company" && job.userId === user.id;
}

export async function listJobs(request, response) {
  const filters = applyRoleFilters(buildJobsQuery(request.query), request);
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

  if (!job || !canAccessJob(job, request.user)) {
    const error = new Error("Job not found.");
    error.status = 404;
    throw error;
  }

  response.json(serializeJob(job));
}

export async function createJob(request, response) {
  const payload = sanitizeJobPayload(request.body);
  validateJobPayload(payload);
  const job = await createStoredJob({
    ...payload,
    status: request.user.role === "admin" ? "approved" : "pending",
    userId: request.user.id,
  });

  response.status(201).json(serializeJob(job));
}

export async function updateJob(request, response) {
  const payload = sanitizeJobPayload(request.body);
  validateJobPayload(payload);

  const existingJob = await getStoredJobById(request.params.id);

  if (!existingJob || (request.user.role === "company" && existingJob.userId !== request.user.id)) {
    const error = new Error("Job not found.");
    error.status = 404;
    throw error;
  }

  const job = await updateJobById(request.params.id, {
    ...payload,
    status: request.user.role === "company" ? "pending" : existingJob.status,
    userId: request.user.role === "company" ? request.user.id : existingJob.userId,
  });

  if (!job) {
    const error = new Error("Job not found.");
    error.status = 404;
    throw error;
  }

  response.json(serializeJob(job));
}

export async function deleteJob(request, response) {
  const existingJob = await getStoredJobById(request.params.id);

  if (!existingJob || (request.user.role === "company" && existingJob.userId !== request.user.id)) {
    const error = new Error("Job not found.");
    error.status = 404;
    throw error;
  }

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

export async function reviewJob(request, response) {
  const status = request.body?.status;

  if (!["approved", "rejected"].includes(status)) {
    const error = new Error("Status must be approved or rejected.");
    error.status = 400;
    throw error;
  }

  const job = await updateJobById(request.params.id, { status });

  if (!job) {
    const error = new Error("Job not found.");
    error.status = 404;
    throw error;
  }

  response.json(serializeJob(job));
}

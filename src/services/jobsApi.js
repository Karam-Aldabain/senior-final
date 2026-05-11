const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

function getAuthToken() {
  try {
    return JSON.parse(localStorage.getItem("hiresense_auth") || "null")?.token || "";
  } catch {
    return "";
  }
}

function authHeaders(extraHeaders = {}) {
  const token = getAuthToken();
  return token ? { ...extraHeaders, Authorization: `Bearer ${token}` } : extraHeaders;
}

async function parseResponse(response) {
  const rawText = await response.text().catch(() => "");
  let data = null;

  if (rawText) {
    try {
      data = JSON.parse(rawText);
    } catch {
      data = { error: rawText };
    }
  }

  if (!response.ok) {
    throw new Error(data?.error || "Request failed.");
  }

  return data;
}

function toQueryString(params = {}) {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "" || (value === "all" && key !== "scope")) {
      return;
    }

    searchParams.set(key, String(value));
  });

  return searchParams.toString();
}

export async function fetchJobs(params = {}) {
  const queryString = toQueryString(params);
  const response = await fetch(`${API_BASE_URL}/api/jobs${queryString ? `?${queryString}` : ""}`, {
    headers: authHeaders(),
  });
  return parseResponse(response);
}

export async function fetchJobById(jobId) {
  const response = await fetch(`${API_BASE_URL}/api/jobs/${jobId}`, {
    headers: authHeaders(),
  });
  return parseResponse(response);
}

export async function uploadCvPdf(file) {
  const formData = new FormData();
  formData.append("cv", file);

  const response = await fetch(`${API_BASE_URL}/api/cv/upload`, {
    method: "POST",
    body: formData,
  });

  return parseResponse(response);
}

export async function createJob(payload) {
  const response = await fetch(`${API_BASE_URL}/api/jobs`, {
    method: "POST",
    headers: authHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify(payload),
  });

  return parseResponse(response);
}

export async function updateJob(jobId, payload) {
  const response = await fetch(`${API_BASE_URL}/api/jobs/${jobId}`, {
    method: "PUT",
    headers: authHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify(payload),
  });

  return parseResponse(response);
}

export async function deleteJob(jobId) {
  const response = await fetch(`${API_BASE_URL}/api/jobs/${jobId}`, {
    method: "DELETE",
    headers: authHeaders(),
  });

  return parseResponse(response);
}

export async function reviewJob(jobId, status) {
  const response = await fetch(`${API_BASE_URL}/api/jobs/${jobId}/review`, {
    method: "PATCH",
    headers: authHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify({ status }),
  });

  return parseResponse(response);
}

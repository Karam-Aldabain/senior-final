import fs from "fs/promises";
import { getAllJobs } from "../repositories/jobStore.js";
import { matchJobsAgainstCv } from "../utils/jobMatcher.js";
import { parseCvPdf } from "../utils/pdfParser.js";

export async function uploadCvAndAnalyze(request, response) {
  if (!request.file) {
    const error = new Error("A PDF file is required.");
    error.status = 400;
    throw error;
  }

  let parsed;

  try {
    parsed = await parseCvPdf(request.file.path);
  } finally {
    await fs.unlink(request.file.path).catch(() => {});
  }

  const jobs = await getAllJobs({ postedAt: -1 });
  const analysis = matchJobsAgainstCv(parsed.rawText, jobs);

  response.status(201).json({
    file: {
      originalName: request.file.originalname,
      mimeType: request.file.mimetype,
      size: request.file.size,
    },
    rawText: parsed.rawText,
    extractedSkills: analysis.extractedSkills,
    metadata: analysis.metadata,
    summary: analysis.summary,
    jobs: analysis.rankedJobs,
  });
}

import "../config/env.js";
import { connectDatabase } from "../config/db.js";
import { seedJobs } from "../data/seedJobs.js";
import { replaceAllJobs } from "../repositories/jobStore.js";
import { sanitizeJobPayload } from "../utils/jobFormatters.js";

async function run() {
  await connectDatabase();
  await replaceAllJobs(seedJobs.map((job) => sanitizeJobPayload(job)));
  console.log(`Seeded ${seedJobs.length} jobs.`);
}

run()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Failed to seed jobs.");
    console.error(error);
    process.exit(1);
  });

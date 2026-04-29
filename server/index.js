import "./config/env.js";
import app from "./app.js";
import { connectDatabase } from "./config/db.js";
import { getServerPort } from "./config/env.js";

const port = getServerPort();

async function startServer() {
  await connectDatabase();

  app.listen(port, () => {
    console.log(`Job platform server listening on http://localhost:${port}`);
  });
}

startServer().catch((error) => {
  console.error("Failed to start server.");
  console.error(error);
  process.exit(1);
});

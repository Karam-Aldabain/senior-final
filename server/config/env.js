import dotenv from "dotenv";
import { fileURLToPath } from "url";

dotenv.config({
  path: fileURLToPath(new URL("../.env", import.meta.url)),
});

export function getAllowedOrigins() {
  return String(process.env.CORS_ORIGIN || "http://localhost:5173,http://127.0.0.1:5173")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
}

export function getServerPort() {
  return Number(process.env.PORT || 5000);
}

export function getMongoUri() {
  return process.env.MONGODB_URI || "";
}


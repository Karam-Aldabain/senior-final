import { createHash, randomBytes, randomUUID } from "crypto";
import mongoose from "mongoose";
import { getMongoUri } from "./env.js";

let connectionPromise = null;

export function hashPassword(password, salt) {
  return createHash("sha256").update(`${salt}:${password}`).digest("hex");
}

export function verifyPassword(password, salt, hash) {
  return hashPassword(password, salt) === hash;
}

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordSalt: { type: String, required: true },
    passwordHash: { type: String, required: true },
    role: { type: String, required: true, enum: ["admin", "company", "job_seeker"] },
    name: { type: String, required: true },
  },
  { timestamps: true }
);

const sessionSchema = new mongoose.Schema(
  {
    token: { type: String, required: true, unique: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    expiresAt: { type: Date, required: true, index: { expires: 0 } },
  },
  { timestamps: true }
);

const jobSchema = new mongoose.Schema(
  {
    _id: { type: String, default: randomUUID },
    title: { type: String, required: true },
    company: { type: String, required: true },
    location: { type: String, required: true },
    type: { type: String, required: true },
    salary: { type: String, default: "" },
    category: { type: String, required: true },
    experienceLevel: { type: String, required: true },
    description: { type: String, required: true },
    overview: { type: String, default: "" },
    requirements: { type: [String], default: [] },
    coreSkills: { type: [String], default: [] },
    niceToHave: { type: [String], default: [] },
    responsibilities: { type: [String], default: [] },
    benefits: { type: [String], default: [] },
    tags: { type: [String], default: [] },
    isFeatured: { type: Boolean, default: false },
    postedAt: { type: Date, default: Date.now },
    logo: { type: String, default: "" },
    companyInitial: { type: String, default: "" },
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "approved" },
    userId: { type: String, default: null },
  },
  { timestamps: true }
);

export const User = mongoose.models.User || mongoose.model("User", userSchema);
export const Session = mongoose.models.Session || mongoose.model("Session", sessionSchema);
export const Job = mongoose.models.Job || mongoose.model("Job", jobSchema);

async function ensureDefaultUser({ email, password, role, name }) {
  const existing = await User.findOne({ email });

  if (existing) {
    return;
  }

  const salt = randomBytes(16).toString("hex");
  await User.create({
    email,
    passwordSalt: salt,
    passwordHash: hashPassword(password, salt),
    role,
    name,
  });
}

async function ensureDefaultUsers() {
  await ensureDefaultUser({
    email: "admin@hiresense.local",
    password: "admin123",
    role: "admin",
    name: "Admin",
  });
  await ensureDefaultUser({
    email: "company@hiresense.local",
    password: "company123",
    role: "company",
    name: "Company",
  });
  await ensureDefaultUser({
    email: "seeker@hiresense.local",
    password: "seeker123",
    role: "job_seeker",
    name: "Job Seeker",
  });
}

export async function connectDatabase() {
  if (!connectionPromise) {
    const uri = getMongoUri();

    if (!uri) {
      throw new Error("MONGODB_URI is required. Add your MongoDB Atlas connection string to server/.env.");
    }

    connectionPromise = mongoose.connect(uri).then(async () => {
      await ensureDefaultUsers();
      return mongoose.connection;
    });
  }

  await connectionPromise;

  return {
    ok: true,
    driver: "mongodb",
    database: mongoose.connection.name,
  };
}

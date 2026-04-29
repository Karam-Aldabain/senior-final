import fs from "fs";
import path from "path";
import multer from "multer";
import { fileURLToPath } from "url";

const uploadsDirectory = fileURLToPath(new URL("../uploads", import.meta.url));

fs.mkdirSync(uploadsDirectory, { recursive: true });

const storage = multer.diskStorage({
  destination(_request, _file, callback) {
    callback(null, uploadsDirectory);
  },
  filename(_request, file, callback) {
    const safeName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, "-");
    callback(null, `${Date.now()}-${safeName}`);
  },
});

function fileFilter(_request, file, callback) {
  const isPdfMime = file.mimetype === "application/pdf";
  const isPdfExtension = path.extname(file.originalname || "").toLowerCase() === ".pdf";

  if (!isPdfMime && !isPdfExtension) {
    const error = new Error("Only PDF files are allowed.");
    error.status = 400;
    callback(error);
    return;
  }

  callback(null, true);
}

export const uploadCvPdf = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 8 * 1024 * 1024,
  },
}).single("cv");


const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const multer = require("multer");

const uploadsDirectory = path.resolve(
  process.env.UPLOADS_DIR || path.resolve(__dirname, "../../uploads"),
);
fs.mkdirSync(uploadsDirectory, { recursive: true });

const storage = multer.diskStorage({
  destination: (_request, _file, callback) => callback(null, uploadsDirectory),
  filename: (_request, file, callback) => {
    const extension = { "image/jpeg": ".jpg", "image/png": ".png", "image/webp": ".webp" }[file.mimetype];
    callback(null, `${Date.now()}-${crypto.randomUUID()}${extension}`);
  },
});

const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp"]);

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024, files: 1 },
  fileFilter: (_request, file, callback) => {
    if (!allowedTypes.has(file.mimetype)) {
      callback(new Error("JPG, PNG वा WEBP तस्बिर मात्र अपलोड गर्न मिल्छ।"));
      return;
    }
    callback(null, true);
  },
});

module.exports = { upload, uploadsDirectory };

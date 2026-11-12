const fs = require("node:fs/promises");
const path = require("node:path");
const { uploadsDirectory } = require("../middleware/upload");

async function removeUploadedImage(imagePath) {
  if (!imagePath || !imagePath.startsWith("/uploads/")) return;
  const filePath = path.join(uploadsDirectory, path.basename(imagePath));
  try {
    await fs.unlink(filePath);
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
}

function uploadedImagePath(file) {
  return file ? `/uploads/${file.filename}` : "";
}

module.exports = { removeUploadedImage, uploadedImagePath };

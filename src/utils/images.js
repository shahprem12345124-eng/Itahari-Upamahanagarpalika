const fs = require("node:fs/promises");
const path = require("node:path");
const mongoose = require("mongoose");
const { getImageBucket, uploadsDirectory } = require("../middleware/upload");

async function removeUploadedImage(imagePath) {
  if (!imagePath) return;
  if (imagePath.startsWith("/api/uploads/")) {
    const imageId = imagePath.slice("/api/uploads/".length);
    if (!mongoose.isValidObjectId(imageId)) return;
    const bucket = getImageBucket();
    const id = new mongoose.Types.ObjectId(imageId);
    const storedFile = await bucket.find({ _id: id }).limit(1).next();
    if (storedFile) await bucket.delete(id);
    return;
  }
  if (!imagePath.startsWith("/uploads/")) return;

  const filePath = path.join(uploadsDirectory, path.basename(imagePath));
  try {
    await fs.unlink(filePath);
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
}

function uploadedImagePath(file) {
  return file?.id ? `/api/uploads/${file.id.toString()}` : "";
}

module.exports = { removeUploadedImage, uploadedImagePath };

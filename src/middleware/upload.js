const path = require("node:path");
const crypto = require("node:crypto");
const multer = require("multer");
const mongoose = require("mongoose");

const uploadsDirectory = path.resolve(
  process.env.UPLOADS_DIR || path.resolve(__dirname, "../../uploads"),
);

const IMAGE_BUCKET_NAME = "portalImages";

function getImageBucket() {
  const database = mongoose.connection.db;
  if (!database) throw new Error("MongoDB must be connected before accessing uploaded images.");
  return new mongoose.mongo.GridFSBucket(database, { bucketName: IMAGE_BUCKET_NAME });
}

const storage = {
  _handleFile(_request, file, callback) {
    const extension = { "image/jpeg": ".jpg", "image/png": ".png", "image/webp": ".webp" }[file.mimetype];
    let uploadStream;
    try {
      uploadStream = getImageBucket().openUploadStream(
        `${Date.now()}-${crypto.randomUUID()}${extension}`,
        { metadata: { contentType: file.mimetype } },
      );
    } catch (error) {
      callback(error);
      return;
    }

    let completed = false;
    const finish = (error, info) => {
      if (completed) return;
      completed = true;
      callback(error, info);
    };
    file.stream.on("error", (error) => uploadStream.destroy(error));
    uploadStream.on("error", (error) => finish(error));
    uploadStream.on("finish", () => finish(null, {
      id: uploadStream.id,
      filename: uploadStream.filename,
      size: uploadStream.length,
    }));
    file.stream.pipe(uploadStream);
  },
  _removeFile(_request, file, callback) {
    if (!file.id) {
      callback(null);
      return;
    }
    const bucket = getImageBucket();
    bucket.find({ _id: file.id }).limit(1).next()
      .then((storedFile) => storedFile ? bucket.delete(file.id) : undefined)
      .then(() => callback(null), callback);
  },
};

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

module.exports = { getImageBucket, upload, uploadsDirectory };

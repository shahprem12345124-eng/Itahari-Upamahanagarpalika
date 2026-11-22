const express = require("express");
const mongoose = require("mongoose");
const { getImageBucket } = require("../middleware/upload");

const router = express.Router();

router.get("/:id", async (request, response, next) => {
  if (!mongoose.isValidObjectId(request.params.id)) {
    return response.status(404).json({ message: "Image not found." });
  }

  const id = new mongoose.Types.ObjectId(request.params.id);
  const bucket = getImageBucket();
  const file = await bucket.find({ _id: id }).limit(1).next();
  if (!file) return response.status(404).json({ message: "Image not found." });

  response.set("Content-Type", file.metadata?.contentType || "application/octet-stream");
  response.set("Cache-Control", "public, max-age=31536000, immutable");
  response.set("X-Content-Type-Options", "nosniff");

  const stream = bucket.openDownloadStream(id);
  stream.on("error", (error) => {
    if (response.headersSent) {
      response.destroy(error);
      return;
    }
    next(error);
  });
  stream.pipe(response);
});

module.exports = router;

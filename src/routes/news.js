const express = require("express");
const mongoose = require("mongoose");
const News = require("../models/News");
const { upload } = require("../middleware/upload");
const { requireAdmin } = require("../middleware/requireAdmin");
const { removeUploadedImage, uploadedImagePath } = require("../utils/images");

const router = express.Router();

router.get("/", async (_request, response) => {
  const data = await News.find().sort({ createdAt: -1 }).lean();
  response.json({ data });
});

router.get("/:id", async (request, response) => {
  if (!mongoose.isValidObjectId(request.params.id)) {
    return response.status(400).json({ message: "समाचार पहिचान मान्य छैन।" });
  }
  const data = await News.findById(request.params.id).lean();
  if (!data) return response.status(404).json({ message: "समाचार भेटिएन।" });
  response.json({ data });
});

router.post("/", requireAdmin, upload.single("image"), async (request, response) => {
  const data = new News({
    title: request.body.title,
    titleEn: request.body.titleEn,
    category: request.body.category,
    summary: request.body.summary,
    summaryEn: request.body.summaryEn,
    content: request.body.content,
    contentEn: request.body.contentEn,
    image: uploadedImagePath(request.file),
    isNotice: request.body.isNotice === "true" || request.body.isNotice === true,
  });
  try {
    await data.save();
  } catch (error) {
    await removeUploadedImage(data.image);
    throw error;
  }
  response.status(201).json({ data });
});

router.put("/:id", requireAdmin, upload.single("image"), async (request, response) => {
  if (!mongoose.isValidObjectId(request.params.id)) {
    await removeUploadedImage(uploadedImagePath(request.file));
    return response.status(400).json({ message: "समाचार पहिचान मान्य छैन।" });
  }
  const news = await News.findById(request.params.id);
  if (!news) {
    await removeUploadedImage(uploadedImagePath(request.file));
    return response.status(404).json({ message: "समाचार भेटिएन।" });
  }

  const oldImage = news.image;
  for (const field of ["title", "titleEn", "category", "summary", "summaryEn", "content", "contentEn"]) {
    if (request.body[field] !== undefined) news[field] = request.body[field];
  }
  if (request.body.isNotice !== undefined) {
    news.isNotice = request.body.isNotice === "true" || request.body.isNotice === true;
  }
  if (request.file) news.image = uploadedImagePath(request.file);
  try {
    await news.save();
  } catch (error) {
    await removeUploadedImage(uploadedImagePath(request.file));
    throw error;
  }
  if (request.file) await removeUploadedImage(oldImage);
  response.json({ data: news });
});

router.delete("/:id", requireAdmin, async (request, response) => {
  if (!mongoose.isValidObjectId(request.params.id)) {
    return response.status(400).json({ message: "समाचार पहिचान मान्य छैन।" });
  }
  const news = await News.findByIdAndDelete(request.params.id);
  if (!news) return response.status(404).json({ message: "समाचार भेटिएन।" });
  await removeUploadedImage(news.image);
  response.json({ message: "समाचार हटाइयो।" });
});

module.exports = router;

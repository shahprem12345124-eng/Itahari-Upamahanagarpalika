const express = require("express");
const Setting = require("../models/Setting");
const { upload } = require("../middleware/upload");
const { requireAdmin } = require("../middleware/requireAdmin");
const { removeUploadedImage, uploadedImagePath } = require("../utils/images");

const router = express.Router();

router.get("/", async (_request, response) => {
  const data = await Setting.findOne({ key: "main" }).lean();
  response.json({ data: data || { mayorImage: "" } });
});

router.put("/mayor-profile", requireAdmin, async (request, response) => {
  const fields = [
    "mayorName",
    "mayorTitle",
    "mayorBio",
    "mayorContact",
    "mayorNameEn",
    "mayorTitleEn",
    "mayorBioEn",
    "mayorContactEn",
  ];
  const limits = { mayorBio: 2000, mayorBioEn: 2000, mayorContact: 200, mayorContactEn: 200 };
  const profile = {};

  for (const field of fields) {
    const value = request.body?.[field];
    if (typeof value !== "string") {
      return response.status(400).json({ message: `${field} must be a string.` });
    }
    const trimmed = value.trim();
    if (trimmed.length > (limits[field] || 200)) {
      return response.status(400).json({ message: `${field} exceeds the maximum length.` });
    }
    profile[field] = trimmed;
  }

  const setting = await Setting.findOneAndUpdate(
    { key: "main" },
    { $set: profile, $setOnInsert: { key: "main" } },
    { new: true, upsert: true, runValidators: true },
  );
  response.json({ data: setting });
});

router.put("/running-programs", requireAdmin, async (request, response) => {
  if (!Array.isArray(request.body?.programs)) {
    return response.status(400).json({ message: "चलिरहेको कार्यक्रमको सूची मान्य छैन।" });
  }

  const programs = request.body.programs.slice(0, 12).map((program) => ({
    title: typeof program.title === "string" ? program.title.trim() : "",
    titleEn: typeof program.titleEn === "string" ? program.titleEn.trim() : "",
    detail: typeof program.detail === "string" ? program.detail.trim() : "",
    detailEn: typeof program.detailEn === "string" ? program.detailEn.trim() : "",
  })).filter((program) => program.title);

  if (programs.some((program) =>
    program.title.length > 180 ||
    program.titleEn.length > 180 ||
    program.detail.length > 500 ||
    program.detailEn.length > 500
  )) {
    return response.status(400).json({ message: "कार्यक्रमको विवरण धेरै लामो छ।" });
  }

  const setting = await Setting.findOneAndUpdate(
    { key: "main" },
    { $set: { currentPrograms: programs }, $setOnInsert: { key: "main" } },
    { new: true, upsert: true, runValidators: true },
  );
  response.json({ data: setting });
});

router.put("/mayor-image", requireAdmin, upload.single("image"), async (request, response) => {
  if (!request.file) {
    return response.status(400).json({ message: "अपलोड गर्न तस्बिर छान्नुहोस्।" });
  }
  const previous = await Setting.findOne({ key: "main" }).lean();
  let setting;
  try {
    setting = await Setting.findOneAndUpdate(
      { key: "main" },
      { $set: { mayorImage: uploadedImagePath(request.file) }, $setOnInsert: { key: "main" } },
      { new: true, upsert: true, runValidators: true },
    );
  } catch (error) {
    await removeUploadedImage(uploadedImagePath(request.file));
    throw error;
  }
  if (previous?.mayorImage && previous.mayorImage !== setting.mayorImage) {
    await removeUploadedImage(previous.mayorImage);
  }
  response.json({ data: setting });
});

module.exports = router;

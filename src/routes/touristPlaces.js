const express = require("express");
const mongoose = require("mongoose");
const TouristPlace = require("../models/TouristPlace");
const { upload } = require("../middleware/upload");
const { requireAdmin } = require("../middleware/requireAdmin");
const { removeUploadedImage, uploadedImagePath } = require("../utils/images");

const router = express.Router();
const editableFields = ["name", "nameEn", "description", "descriptionEn", "address", "addressEn"];

router.get("/", async (_request, response) => {
  const data = await TouristPlace.find().sort({ createdAt: -1 }).lean();
  response.json({ data });
});

router.post("/", requireAdmin, upload.single("image"), async (request, response) => {
  const data = new TouristPlace({
    ...Object.fromEntries(editableFields.map((field) => [field, request.body[field]])),
    image: uploadedImagePath(request.file),
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
    return response.status(400).json({ message: "पर्यटन स्थलको पहिचान मान्य छैन।" });
  }
  const place = await TouristPlace.findById(request.params.id);
  if (!place) {
    await removeUploadedImage(uploadedImagePath(request.file));
    return response.status(404).json({ message: "पर्यटन स्थल भेटिएन।" });
  }

  const oldImage = place.image;
  for (const field of editableFields) {
    if (request.body[field] !== undefined) place[field] = request.body[field];
  }
  if (request.file) place.image = uploadedImagePath(request.file);
  try {
    await place.save();
  } catch (error) {
    await removeUploadedImage(uploadedImagePath(request.file));
    throw error;
  }
  if (request.file) await removeUploadedImage(oldImage);
  response.json({ data: place });
});

router.delete("/:id", requireAdmin, async (request, response) => {
  if (!mongoose.isValidObjectId(request.params.id)) {
    return response.status(400).json({ message: "पर्यटन स्थलको पहिचान मान्य छैन।" });
  }
  const place = await TouristPlace.findByIdAndDelete(request.params.id);
  if (!place) return response.status(404).json({ message: "पर्यटन स्थल भेटिएन।" });
  await removeUploadedImage(place.image);
  response.json({ message: "पर्यटन स्थल हटाइयो।" });
});

module.exports = router;

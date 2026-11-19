const express = require("express");
const mongoose = require("mongoose");
const Complaint = require("../models/Complaint");
const { requireAdmin } = require("../middleware/requireAdmin");
const { upload } = require("../middleware/upload");
const { removeUploadedImage, uploadedImagePath } = require("../utils/images");

const router = express.Router();

router.get("/", requireAdmin, async (_request, response) => {
  const data = await Complaint.find().sort({ createdAt: -1 }).lean();
  response.json({ data });
});

router.get("/:id", requireAdmin, async (request, response) => {
  if (!mongoose.isValidObjectId(request.params.id)) {
    return response.status(400).json({ message: "गुनासो पहिचान मान्य छैन।" });
  }
  const data = await Complaint.findById(request.params.id).lean();
  if (!data) return response.status(404).json({ message: "गुनासो भेटिएन।" });
  response.json({ data });
});

router.post("/", upload.single("image"), async (request, response) => {
  const locationFields = ["latitude", "longitude", "accuracy"];
  const hasLocation = locationFields.some((field) => Object.prototype.hasOwnProperty.call(request.body, field));
  let location;
  if (hasLocation) {
    const { latitude: latitudeValue, longitude: longitudeValue, accuracy: accuracyValue } = request.body;
    const latitude = Number(latitudeValue);
    const longitude = Number(longitudeValue);
    const accuracy = accuracyValue === undefined || accuracyValue === "" ? undefined : Number(accuracyValue);
    if (
      typeof latitudeValue !== "string"
      || latitudeValue.trim() === ""
      || typeof longitudeValue !== "string"
      || longitudeValue.trim() === ""
      || !Number.isFinite(latitude)
      || latitude < -90
      || latitude > 90
      || !Number.isFinite(longitude)
      || longitude < -180
      || longitude > 180
      || (accuracy !== undefined && (!Number.isFinite(accuracy) || accuracy < 0))
    ) {
      await removeUploadedImage(uploadedImagePath(request.file));
      return response.status(400).json({ message: "स्थान विवरण मान्य छैन।" });
    }
    location = { latitude, longitude, ...(accuracy !== undefined ? { accuracy } : {}) };
  }

  const data = new Complaint({
    fullName: request.body.fullName,
    phone: request.body.phone,
    ward: request.body.ward,
    department: request.body.department,
    details: request.body.details,
    image: uploadedImagePath(request.file),
    ...(location ? { location } : {}),
  });
  try {
    await data.save();
  } catch (error) {
    await removeUploadedImage(data.image);
    throw error;
  }
  response.status(201).json({ data });
});

router.delete("/:id", requireAdmin, async (request, response) => {
  if (!mongoose.isValidObjectId(request.params.id)) {
    return response.status(400).json({ message: "गुनासो पहिचान मान्य छैन।" });
  }
  const complaint = await Complaint.findByIdAndDelete(request.params.id);
  if (!complaint) return response.status(404).json({ message: "गुनासो भेटिएन।" });
  await removeUploadedImage(complaint.image);
  response.json({ message: "गुनासो हटाइयो।" });
});

module.exports = router;

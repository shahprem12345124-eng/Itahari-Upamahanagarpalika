const mongoose = require("mongoose");

const complaintLocationSchema = new mongoose.Schema(
  {
    latitude: { type: Number, required: true, min: -90, max: 90 },
    longitude: { type: Number, required: true, min: -180, max: 180 },
    accuracy: { type: Number, min: 0 },
  },
  { _id: false },
);

const complaintSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true, maxlength: 100 },
    phone: { type: String, required: true, trim: true, maxlength: 20 },
    ward: { type: String, required: true, trim: true, maxlength: 30 },
    department: { type: String, required: true, trim: true, maxlength: 100 },
    details: { type: String, required: true, trim: true, minlength: 10, maxlength: 3000 },
    image: { type: String, default: "" },
    status: {
      type: String,
      enum: ["pending", "completed", "cancelled"],
      default: "pending",
    },
    location: { type: complaintLocationSchema, default: undefined },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Complaint", complaintSchema);

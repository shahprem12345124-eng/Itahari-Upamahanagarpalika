const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true, maxlength: 100 },
    phone: { type: String, required: true, trim: true, maxlength: 20 },
    ward: { type: String, required: true, trim: true, maxlength: 30 },
    department: { type: String, required: true, trim: true, maxlength: 100 },
    details: { type: String, required: true, trim: true, minlength: 10, maxlength: 3000 },
    image: { type: String, default: "" },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Complaint", complaintSchema);

const mongoose = require("mongoose");

const touristPlaceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 180 },
    nameEn: { type: String, trim: true, maxlength: 180, default: "" },
    description: { type: String, required: true, trim: true, maxlength: 4000 },
    descriptionEn: { type: String, trim: true, maxlength: 4000, default: "" },
    address: { type: String, trim: true, maxlength: 300, default: "" },
    addressEn: { type: String, trim: true, maxlength: 300, default: "" },
    image: { type: String, default: "" },
  },
  { timestamps: true },
);

module.exports = mongoose.model("TouristPlace", touristPlaceSchema);

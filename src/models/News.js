const mongoose = require("mongoose");

const newsSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 180 },
    titleEn: { type: String, trim: true, maxlength: 180, default: "" },
    category: {
      type: String,
      required: true,
      enum: ["सूचना", "नगर समाचार", "सेवा जानकारी"],
    },
    summary: { type: String, required: true, trim: true, maxlength: 500 },
    summaryEn: { type: String, trim: true, maxlength: 500, default: "" },
    content: { type: String, trim: true, maxlength: 8000, default: "" },
    contentEn: { type: String, trim: true, maxlength: 8000, default: "" },
    image: { type: String, default: "" },
    isNotice: { type: Boolean, default: false },
  },
  { timestamps: true },
);

module.exports = mongoose.model("News", newsSchema);

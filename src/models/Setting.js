const mongoose = require("mongoose");

const settingSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true, default: "main" },
    mayorImage: { type: String, default: "" },
    mayorName: { type: String, trim: true, default: "" },
    mayorTitle: { type: String, trim: true, default: "" },
    mayorBio: { type: String, trim: true, maxlength: 2000, default: "" },
    mayorContact: { type: String, trim: true, maxlength: 200, default: "" },
    mayorNameEn: { type: String, trim: true, default: "" },
    mayorTitleEn: { type: String, trim: true, default: "" },
    mayorBioEn: { type: String, trim: true, maxlength: 2000, default: "" },
    mayorContactEn: { type: String, trim: true, maxlength: 200, default: "" },
    currentPrograms: {
      type: [
        {
          title: { type: String, required: true, trim: true, maxlength: 180 },
          titleEn: { type: String, trim: true, maxlength: 180, default: "" },
          detail: { type: String, trim: true, maxlength: 500, default: "" },
          detailEn: { type: String, trim: true, maxlength: 500, default: "" },
        },
      ],
      default: [],
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Setting", settingSchema);

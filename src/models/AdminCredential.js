const mongoose = require("mongoose");

const adminCredentialSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true, default: "main" },
    passwordHash: { type: String, required: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model("AdminCredential", adminCredentialSchema);

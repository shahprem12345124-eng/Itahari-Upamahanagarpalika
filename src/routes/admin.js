const express = require("express");
const AdminCredential = require("../models/AdminCredential");
const { requireAdmin } = require("../middleware/requireAdmin");
const {
  constantTimeStringEqual,
  createAdminToken,
  getAdminTokenSecret,
  hashAdminPassword,
  verifyAdminPassword,
} = require("../utils/adminCredentials");

const router = express.Router();

router.post("/verify", async (request, response) => {
  const provided = request.body?.password;

  if (!await getAdminTokenSecret()) {
    return response.status(503).json({ message: "ADMIN_PASSWORD सेट गरिएको छैन। server/.env मा पासफ्रेज राख्नुहोस्।" });
  }
  if (typeof provided !== "string") {
    return response.status(400).json({ message: "पासफ्रेज प्रविष्ट गर्नुहोस्।" });
  }

  const signingSecret = await verifyAdminPassword(provided);
  if (!signingSecret) return response.status(401).json({ message: "पासफ्रेज मिलेन। पुनः प्रयास गर्नुहोस्।" });
  response.json({ ok: true, token: createAdminToken(signingSecret) });
});

router.put("/change-password", requireAdmin, async (request, response) => {
  const { currentPassword, changeSecret, newPassword } = request.body || {};
  if (
    typeof currentPassword !== "string"
    || typeof changeSecret !== "string"
    || typeof newPassword !== "string"
  ) {
    return response.status(400).json({ message: "हालको पासफ्रेज, परिवर्तन गोप्य संकेत र नयाँ पासफ्रेज प्रविष्ट गर्नुहोस्।" });
  }

  const configuredChangeSecret = process.env.ADMIN_PASSWORD_CHANGE_SECRET;
  if (!configuredChangeSecret) {
    return response.status(503).json({ message: "ADMIN_PASSWORD_CHANGE_SECRET is not configured." });
  }

  if (!await verifyAdminPassword(currentPassword)) {
    return response.status(401).json({ message: "हालको पासफ्रेज मिलेन।" });
  }
  if (!constantTimeStringEqual(changeSecret, configuredChangeSecret)) {
    return response.status(401).json({ message: "परिवर्तन गोप्य संकेत मिलेन।" });
  }
  if (newPassword.length < 12 || newPassword.length > 256) {
    return response.status(400).json({ message: "नयाँ पासफ्रेज १२ देखि २५६ वर्णको हुनुपर्छ।" });
  }
  if (newPassword === currentPassword) {
    return response.status(400).json({ message: "नयाँ पासफ्रेज हालको पासफ्रेजभन्दा फरक हुनुपर्छ।" });
  }

  const passwordHash = await hashAdminPassword(newPassword);
  await AdminCredential.findOneAndUpdate(
    { key: "main" },
    { $set: { passwordHash }, $setOnInsert: { key: "main" } },
    { new: true, upsert: true, runValidators: true },
  );
  response.json({ message: "पासफ्रेज परिवर्तन भयो। नयाँ पासफ्रेजले पुनः प्रवेश गर्नुहोस्।" });
});

module.exports = router;

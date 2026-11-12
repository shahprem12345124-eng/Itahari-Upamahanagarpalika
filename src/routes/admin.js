const crypto = require("node:crypto");
const express = require("express");
const { createAdminToken } = require("../middleware/requireAdmin");

const router = express.Router();

router.post("/verify", (request, response) => {
  const expected = process.env.ADMIN_PASSWORD;
  const provided = request.body?.password;

  if (!expected) {
    return response.status(503).json({ message: "ADMIN_PASSWORD सेट गरिएको छैन। server/.env मा पासफ्रेज राख्नुहोस्।" });
  }
  if (typeof provided !== "string") {
    return response.status(400).json({ message: "पासफ्रेज प्रविष्ट गर्नुहोस्।" });
  }

  const expectedBuffer = Buffer.from(expected);
  const providedBuffer = Buffer.from(provided);
  const isMatch = expectedBuffer.length === providedBuffer.length
    && crypto.timingSafeEqual(expectedBuffer, providedBuffer);

  if (!isMatch) return response.status(401).json({ message: "पासफ्रेज मिलेन। पुनः प्रयास गर्नुहोस्।" });
  response.json({ ok: true, token: createAdminToken(expected) });
});

module.exports = router;

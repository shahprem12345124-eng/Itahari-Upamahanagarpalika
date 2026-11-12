const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const { uploadsDirectory } = require("./middleware/upload");
const adminRoutes = require("./routes/admin");
const complaintRoutes = require("./routes/complaints");
const newsRoutes = require("./routes/news");
const settingsRoutes = require("./routes/settings");

const app = express();
const allowedOrigins = (process.env.CLIENT_ORIGIN || "http://localhost:3000")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean)
  .map((origin) => new URL(
    /^https?:\/\//i.test(origin) ? origin : `https://${origin}`,
  ).origin);

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error("यो origin बाट API अनुरोध अनुमति छैन।"));
  },
}));
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: false, limit: "1mb" }));
app.use("/uploads", express.static(uploadsDirectory));

app.get("/api/health", (_request, response) => {
  response.json({ ok: true, database: mongoose.connection.readyState === 1 ? "connected" : "disconnected" });
});
app.use("/api/admin", adminRoutes);
app.use("/api/news", newsRoutes);
app.use("/api/complaints", complaintRoutes);
app.use("/api/settings", settingsRoutes);

app.use((_request, response) => response.status(404).json({ message: "अनुरोध गरिएको API भेटिएन।" }));

app.use((error, _request, response, _next) => {
  console.error(error);
  if (error.name === "ValidationError") {
    return response.status(400).json({ message: Object.values(error.errors).map((item) => item.message).join(" ") });
  }
  if (error.name === "MulterError") {
    const status = error.code === "LIMIT_FILE_SIZE" ? 413 : 400;
    const message = error.code === "LIMIT_FILE_SIZE" ? "तस्बिरको आकार ५ MB भन्दा कम हुनुपर्छ।" : error.message;
    return response.status(status).json({ message });
  }
  if (error.message === "JPG, PNG वा WEBP तस्बिर मात्र अपलोड गर्न मिल्छ।") {
    return response.status(400).json({ message: error.message });
  }
  if (error.message === "यो origin बाट API अनुरोध अनुमति छैन।") {
    return response.status(403).json({ message: error.message });
  }
  response.status(500).json({ message: "सर्भरमा समस्या आयो। कृपया पुनः प्रयास गर्नुहोस्।" });
});

module.exports = app;

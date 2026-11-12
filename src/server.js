require("dotenv").config();

const mongoose = require("mongoose");
const app = require("./app");

const port = Number(process.env.PORT) || 5000;
const mongoUri = process.env.MONGODB_URI;

if (!mongoUri) {
  console.error("MONGODB_URI सेट गरिएको छैन। server/.env मा MongoDB connection string राख्नुहोस्।");
  process.exit(1);
}

mongoose.connect(mongoUri)
  .then(() => {
    app.listen(port, () => {
      console.log(`Itahari citizen API listening at http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  });

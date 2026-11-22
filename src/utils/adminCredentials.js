const crypto = require("node:crypto");
const { promisify } = require("node:util");
const AdminCredential = require("../models/AdminCredential");

const scrypt = promisify(crypto.scrypt);
const PASSWORD_HASH_LENGTH = 64;

function createAdminToken(signingSecret) {
  const issuedAt = Math.floor(Date.now() / 1000).toString();
  const signature = crypto.createHmac("sha256", signingSecret).update(issuedAt).digest("hex");
  return `${issuedAt}.${signature}`;
}

function constantTimeStringEqual(first, second) {
  const firstBuffer = Buffer.from(first);
  const secondBuffer = Buffer.from(second);
  return firstBuffer.length === secondBuffer.length && crypto.timingSafeEqual(firstBuffer, secondBuffer);
}

async function getAdminTokenSecret() {
  const credential = await AdminCredential.findOne({ key: "main" }).select("passwordHash").lean();
  return credential?.passwordHash || process.env.ADMIN_PASSWORD || "";
}

async function verifyStoredPassword(password, passwordHash) {
  const [algorithm, saltHex, hashHex] = passwordHash.split("$");
  if (
    algorithm !== "scrypt"
    || !/^[a-f0-9]{32}$/.test(saltHex || "")
    || !/^[a-f0-9]{128}$/.test(hashHex || "")
  ) {
    throw new Error("Stored admin password hash is invalid.");
  }

  const salt = Buffer.from(saltHex, "hex");
  const expected = Buffer.from(hashHex, "hex");
  const actual = await scrypt(password, salt, PASSWORD_HASH_LENGTH);
  return crypto.timingSafeEqual(actual, expected);
}

async function verifyAdminPassword(password) {
  if (typeof password !== "string") return null;
  const credential = await AdminCredential.findOne({ key: "main" }).select("passwordHash").lean();
  if (credential) {
    return await verifyStoredPassword(password, credential.passwordHash)
      ? credential.passwordHash
      : null;
  }

  const bootstrapPassword = process.env.ADMIN_PASSWORD;
  if (!bootstrapPassword) return null;
  return constantTimeStringEqual(password, bootstrapPassword) ? bootstrapPassword : null;
}

async function hashAdminPassword(password) {
  const salt = crypto.randomBytes(16);
  const hash = await scrypt(password, salt, PASSWORD_HASH_LENGTH);
  return `scrypt$${salt.toString("hex")}$${hash.toString("hex")}`;
}

module.exports = {
  constantTimeStringEqual,
  createAdminToken,
  getAdminTokenSecret,
  hashAdminPassword,
  verifyAdminPassword,
};

const crypto = require("node:crypto");

const TOKEN_LIFETIME_SECONDS = 8 * 60 * 60;

function createAdminToken(password) {
  const issuedAt = Math.floor(Date.now() / 1000).toString();
  const signature = crypto.createHmac("sha256", password).update(issuedAt).digest("hex");
  return `${issuedAt}.${signature}`;
}

function requireAdmin(request, response, next) {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) {
    return response.status(503).json({ message: "ADMIN_PASSWORD is not configured." });
  }

  const authorization = request.get("authorization") || "";
  const [scheme, token] = authorization.split(" ");
  const [issuedAt, signature] = token?.split(".") || [];
  if (scheme !== "Bearer" || !/^\d+$/.test(issuedAt || "") || !/^[a-f0-9]{64}$/.test(signature || "")) {
    return response.status(401).json({ message: "Administrator sign-in is required." });
  }

  const timestamp = Number(issuedAt);
  const now = Math.floor(Date.now() / 1000);
  if (timestamp > now + 60 || now - timestamp > TOKEN_LIFETIME_SECONDS) {
    return response.status(401).json({ message: "Administrator session has expired. Sign in again." });
  }

  const expected = crypto.createHmac("sha256", password).update(issuedAt).digest();
  const provided = Buffer.from(signature, "hex");
  if (!crypto.timingSafeEqual(expected, provided)) {
    return response.status(401).json({ message: "Administrator sign-in is required." });
  }
  next();
}

module.exports = { createAdminToken, requireAdmin };

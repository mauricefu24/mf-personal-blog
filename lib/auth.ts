import crypto from "crypto";

export const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "admin@example.com";
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "changeme";
export const ADMIN_COOKIE_NAME = "admin-token";

export const ADMIN_TOKEN = crypto
  .createHash("sha256")
  .update(`${ADMIN_EMAIL}:${ADMIN_PASSWORD}`)
  .digest("hex");

export function verifyAdminCookie(token: string | undefined) {
  return token === ADMIN_TOKEN;
}

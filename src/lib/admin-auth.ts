import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const ADMIN_COOKIE = "atlas_admin_session";
const SESSION_SECONDS = 60 * 60 * 12;

export function adminConfigured() {
  return Boolean(
    process.env.ADMIN_USERNAME &&
    process.env.ADMIN_PASSWORD &&
    process.env.ADMIN_SESSION_SECRET &&
    process.env.ADMIN_SESSION_SECRET.length >= 32,
  );
}

export function verifyAdminCredentials(username: string, password: string) {
  if (!adminConfigured()) return false;
  const usernameOk = safeEqual(username, process.env.ADMIN_USERNAME!);
  const passwordOk = safeEqual(password, process.env.ADMIN_PASSWORD!);
  return usernameOk && passwordOk;
}

function safeEqual(value: string, expected: string) {
  const left = Buffer.from(value);
  const right = Buffer.from(expected);
  return left.length === right.length && timingSafeEqual(left, right);
}

function signature(expiresAt: string) {
  return createHmac("sha256", process.env.ADMIN_SESSION_SECRET!)
    .update(expiresAt)
    .digest("hex");
}

export function createAdminSession() {
  const expiresAt = String(Date.now() + SESSION_SECONDS * 1000);
  return {
    value: `${expiresAt}.${signature(expiresAt)}`,
    maxAge: SESSION_SECONDS,
  };
}

export function validAdminSession(value?: string) {
  if (!value || !adminConfigured()) return false;
  const [expiresAt, provided] = value.split(".");
  if (!expiresAt || !provided || Number(expiresAt) < Date.now()) return false;
  return safeEqual(provided, signature(expiresAt));
}

export async function isAdmin() {
  const jar = await cookies();
  return validAdminSession(jar.get(ADMIN_COOKIE)?.value);
}

export function cookieOptions(maxAge: number) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
    path: "/",
    maxAge,
  };
}

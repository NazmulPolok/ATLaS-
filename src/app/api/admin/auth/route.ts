import { NextRequest, NextResponse } from "next/server";
import {
  ADMIN_COOKIE,
  cookieOptions,
  createAdminSession,
  isAdmin,
  verifyAdminCredentials,
} from "@/lib/admin-auth";

export const runtime = "nodejs";
const failedLogins = new Map<string, number[]>();

function sameOrigin(request: NextRequest) {
  return request.headers.get("origin") === new URL(request.url).origin;
}

export async function POST(request: NextRequest) {
  if (!sameOrigin(request))
    return NextResponse.json({ error: "Request rejected." }, { status: 403 });
  if (
    !process.env.ADMIN_USERNAME ||
    !process.env.ADMIN_PASSWORD ||
    !process.env.ADMIN_SESSION_SECRET ||
    process.env.ADMIN_SESSION_SECRET.length < 32
  )
    return NextResponse.json(
      {
        error:
          "Admin login is not configured. Add the admin settings to .env.local and restart the site.",
      },
      { status: 503 },
    );
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const now = Date.now();
  const attempts = (failedLogins.get(ip) || []).filter(
    (time) => now - time < 15 * 60 * 1000,
  );
  if (attempts.length >= 8)
    return NextResponse.json(
      { error: "Too many login attempts. Wait 15 minutes and try again." },
      { status: 429 },
    );
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Enter a username and password." },
      { status: 400 },
    );
  }
  const { username, password } = (
    body && typeof body === "object" ? body : {}
  ) as { username?: unknown; password?: unknown };
  if (
    typeof username !== "string" ||
    typeof password !== "string" ||
    username.length > 120 ||
    password.length > 300 ||
    !verifyAdminCredentials(username, password)
  ) {
    attempts.push(now);
    failedLogins.set(ip, attempts);
    return NextResponse.json(
      { error: "The username or password is incorrect." },
      { status: 401 },
    );
  }
  failedLogins.delete(ip);
  const session = createAdminSession();
  const response = NextResponse.json({ message: "Signed in." });
  response.cookies.set(
    ADMIN_COOKIE,
    session.value,
    cookieOptions(session.maxAge),
  );
  return response;
}

export async function DELETE(request: NextRequest) {
  if (!sameOrigin(request) || !(await isAdmin()))
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  const response = NextResponse.json({ message: "Signed out." });
  response.cookies.set(ADMIN_COOKIE, "", cookieOptions(0));
  return response;
}

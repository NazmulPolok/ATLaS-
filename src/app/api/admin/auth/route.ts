import { NextRequest, NextResponse } from "next/server";
import {
  ADMIN_COOKIE,
  cookieOptions,
  createAdminSession,
  isAdmin,
  verifyAdminCredentials,
} from "@/lib/admin-auth";
import {
  clientAddress,
  consumeRateLimit,
  readLimitedJson,
  RequestBodyTooLargeError,
} from "@/lib/request-security";

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
  const ip = clientAddress(request.headers);
  const now = Date.now();
  if (!consumeRateLimit(failedLogins, ip, now, 15 * 60 * 1000, 8))
    return NextResponse.json(
      { error: "Too many login attempts. Wait 15 minutes and try again." },
      { status: 429 },
    );
  let body: unknown;
  try {
    body = await readLimitedJson(request, 4_096);
  } catch (error) {
    if (error instanceof RequestBodyTooLargeError)
      return NextResponse.json(
        { error: "Request body is too large." },
        { status: 413 },
      );
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

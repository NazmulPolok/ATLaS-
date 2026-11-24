import { NextRequest, NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin-auth";
import {
  deleteInquiry,
  listInquiries,
  markInquiryRead,
} from "@/lib/admin-store";
import {
  readLimitedJson,
  RequestBodyTooLargeError,
} from "@/lib/request-security";

export const runtime = "nodejs";

export async function GET() {
  if (!(await isAdmin()))
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  return NextResponse.json({ inquiries: await listInquiries() });
}

export async function PATCH(request: NextRequest) {
  if (
    request.headers.get("origin") !== new URL(request.url).origin ||
    !(await isAdmin())
  )
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  let body: unknown;
  try {
    body = await readLimitedJson(request, 4_096);
  } catch (error) {
    return NextResponse.json(
      { error: "Inquiry details are required." },
      { status: error instanceof RequestBodyTooLargeError ? 413 : 400 },
    );
  }
  const { id, isRead } = (
    body && typeof body === "object" ? body : {}
  ) as { id?: unknown; isRead?: unknown };
  if (!Number.isInteger(id) || Number(id) < 1 || typeof isRead !== "boolean")
    return NextResponse.json(
      { error: "Inquiry details are invalid." },
      { status: 400 },
    );
  await markInquiryRead(Number(id), isRead);
  return NextResponse.json({ message: "Inquiry updated." });
}

export async function DELETE(request: NextRequest) {
  if (
    request.headers.get("origin") !== new URL(request.url).origin ||
    !(await isAdmin())
  )
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  let body: unknown;
  try {
    body = await readLimitedJson(request, 4_096);
  } catch (error) {
    return NextResponse.json(
      { error: "Inquiry id is required." },
      { status: error instanceof RequestBodyTooLargeError ? 413 : 400 },
    );
  }
  const id = Number((body as { id?: unknown })?.id);
  if (!Number.isInteger(id) || id < 1)
    return NextResponse.json(
      { error: "Inquiry id is invalid." },
      { status: 400 },
    );
  if (!(await deleteInquiry(id)))
    return NextResponse.json({ error: "Inquiry not found." }, { status: 404 });
  return NextResponse.json({ message: "Inquiry deleted." });
}

import { NextRequest, NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin-auth";
import { getStoredImage } from "@/lib/admin-store";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const id = Number(new URL(request.url).searchParams.get("id"));
  if (!Number.isInteger(id) || id < 1)
    return new NextResponse("Not found", { status: 404 });
  const image = getStoredImage(id);
  if (!image) return new NextResponse("Not found", { status: 404 });
  if (!image.published && !(await isAdmin()))
    return new NextResponse("Not found", { status: 404 });
  return new NextResponse(new Uint8Array(image.data), {
    headers: {
      "Content-Type": image.mimeType,
      "Content-Length": String(image.data.byteLength),
      "Cache-Control": image.published
        ? "public, max-age=3600, stale-while-revalidate=86400"
        : "private, no-store",
      "X-Content-Type-Options": "nosniff",
      "Content-Disposition": "inline",
    },
  });
}

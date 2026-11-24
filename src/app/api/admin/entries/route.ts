import { NextRequest, NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin-auth";
import {
  createEntry,
  deleteEntry,
  listEntries,
  updateEntry,
  type UploadedImage,
} from "@/lib/admin-store";
import { entrySchema } from "@/lib/admin-entry-schema";
import {
  readLimitedBody,
  readLimitedJson,
  RequestBodyTooLargeError,
} from "@/lib/request-security";

export const runtime = "nodejs";
const MAX_IMAGES = 5;
const MAX_FILE_BYTES = 5 * 1024 * 1024;
const MAX_TOTAL_BYTES = 20 * 1024 * 1024;
const allowedTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

function matchesImageType(type: string, data: Buffer) {
  if (type === "image/jpeg")
    return (
      data.length >= 3 &&
      data[0] === 0xff &&
      data[1] === 0xd8 &&
      data[2] === 0xff
    );
  if (type === "image/png")
    return data
      .subarray(0, 8)
      .equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
  if (type === "image/gif")
    return (
      data
        .subarray(0, 6)
        .toString("ascii")
        .match(/^GIF8[79]a$/) !== null
    );
  if (type === "image/webp")
    return (
      data.length >= 12 &&
      data.toString("ascii", 0, 4) === "RIFF" &&
      data.toString("ascii", 8, 12) === "WEBP"
    );
  return false;
}

function rejectOrigin(request: NextRequest) {
  return request.headers.get("origin") !== new URL(request.url).origin;
}

async function readSubmission(request: NextRequest) {
  const body = await readLimitedBody(request, MAX_TOTAL_BYTES + 512_000);
  const headers = new Headers(request.headers);
  headers.delete("content-length");
  headers.delete("transfer-encoding");
  const boundedRequest = new Request(request.url, {
    method: request.method,
    headers,
    body: new Blob([body]),
  });
  let form: FormData;
  try {
    form = await boundedRequest.formData();
  } catch {
    throw new Error("The upload form is invalid. Reload and try again.");
  }
  const raw = {
    kind: form.get("kind"),
    title: form.get("title"),
    category: form.get("category"),
    summary: form.get("summary"),
    description: form.get("description"),
    imageUrl: form.get("imageUrl") || "",
    linkUrl: form.get("linkUrl") || "",
    published: form.get("published") === "true",
  };
  const parsed = entrySchema.safeParse(raw);
  if (!parsed.success)
    throw new Error("Check the required fields and project URL.");

  const fileFields = form.getAll("images");
  if (fileFields.some((file) => !(file instanceof File)))
    throw new Error("One or more selected files are invalid.");
  const files = fileFields.filter(
    (file): file is File => file instanceof File && file.size > 0,
  );
  if (files.length > MAX_IMAGES)
    throw new Error(`Choose no more than ${MAX_IMAGES} images.`);

  let totalBytes = 0;
  const images: UploadedImage[] = [];
  for (const file of files) {
    if (!allowedTypes.has(file.type))
      throw new Error("Use JPG, PNG, WebP or GIF image files.");
    if (file.size > MAX_FILE_BYTES)
      throw new Error("Each image must be 5 MB or smaller.");
    totalBytes += file.size;
    if (totalBytes > MAX_TOTAL_BYTES)
      throw new Error("The total image upload must be 20 MB or smaller.");
    const data = Buffer.from(await file.arrayBuffer());
    if (!matchesImageType(file.type, data))
      throw new Error(
        "One selected file is not a valid JPG, PNG, WebP or GIF image.",
      );
    images.push({
      data,
      mimeType: file.type,
      fileName: file.name
        .replace(/[\\/\u0000-\u001f\u007f]/g, "_")
        .slice(0, 160),
    });
  }

  let keepImageIds: number[] = [];
  if (form.has("keepImageIds")) {
    try {
      const value: unknown = JSON.parse(String(form.get("keepImageIds")));
      if (
        !Array.isArray(value) ||
        value.length > MAX_IMAGES ||
        value.some((id) => !Number.isInteger(id) || Number(id) < 1) ||
        new Set(value).size !== value.length
      )
        throw new Error();
      keepImageIds = value as number[];
    } catch {
      throw new Error(
        "The existing image selection is invalid. Reload and try again.",
      );
    }
  }
  if (keepImageIds.length + images.length > MAX_IMAGES)
    throw new Error(`An entry can have up to ${MAX_IMAGES} images.`);

  return { data: parsed.data, images, keepImageIds };
}

function submissionError(error: unknown) {
  return NextResponse.json(
    {
      error:
        error instanceof RequestBodyTooLargeError
          ? "The image upload is too large. Use up to 5 images, 5 MB each."
          : error instanceof Error
          ? error.message
          : "Could not save this entry. Try again.",
    },
    { status: error instanceof RequestBodyTooLargeError ? 413 : 400 },
  );
}

export async function GET() {
  if (!(await isAdmin()))
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  return NextResponse.json({ entries: listEntries() });
}

export async function POST(request: NextRequest) {
  if (rejectOrigin(request) || !(await isAdmin()))
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  let submission;
  try {
    submission = await readSubmission(request);
  } catch (error) {
    return submissionError(error);
  }
  try {
    const id = createEntry(submission.data, submission.images);
    return NextResponse.json(
      { id, message: "Content entry created." },
      { status: 201 },
    );
  } catch {
    return NextResponse.json(
      { error: "That title is already in use. Choose a different title." },
      { status: 409 },
    );
  }
}

export async function PATCH(request: NextRequest) {
  if (rejectOrigin(request) || !(await isAdmin()))
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  const id = Number(new URL(request.url).searchParams.get("id"));
  if (!Number.isInteger(id) || id < 1)
    return NextResponse.json(
      { error: "Entry id is required." },
      { status: 400 },
    );
  let submission;
  try {
    submission = await readSubmission(request);
  } catch (error) {
    return submissionError(error);
  }
  try {
    if (
      !updateEntry(
        id,
        submission.data,
        submission.keepImageIds,
        submission.images,
      )
    )
      return NextResponse.json({ error: "Entry not found." }, { status: 404 });
    return NextResponse.json({ message: "Content entry updated." });
  } catch (error) {
    if (error instanceof Error && error.message === "Invalid image selection.")
      return NextResponse.json(
        { error: "Reload and select the images again." },
        { status: 400 },
      );
    return NextResponse.json(
      { error: "That title is already in use. Choose a different title." },
      { status: 409 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  if (rejectOrigin(request) || !(await isAdmin()))
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  let body: unknown;
  try {
    body = await readLimitedJson(request, 4_096);
  } catch (error) {
    return NextResponse.json(
      { error: "Entry id is required." },
      { status: error instanceof RequestBodyTooLargeError ? 413 : 400 },
    );
  }
  const id = Number((body as { id?: unknown })?.id);
  if (!Number.isInteger(id) || id < 1)
    return NextResponse.json(
      { error: "Entry id is required." },
      { status: 400 },
    );
  if (!deleteEntry(id))
    return NextResponse.json({ error: "Entry not found." }, { status: 404 });
  return NextResponse.json({ message: "Entry deleted." });
}

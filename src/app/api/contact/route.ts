import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { inquirySchema } from "@/lib/contact-schema";
import { saveInquiry, setInquiryEmailStatus } from "@/lib/admin-store";
import { clientAddress, consumeRateLimit } from "@/lib/request-security";

export const runtime = "nodejs";
const attempts = new Map<string, number[]>();
const WINDOW_MS = 15 * 60 * 1000;
const MAX_REQUESTS = 5;
function text(value: string) {
  return value.replace(/[\r\n\u0000-\u001f\u007f]/g, " ").trim();
}

export async function POST(request: NextRequest) {
  const length = Number(request.headers.get("content-length") || 0);
  if (length > 12_000)
    return NextResponse.json(
      { error: "This inquiry is too large. Please shorten it and try again." },
      { status: 413 },
    );
  const ip = clientAddress(request.headers);
  if (!consumeRateLimit(attempts, ip, Date.now(), WINDOW_MS, MAX_REQUESTS))
    return NextResponse.json(
      { error: "Too many attempts. Please wait a little before trying again." },
      { status: 429 },
    );
  let raw: unknown;
  try {
    const reader = request.body?.getReader();
    if (!reader)
      return NextResponse.json(
        { error: "Please send a valid inquiry." },
        { status: 400 },
      );
    const chunks: Uint8Array[] = [];
    let bytes = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      bytes += value.byteLength;
      if (bytes > 12_000) {
        await reader.cancel();
        return NextResponse.json(
          {
            error:
              "This inquiry is too large. Please shorten it and try again.",
          },
          { status: 413 },
        );
      }
      chunks.push(value);
    }
    const body = new Uint8Array(bytes);
    let offset = 0;
    for (const chunk of chunks) {
      body.set(chunk, offset);
      offset += chunk.byteLength;
    }
    raw = JSON.parse(new TextDecoder().decode(body));
  } catch {
    return NextResponse.json(
      { error: "Please send a valid inquiry." },
      { status: 400 },
    );
  }
  const parsed = inquirySchema.safeParse(raw);
  if (!parsed.success)
    return NextResponse.json(
      { error: "Please check the required fields and try again." },
      { status: 400 },
    );
  if (parsed.data.website)
    return NextResponse.json(
      { error: "We couldn’t accept this submission. Please try again." },
      { status: 400 },
    );

  const inquiry = parsed.data;
  let inquiryId: number;
  try {
    inquiryId = saveInquiry({
      name: inquiry.name,
      email: inquiry.email,
      company: inquiry.company,
      projectType: inquiry.projectType,
      budget: inquiry.budget,
      timeline: inquiry.timeline,
      description: inquiry.description,
      privacyAcknowledged: inquiry.privacy,
    });
  } catch {
    console.error("Contact inquiry could not be saved");
    return NextResponse.json(
      {
        error:
          "We couldn’t save your inquiry just now. Please try again later.",
      },
      { status: 500 },
    );
  }
  const { RESEND_API_KEY, CONTACT_TO_EMAIL, CONTACT_FROM_EMAIL } = process.env;
  if (!RESEND_API_KEY || !CONTACT_TO_EMAIL || !CONTACT_FROM_EMAIL) {
    setInquiryEmailStatus(inquiryId, "not_configured");
    return NextResponse.json({
      message:
        "Your inquiry was received and saved. The ATLaS team can review it in the admin dashboard.",
    });
  }
  const body = [
    `New project inquiry for ATLaS`,
    `Inquiry ID: ${inquiryId}`,
    `Name: ${text(inquiry.name)}`,
    `Email: ${text(inquiry.email)}`,
    `Company: ${text(inquiry.company) || "Not provided"}`,
    `Project type: ${inquiry.projectType}`,
    `Budget: ${inquiry.budget || "Not provided"}`,
    `Timeline: ${inquiry.timeline || "Not provided"}`,
    `Privacy acknowledgement: ${inquiry.privacy ? "Yes" : "No"}`,
    "",
    "Project description:",
    text(inquiry.description),
  ].join("\n");
  try {
    const resend = new Resend(RESEND_API_KEY);
    const result = await resend.emails.send({
      from: CONTACT_FROM_EMAIL,
      to: CONTACT_TO_EMAIL,
      replyTo: text(inquiry.email),
      subject: `Project inquiry — ${text(inquiry.projectType)}`,
      text: body,
    });
    if (result.error) {
      console.error("Contact email delivery failed", result.error.name);
      setInquiryEmailStatus(inquiryId, "failed");
      return NextResponse.json({
        message:
          "Your inquiry was received and saved. The ATLaS team can review it in the admin dashboard.",
      });
    }
    setInquiryEmailStatus(inquiryId, "sent");
    return NextResponse.json(
      {
        message:
          "Thanks for reaching out. Your inquiry was sent to the ATLaS team.",
      },
      { status: 200 },
    );
  } catch {
    console.error("Contact email provider request failed");
    setInquiryEmailStatus(inquiryId, "failed");
    return NextResponse.json({
      message:
        "Your inquiry was received and saved. The ATLaS team can review it in the admin dashboard.",
    });
  }
}

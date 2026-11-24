import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { inquirySchema } from "@/lib/contact-schema";
import { saveInquiry, setInquiryEmailStatus } from "@/lib/admin-store";
import { clientAddress, consumeRateLimit } from "@/lib/request-security";

export const runtime = "nodejs";
const attempts = new Map<string, number[]>();
const WINDOW_MS = 15 * 60 * 1000;
const MAX_REQUESTS = process.env.NODE_ENV === "production" ? 5 : 50;

function text(value: string) {
  return value.replace(/[\r\n\u0000-\u001f\u007f]/g, " ").trim();
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };
    return entities[character];
  });
}

export async function POST(request: NextRequest) {
  const length = Number(request.headers.get("content-length") || 0);
  if (length > 12_000) {
    return NextResponse.json(
      { error: "This inquiry is too large. Please shorten it and try again." },
      { status: 413 },
    );
  }

  const ip = clientAddress(request.headers);
  if (!consumeRateLimit(attempts, ip, Date.now(), WINDOW_MS, MAX_REQUESTS)) {
    return NextResponse.json(
      { error: "Too many attempts. Please wait a little before trying again." },
      { status: 429 },
    );
  }

  let raw: unknown;
  try {
    const reader = request.body?.getReader();
    if (!reader) {
      return NextResponse.json(
        { error: "Please send a valid inquiry." },
        { status: 400 },
      );
    }
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
  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0];
    const errorMessage =
      firstIssue?.message || "Please check the required fields and try again.";
    console.warn("Contact form validation failed:", parsed.error.issues);
    return NextResponse.json(
      { error: errorMessage },
      { status: 400 },
    );
  }
  if (parsed.data.website) {
    return NextResponse.json(
      { error: "We couldn't accept this submission. Please try again." },
      { status: 400 },
    );
  }

  const inquiry = parsed.data;
  let inquiryId: number;
  try {
    inquiryId = await saveInquiry({
      name: inquiry.name,
      email: inquiry.email,
      company: inquiry.company,
      projectType: inquiry.projectType,
      budget: inquiry.budget,
      timeline: inquiry.timeline,
      description: inquiry.description,
      privacyAcknowledged: inquiry.privacy,
    });
  } catch (err) {
    console.error("Contact inquiry could not be saved:", err);
    return NextResponse.json(
      {
        error:
          "We couldn't save your inquiry just now. Please try again later.",
      },
      { status: 500 },
    );
  }

  const {
    RESEND_API_KEY,
    CONTACT_TO_EMAIL,
    CONTACT_FROM_EMAIL,
    NEXT_PUBLIC_SITE_URL,
  } = process.env;

  if (!RESEND_API_KEY || !CONTACT_TO_EMAIL) {
    await setInquiryEmailStatus(inquiryId, "not_configured");
    return NextResponse.json({
      message:
        "Your inquiry was received and saved. The ATLaS team can review it in the admin dashboard.",
    });
  }

  const fromAddress =
    CONTACT_FROM_EMAIL || "ATLaS Inquiries <onboarding@resend.dev>";
  const adminUrl = `${NEXT_PUBLIC_SITE_URL || "http://localhost:3001"}/admin`;

  const textBody = [
    `New project inquiry received for ATLaS:`,
    `--------------------------------------`,
    `Inquiry ID: #${inquiryId}`,
    `Client Name: ${text(inquiry.name)}`,
    `Client Email: ${text(inquiry.email)}`,
    `Company: ${text(inquiry.company) || "Not provided"}`,
    `Project Type: ${text(inquiry.projectType)}`,
    `Estimated Budget: ${text(inquiry.budget) || "Not provided"}`,
    `Target Timeline: ${text(inquiry.timeline) || "Not provided"}`,
    `Privacy Acknowledgement: ${inquiry.privacy ? "Yes" : "No"}`,
    ``,
    `Project Description:`,
    text(inquiry.description),
    ``,
    `Admin Dashboard: ${adminUrl}`,
  ].join("\n");

  const htmlBody = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 28px; color: #1e293b; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 10px;">
      <div style="border-bottom: 2px solid #0f172a; padding-bottom: 16px; margin-bottom: 24px;">
        <h1 style="margin: 0; font-size: 22px; color: #0f172a; font-weight: 700;">New Project Inquiry</h1>
        <p style="margin: 6px 0 0 0; font-size: 14px; color: #64748b;">Inquiry #${inquiryId} submitted on ATLaS Website</p>
      </div>

      <div style="background-color: #f8fafc; border-radius: 8px; padding: 18px; margin-bottom: 24px; border: 1px solid #e2e8f0;">
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          <tr>
            <td style="padding: 7px 0; color: #64748b; width: 140px; font-weight: 600;">Client Name:</td>
            <td style="padding: 7px 0; color: #0f172a; font-weight: 600;">${escapeHtml(text(inquiry.name))}</td>
          </tr>
          <tr>
            <td style="padding: 7px 0; color: #64748b; font-weight: 600;">Client Email:</td>
            <td style="padding: 7px 0;"><a href="mailto:${escapeHtml(text(inquiry.email))}" style="color: #2563eb; text-decoration: none; font-weight: 500;">${escapeHtml(text(inquiry.email))}</a></td>
          </tr>
          <tr>
            <td style="padding: 7px 0; color: #64748b; font-weight: 600;">Company:</td>
            <td style="padding: 7px 0; color: #0f172a;">${escapeHtml(text(inquiry.company)) || "<em>Not provided</em>"}</td>
          </tr>
          <tr>
            <td style="padding: 7px 0; color: #64748b; font-weight: 600;">Project Type:</td>
            <td style="padding: 7px 0;"><span style="display: inline-block; background: #e0e7ff; color: #3730a3; padding: 2px 10px; border-radius: 4px; font-size: 13px; font-weight: 600;">${escapeHtml(text(inquiry.projectType))}</span></td>
          </tr>
          <tr>
            <td style="padding: 7px 0; color: #64748b; font-weight: 600;">Budget:</td>
            <td style="padding: 7px 0; color: #0f172a;">${escapeHtml(text(inquiry.budget)) || "<em>Not specified</em>"}</td>
          </tr>
          <tr>
            <td style="padding: 7px 0; color: #64748b; font-weight: 600;">Timeline:</td>
            <td style="padding: 7px 0; color: #0f172a;">${escapeHtml(text(inquiry.timeline)) || "<em>Not specified</em>"}</td>
          </tr>
        </table>
      </div>

      <div style="margin-bottom: 28px;">
        <h2 style="font-size: 15px; margin: 0 0 10px 0; color: #0f172a; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Project Description</h2>
        <div style="background-color: #ffffff; border: 1px solid #cbd5e1; border-radius: 6px; padding: 16px; font-size: 14px; line-height: 1.6; color: #334155; white-space: pre-wrap;">${escapeHtml(text(inquiry.description))}</div>
      </div>

      <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
        <a href="${escapeHtml(adminUrl)}" style="display: inline-block; background-color: #0f172a; color: #ffffff; padding: 10px 22px; border-radius: 6px; text-decoration: none; font-size: 14px; font-weight: 600; margin-right: 10px;">View in Admin</a>
        <a href="mailto:${escapeHtml(text(inquiry.email))}" style="display: inline-block; background-color: #2563eb; color: #ffffff; padding: 10px 22px; border-radius: 6px; text-decoration: none; font-size: 14px; font-weight: 600;">Reply to Client</a>
      </div>
    </div>
  `;

  try {
    const resend = new Resend(RESEND_API_KEY);
    const result = await resend.emails.send({
      from: fromAddress,
      to: CONTACT_TO_EMAIL,
      replyTo: text(inquiry.email),
      subject: `Project inquiry from ${text(inquiry.name)} — ${text(inquiry.projectType)}`,
      text: textBody,
      html: htmlBody,
    });

    if (result.error) {
      console.error("Resend email delivery error:", result.error);
      await setInquiryEmailStatus(inquiryId, "failed");
      return NextResponse.json({
        message:
          "Your inquiry was received and saved. The ATLaS team can review it in the admin dashboard.",
      });
    }

    await setInquiryEmailStatus(inquiryId, "sent");
    return NextResponse.json(
      {
        message:
          "Thanks for reaching out! Your inquiry was sent to the ATLaS team.",
      },
      { status: 200 },
    );
  } catch (err) {
    console.error("Resend API error:", err);
    await setInquiryEmailStatus(inquiryId, "failed");
    return NextResponse.json({
      message:
        "Your inquiry was received and saved. The ATLaS team can review it in the admin dashboard.",
    });
  }
}

import { describe, expect, it } from "vitest";
import { inquirySchema } from "./contact-schema";

const validInquiry = {
  name: "Amina Rahman",
  email: "amina@example.com",
  company: "Example Co",
  projectType: "Website or web application",
  budget: "",
  timeline: "",
  description: "We need a new website for our growing business.",
  privacy: true,
  website: "",
};

describe("inquirySchema", () => {
  it("accepts a valid inquiry with optional fields omitted", () => {
    const result = inquirySchema.safeParse({
      ...validInquiry,
      company: undefined,
    });
    expect(result.success).toBe(true);
  });
  it("rejects malformed email and short descriptions", () => {
    expect(
      inquirySchema.safeParse({ ...validInquiry, email: "not-an-email" })
        .success,
    ).toBe(false);
    expect(
      inquirySchema.safeParse({ ...validInquiry, description: "Too short" })
        .success,
    ).toBe(false);
  });
  it("requires privacy acknowledgement and an allowed project type", () => {
    expect(
      inquirySchema.safeParse({ ...validInquiry, privacy: false }).success,
    ).toBe(false);
    expect(
      inquirySchema.safeParse({ ...validInquiry, projectType: "Not a service" })
        .success,
    ).toBe(false);
  });
  it("rejects overly long names and descriptions", () => {
    expect(
      inquirySchema.safeParse({ ...validInquiry, name: "A".repeat(101) })
        .success,
    ).toBe(false);
    expect(
      inquirySchema.safeParse({
        ...validInquiry,
        description: "x".repeat(4001),
      }).success,
    ).toBe(false);
  });
});

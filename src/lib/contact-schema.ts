import { z } from "zod";

export const projectTypes = [
  "Website or web application",
  "E-commerce or SaaS",
  "Mobile application",
  "Cybersecurity",
  "UI/UX design",
  "Branding or graphic design",
  "Video editing",
  "Website maintenance",
  "Other",
] as const;
export const inquirySchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(254),
  company: z.string().trim().max(120).optional().default(""),
  projectType: z.enum(projectTypes),
  budget: z
    .enum([
      "",
      "Under $1,000",
      "$1,000–$5,000",
      "$5,000–$15,000",
      "$15,000+",
      "Not sure yet",
    ])
    .optional()
    .default(""),
  timeline: z
    .enum([
      "",
      "As soon as possible",
      "Within 1–3 months",
      "Within 3–6 months",
      "Flexible",
    ])
    .optional()
    .default(""),
  description: z.string().trim().min(20).max(4000),
  privacy: z.boolean().refine((v) => v, "Privacy acknowledgement is required"),
  website: z.string().max(200).optional().default(""),
});

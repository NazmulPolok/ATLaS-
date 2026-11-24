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
  name: z
    .string()
    .trim()
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Name is too long"),
  email: z
    .string()
    .trim()
    .email("Please enter a valid email address")
    .max(254),
  company: z.string().trim().max(120).optional().default(""),
  projectType: z.enum(projectTypes, {
    message: "Please select a valid project type",
  }),
  budget: z.string().max(100).optional().default(""),
  timeline: z.string().max(100).optional().default(""),
  description: z
    .string()
    .trim()
    .min(10, "Please describe your project in at least 10 characters")
    .max(4000, "Description is too long"),
  privacy: z.boolean().refine((v) => v, "Privacy acknowledgement is required"),
  website: z.string().max(200).optional().default(""),
});

export type InquiryInput = z.infer<typeof inquirySchema>;

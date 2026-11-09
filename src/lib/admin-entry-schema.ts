import { z } from "zod";

const optionalUrl = z
  .string()
  .trim()
  .max(1000)
  .refine(
    (value) => !value || /^https?:\/\//i.test(value),
    "Use a full http:// or https:// URL.",
  );

export const entrySchema = z
  .object({
    kind: z.enum(["work", "product"]),
    title: z.string().trim().min(2).max(120),
    category: z.string().trim().min(2).max(100),
    summary: z.string().trim().min(10).max(240),
    description: z.string().trim().min(20).max(5000),
    imageUrl: optionalUrl.default(""),
    linkUrl: optionalUrl.default(""),
    published: z.boolean().default(false),
  })
  .transform((data) => ({
    ...data,
    slug: data.title
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 100),
  }));

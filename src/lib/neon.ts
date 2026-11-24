import "server-only";
import { neon } from "@neondatabase/serverless";
import type { Inquiry } from "./admin-store";

export function isNeonConfigured(): boolean {
  const url = process.env.DATABASE_URL;
  return Boolean(
    url && (url.startsWith("postgres://") || url.startsWith("postgresql://")),
  );
}

function getSql() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not configured.");
  return neon(url);
}

let neonInitialized = false;

export async function ensureNeonTables() {
  if (neonInitialized || !isNeonConfigured()) return;
  const sql = getSql();
  await sql`
    CREATE TABLE IF NOT EXISTS inquiries (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      company VARCHAR(255) DEFAULT '',
      project_type VARCHAR(255) NOT NULL,
      budget VARCHAR(255) DEFAULT '',
      timeline VARCHAR(255) DEFAULT '',
      description TEXT NOT NULL,
      privacy_acknowledged BOOLEAN DEFAULT FALSE,
      email_status VARCHAR(50) DEFAULT 'pending',
      is_read BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    );
  `;
  neonInitialized = true;
}

function formatTimestamp(val: unknown): string {
  if (!val) return new Date().toISOString().replace("T", " ").substring(0, 19);
  const d = new Date(val as string | number | Date);
  if (isNaN(d.getTime())) return String(val);
  return d.toISOString().replace("T", " ").substring(0, 19);
}

export function neonRowToInquiry(row: Record<string, unknown>): Inquiry {
  return {
    id: Number(row.id),
    name: String(row.name ?? ""),
    email: String(row.email ?? ""),
    company: String(row.company ?? ""),
    projectType: String(row.project_type ?? ""),
    budget: String(row.budget ?? ""),
    timeline: String(row.timeline ?? ""),
    description: String(row.description ?? ""),
    privacyAcknowledged: Boolean(row.privacy_acknowledged),
    emailStatus: String(row.email_status ?? "pending"),
    isRead: Boolean(row.is_read),
    createdAt: formatTimestamp(row.created_at),
  };
}

export async function saveNeonInquiry(data: {
  name: string;
  email: string;
  company: string;
  projectType: string;
  budget: string;
  timeline: string;
  description: string;
  privacyAcknowledged: boolean;
}): Promise<number> {
  await ensureNeonTables();
  const sql = getSql();
  const rows = (await sql`
    INSERT INTO inquiries (
      name, email, company, project_type, budget, timeline, description, privacy_acknowledged
    ) VALUES (
      ${data.name},
      ${data.email},
      ${data.company || ""},
      ${data.projectType},
      ${data.budget || ""},
      ${data.timeline || ""},
      ${data.description},
      ${Boolean(data.privacyAcknowledged)}
    )
    RETURNING id;
  `) as { id: number }[];
  return Number(rows[0].id);
}

export async function setNeonInquiryEmailStatus(
  id: number,
  status: string,
): Promise<void> {
  await ensureNeonTables();
  const sql = getSql();
  await sql`UPDATE inquiries SET email_status = ${status} WHERE id = ${id};`;
}

export async function listNeonInquiries(): Promise<Inquiry[]> {
  await ensureNeonTables();
  const sql = getSql();
  const rows = (await sql`
    SELECT * FROM inquiries ORDER BY created_at DESC, id DESC;
  `) as Record<string, unknown>[];
  return rows.map(neonRowToInquiry);
}

export async function markNeonInquiryRead(
  id: number,
  isRead: boolean,
): Promise<void> {
  await ensureNeonTables();
  const sql = getSql();
  await sql`UPDATE inquiries SET is_read = ${Boolean(isRead)} WHERE id = ${id};`;
}

export async function deleteNeonInquiry(id: number): Promise<boolean> {
  await ensureNeonTables();
  const sql = getSql();
  const result = (await sql`
    DELETE FROM inquiries WHERE id = ${id} RETURNING id;
  `) as { id: number }[];
  return result.length > 0;
}

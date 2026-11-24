import "server-only";
import { mkdirSync } from "node:fs";
import path from "node:path";
import Database from "better-sqlite3";

export type EntryKind = "work" | "product";
export type EntryImage = {
  id: number;
  fileName: string;
  mimeType: string;
};
export type ContentEntry = {
  id: number;
  kind: EntryKind;
  slug: string;
  title: string;
  category: string;
  summary: string;
  description: string;
  imageUrl: string;
  images: EntryImage[];
  linkUrl: string;
  published: boolean;
  createdAt: string;
};
export type Inquiry = {
  id: number;
  name: string;
  email: string;
  company: string;
  projectType: string;
  budget: string;
  timeline: string;
  description: string;
  privacyAcknowledged: boolean;
  emailStatus: string;
  isRead: boolean;
  createdAt: string;
};

const globalForDatabase = globalThis as typeof globalThis & {
  atlasDatabase?: Database.Database;
};

function database() {
  if (globalForDatabase.atlasDatabase) return globalForDatabase.atlasDatabase;
  const file =
    process.env.DATABASE_PATH ||
    path.join(process.cwd(), "data", "atlas.sqlite");
  mkdirSync(path.dirname(file), { recursive: true });
  const db = new Database(file);
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");
  db.exec(`
    CREATE TABLE IF NOT EXISTS entries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      kind TEXT NOT NULL CHECK (kind IN ('work', 'product')),
      slug TEXT NOT NULL UNIQUE,
      title TEXT NOT NULL,
      category TEXT NOT NULL,
      summary TEXT NOT NULL,
      description TEXT NOT NULL,
      image_url TEXT NOT NULL DEFAULT '',
      link_url TEXT NOT NULL DEFAULT '',
      published INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
    CREATE INDEX IF NOT EXISTS entries_public_idx ON entries(kind, published, created_at DESC);
    CREATE TABLE IF NOT EXISTS entry_images (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      entry_id INTEGER NOT NULL REFERENCES entries(id) ON DELETE CASCADE,
      image_data BLOB NOT NULL,
      mime_type TEXT NOT NULL,
      file_name TEXT NOT NULL,
      sort_order INTEGER NOT NULL DEFAULT 0
    );
    CREATE INDEX IF NOT EXISTS entry_images_entry_idx ON entry_images(entry_id, sort_order, id);
    CREATE TABLE IF NOT EXISTS inquiries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      company TEXT NOT NULL DEFAULT '',
      project_type TEXT NOT NULL,
      budget TEXT NOT NULL DEFAULT '',
      timeline TEXT NOT NULL DEFAULT '',
      description TEXT NOT NULL,
      privacy_acknowledged INTEGER NOT NULL DEFAULT 0,
      email_status TEXT NOT NULL DEFAULT 'pending',
      is_read INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);
  const inquiryColumns = db.prepare("PRAGMA table_info(inquiries)").all() as {
    name: string;
  }[];
  if (!inquiryColumns.some((column) => column.name === "privacy_acknowledged"))
    db.exec(
      "ALTER TABLE inquiries ADD COLUMN privacy_acknowledged INTEGER NOT NULL DEFAULT 0",
    );
  globalForDatabase.atlasDatabase = db;
  return db;
}

function entry(
  row: Record<string, unknown>,
  images: EntryImage[] = [],
): ContentEntry {
  return {
    id: Number(row.id),
    kind: row.kind as EntryKind,
    slug: String(row.slug),
    title: String(row.title),
    category: String(row.category),
    summary: String(row.summary),
    description: String(row.description),
    imageUrl: String(row.image_url),
    images,
    linkUrl: String(row.link_url),
    published: Boolean(row.published),
    createdAt: String(row.created_at),
  };
}

function inquiry(row: Record<string, unknown>): Inquiry {
  return {
    id: Number(row.id),
    name: String(row.name),
    email: String(row.email),
    company: String(row.company),
    projectType: String(row.project_type),
    budget: String(row.budget),
    timeline: String(row.timeline),
    description: String(row.description),
    privacyAcknowledged: Boolean(row.privacy_acknowledged),
    emailStatus: String(row.email_status),
    isRead: Boolean(row.is_read),
    createdAt: String(row.created_at),
  };
}

export function saveInquiry(data: {
  name: string;
  email: string;
  company: string;
  projectType: string;
  budget: string;
  timeline: string;
  description: string;
  privacyAcknowledged: boolean;
}) {
  const result = database()
    .prepare(
      `INSERT INTO inquiries
    (name,email,company,project_type,budget,timeline,description,privacy_acknowledged)
    VALUES (@name,@email,@company,@projectType,@budget,@timeline,@description,@privacyAcknowledged)`,
    )
    .run({ ...data, privacyAcknowledged: data.privacyAcknowledged ? 1 : 0 });
  return Number(result.lastInsertRowid);
}

export function setInquiryEmailStatus(id: number, status: string) {
  database()
    .prepare("UPDATE inquiries SET email_status = ? WHERE id = ?")
    .run(status, id);
}

export function listInquiries() {
  return (
    database()
      .prepare("SELECT * FROM inquiries ORDER BY created_at DESC, id DESC")
      .all() as Record<string, unknown>[]
  ).map(inquiry);
}

export function markInquiryRead(id: number, isRead: boolean) {
  database()
    .prepare("UPDATE inquiries SET is_read = ? WHERE id = ?")
    .run(isRead ? 1 : 0, id);
}

export function deleteInquiry(id: number) {
  return (
    database().prepare("DELETE FROM inquiries WHERE id = ?").run(id).changes > 0
  );
}

export function listEntries(kind?: EntryKind, publicOnly = false) {
  const conditions: string[] = [];
  const values: (string | number)[] = [];
  if (kind) {
    conditions.push("kind = ?");
    values.push(kind);
  }
  if (publicOnly) conditions.push("published = 1");
  const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
  const db = database();
  const rows = db
    .prepare(`SELECT * FROM entries ${where} ORDER BY created_at DESC, id DESC`)
    .all(...values) as Record<string, unknown>[];
  const imageRows = db
    .prepare(
      `SELECT i.id, i.entry_id, i.file_name, i.mime_type
       FROM entry_images i INNER JOIN entries e ON e.id = i.entry_id
       ${publicOnly ? "WHERE e.published = 1" : ""}
       ORDER BY i.sort_order, i.id`,
    )
    .all() as Record<string, unknown>[];
  const imagesByEntry = new Map<number, EntryImage[]>();
  for (const image of imageRows) {
    const entryId = Number(image.entry_id);
    const images = imagesByEntry.get(entryId) || [];
    images.push({
      id: Number(image.id),
      fileName: String(image.file_name),
      mimeType: String(image.mime_type),
    });
    imagesByEntry.set(entryId, images);
  }
  return rows.map((row) => entry(row, imagesByEntry.get(Number(row.id)) || []));
}

export type UploadedImage = {
  data: Buffer;
  mimeType: string;
  fileName: string;
};
export type EntryContent = Omit<ContentEntry, "id" | "createdAt" | "images">;

function addImages(
  db: Database.Database,
  entryId: number,
  images: UploadedImage[],
  startOrder = 0,
) {
  const insert = db.prepare(
    "INSERT INTO entry_images (entry_id,image_data,mime_type,file_name,sort_order) VALUES (?,?,?,?,?)",
  );
  images.forEach((image, index) =>
    insert.run(
      entryId,
      image.data,
      image.mimeType,
      image.fileName,
      startOrder + index,
    ),
  );
}

const insertEntry = (db: Database.Database, data: EntryContent) =>
  db
    .prepare(
      `INSERT INTO entries
    (kind,slug,title,category,summary,description,image_url,link_url,published)
    VALUES (@kind,@slug,@title,@category,@summary,@description,@imageUrl,@linkUrl,@published)`,
    )
    .run({ ...data, published: data.published ? 1 : 0 });

export function createEntry(data: EntryContent, images: UploadedImage[]) {
  const db = database();
  const save = db.transaction(() => {
    const result = insertEntry(db, data);
    const id = Number(result.lastInsertRowid);
    addImages(db, id, images);
    return id;
  });
  return save();
}

export function updateEntry(
  id: number,
  data: EntryContent,
  keepImageIds: number[],
  newImages: UploadedImage[],
) {
  const db = database();
  const save = db.transaction(() => {
    const result = db
      .prepare(
        `UPDATE entries SET
    kind=@kind,slug=@slug,title=@title,category=@category,summary=@summary,
    description=@description,image_url=@imageUrl,link_url=@linkUrl,published=@published
    WHERE id=@id`,
      )
      .run({ ...data, published: data.published ? 1 : 0, id });
    if (!result.changes) return false;
    const existingIds = (
      db.prepare("SELECT id FROM entry_images WHERE entry_id = ?").all(id) as {
        id: number;
      }[]
    ).map((row) => Number(row.id));
    if (keepImageIds.some((imageId) => !existingIds.includes(imageId)))
      throw new Error("Invalid image selection.");
    if (keepImageIds.length) {
      const placeholders = keepImageIds.map(() => "?").join(",");
      db.prepare(
        `DELETE FROM entry_images WHERE entry_id = ? AND id NOT IN (${placeholders})`,
      ).run(id, ...keepImageIds);
    } else {
      db.prepare("DELETE FROM entry_images WHERE entry_id = ?").run(id);
    }
    const reorder = db.prepare(
      "UPDATE entry_images SET sort_order = ? WHERE entry_id = ? AND id = ?",
    );
    keepImageIds.forEach((imageId, index) => reorder.run(index, id, imageId));
    addImages(db, id, newImages, keepImageIds.length);
    return true;
  });
  return save();
}

export function deleteEntry(id: number) {
  return (
    database().prepare("DELETE FROM entries WHERE id = ?").run(id).changes > 0
  );
}

export function getStoredImage(id: number) {
  const row = database()
    .prepare(
      `SELECT i.id, i.image_data, i.mime_type, i.file_name, e.published
       FROM entry_images i INNER JOIN entries e ON e.id = i.entry_id
       WHERE i.id = ?`,
    )
    .get(id) as
    | {
        id: number;
        image_data: Buffer;
        mime_type: string;
        file_name: string;
        published: number;
      }
    | undefined;
  if (!row) return null;
  return {
    id: Number(row.id),
    data: row.image_data,
    mimeType: row.mime_type,
    fileName: row.file_name,
    published: Boolean(row.published),
  };
}

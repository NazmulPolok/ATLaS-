"use client";

import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { UploadCloud, Trash2 } from "lucide-react";
import type { ContentEntry, EntryImage, Inquiry } from "@/lib/admin-store";

type PreviewImage = { file: File; url: string };

type Draft = Pick<
  ContentEntry,
  | "kind"
  | "title"
  | "category"
  | "summary"
  | "description"
  | "imageUrl"
  | "linkUrl"
  | "published"
>;
const blank: Draft = {
  kind: "work",
  title: "",
  category: "",
  summary: "",
  description: "",
  imageUrl: "",
  linkUrl: "",
  published: false,
};

export function AdminDashboard({
  initialEntries,
  initialInquiries,
}: {
  initialEntries: ContentEntry[];
  initialInquiries: Inquiry[];
}) {
  const router = useRouter();
  const [entries, setEntries] = useState(initialEntries);
  const [inquiries, setInquiries] = useState(initialInquiries);
  const [draft, setDraft] = useState<Draft>(blank);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [removedImageIds, setRemovedImageIds] = useState<number[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [filter, setFilter] = useState<"all" | "work" | "product">("all");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const selectedPreviews = useMemo<PreviewImage[]>(
    () =>
      selectedFiles.map((file) => ({
        file,
        url: URL.createObjectURL(file),
      })),
    [selectedFiles],
  );

  useEffect(
    () => () => selectedPreviews.forEach(({ url }) => URL.revokeObjectURL(url)),
    [selectedPreviews],
  );

  const currentImages = editingId
    ? (entries.find((entry) => entry.id === editingId)?.images || []).filter(
        (image) => !removedImageIds.includes(image.id),
      )
    : [];

  async function refresh() {
    const [entryResponse, inquiryResponse] = await Promise.all([
      fetch("/api/admin/entries"),
      fetch("/api/admin/inquiries"),
    ]);
    if (entryResponse.status === 401 || inquiryResponse.status === 401) {
      router.push("/admin/login");
      return;
    }
    const entryData = await entryResponse.json();
    const inquiryData = await inquiryResponse.json();
    setEntries(entryData.entries || []);
    setInquiries(inquiryData.inquiries || []);
  }

  function edit(item: ContentEntry) {
    setEditingId(item.id);
    setDraft({
      kind: item.kind,
      title: item.title,
      category: item.category,
      summary: item.summary,
      description: item.description,
      imageUrl: item.imageUrl,
      linkUrl: item.linkUrl,
      published: item.published,
    });
    setSelectedFiles([]);
    setRemovedImageIds([]);
    setMessage("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    try {
      const form = new FormData();
      Object.entries(draft).forEach(([key, value]) =>
        form.set(key, String(value)),
      );
      form.set(
        "keepImageIds",
        JSON.stringify(currentImages.map((image) => image.id)),
      );
      selectedFiles.forEach((file) => form.append("images", file));
      const response = await fetch(
        editingId ? `/api/admin/entries?id=${editingId}` : "/api/admin/entries",
        {
          method: editingId ? "PATCH" : "POST",
          body: form,
        },
      );
      const data = await response.json();
      if (!response.ok) {
        setMessage(data.error || "Could not save this entry.");
        return;
      }
      setMessage(editingId ? "Entry updated." : "Entry added.");
      setEditingId(null);
      setDraft(blank);
      setSelectedFiles([]);
      setRemovedImageIds([]);
      await refresh();
    } catch {
      setMessage("Could not reach the admin service.");
    } finally {
      setBusy(false);
    }
  }

  async function remove(item: ContentEntry) {
    if (!window.confirm(`Delete “${item.title}”?`)) return;
    const response = await fetch("/api/admin/entries", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: item.id }),
    });
    const data = await response.json();
    setMessage(
      response.ok
        ? "Entry deleted."
        : data.error || "Could not delete this entry.",
    );
    if (response.ok) await refresh();
  }

  async function setRead(item: Inquiry) {
    const response = await fetch("/api/admin/inquiries", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: item.id, isRead: !item.isRead }),
    });
    if (response.ok) await refresh();
  }

  async function removeInquiry(item: Inquiry) {
    if (!window.confirm(`Delete the inquiry from ${item.name}?`)) return;
    const response = await fetch("/api/admin/inquiries", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: item.id }),
    });
    if (response.ok) await refresh();
  }

  async function logout() {
    await fetch("/api/admin/auth", { method: "DELETE" });
    router.push("/admin/login");
    router.refresh();
  }

  const visibleEntries = entries.filter(
    (item) => filter === "all" || item.kind === filter,
  );
  const unread = inquiries.filter((item) => !item.isRead).length;

  function appendFiles(files: FileList | null) {
    if (!files) return;
    const maxSelectable = Math.max(
      0,
      5 - currentImages.length - selectedFiles.length,
    );
    const nextFiles = Array.from(files).slice(0, maxSelectable);
    if (nextFiles.length < files.length)
      setMessage(
        "An entry can include up to 5 images. Remove one before adding more.",
      );
    setSelectedFiles((current) => [...current, ...nextFiles]);
  }

  function removeCurrentImage(image: EntryImage) {
    setRemovedImageIds((current) => [...current, image.id]);
  }

  return (
    <section className="admin-shell section">
      <div className="admin-container">
        <div className="admin-heading">
          <div>
            <span className="eyebrow">ATLaS / PRIVATE WORKSPACE</span>
            <h1>Admin dashboard</h1>
            <p>Manage your public portfolio and review incoming inquiries.</p>
          </div>
          <button className="button button-light admin-logout" onClick={logout}>
            Sign out
          </button>
        </div>

        <div className="admin-stats">
          <div>
            <b>{entries.length}</b>
            <span>Content entries</span>
          </div>
          <div>
            <b>{inquiries.length}</b>
            <span>Inquiries received</span>
          </div>
          <div>
            <b>{unread}</b>
            <span>Unread inquiries</span>
          </div>
        </div>

        <div className="admin-columns">
          <section className="admin-panel">
            <div className="admin-panel-heading">
              <div>
                <span className="eyebrow">PORTFOLIO CMS</span>
                <h2>{editingId ? "Edit entry" : "Add an entry"}</h2>
              </div>
            </div>
            <form className="admin-entry-form" onSubmit={save}>
              <label>
                Content type
                <select
                  value={draft.kind}
                  onChange={(event) =>
                    setDraft({
                      ...draft,
                      kind: event.target.value as Draft["kind"],
                    })
                  }
                >
                  <option value="work">Client project / Work</option>
                  <option value="product">ATLaS product</option>
                </select>
              </label>
              <label>
                Title
                <input
                  required
                  minLength={2}
                  maxLength={120}
                  value={draft.title}
                  onChange={(event) =>
                    setDraft({ ...draft, title: event.target.value })
                  }
                />
              </label>
              <label>
                Category or service
                <input
                  required
                  minLength={2}
                  maxLength={100}
                  placeholder="E-commerce · Web app"
                  value={draft.category}
                  onChange={(event) =>
                    setDraft({ ...draft, category: event.target.value })
                  }
                />
              </label>
              <label>
                Short summary
                <input
                  required
                  minLength={10}
                  maxLength={240}
                  value={draft.summary}
                  onChange={(event) =>
                    setDraft({ ...draft, summary: event.target.value })
                  }
                />
              </label>
              <label>
                Details
                <textarea
                  required
                  minLength={20}
                  maxLength={5000}
                  rows={5}
                  value={draft.description}
                  onChange={(event) =>
                    setDraft({ ...draft, description: event.target.value })
                  }
                />
              </label>
              <div className="admin-file-upload-section">
                <div className="admin-file-upload-header">
                  <span className="admin-file-upload-title">Project images</span>
                  <span className="admin-field-hint">
                    Choose up to 5 JPG, PNG, WebP or GIF files. Max 5 MB each.
                  </span>
                </div>

                <div
                  className={`admin-dropzone ${isDragging ? "is-dragging" : ""}`}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                    appendFiles(e.dataTransfer.files);
                  }}
                  onClick={() => fileInputRef.current?.click()}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      fileInputRef.current?.click();
                    }
                  }}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    multiple
                    className="admin-file-input-hidden"
                    onChange={(event) => {
                      appendFiles(event.currentTarget.files);
                      event.currentTarget.value = "";
                    }}
                  />
                  <div className="admin-dropzone-icon">
                    <UploadCloud size={24} />
                  </div>
                  <div className="admin-dropzone-text">
                    <span className="admin-dropzone-cta">
                      <strong>Choose Files</strong> or drag & drop here
                    </span>
                    <span className="admin-dropzone-sub">
                      {5 - currentImages.length - selectedFiles.length > 0
                        ? `${5 - currentImages.length - selectedFiles.length} slots remaining (${currentImages.length + selectedFiles.length}/5)`
                        : "Maximum 5 images reached"}
                    </span>
                  </div>
                </div>
              </div>
              {(currentImages.length > 0 ||
                selectedPreviews.length > 0 ||
                (editingId && draft.imageUrl)) && (
                <div
                  className="admin-image-list"
                  aria-label="Selected project images"
                >
                  {editingId &&
                    draft.imageUrl &&
                    !currentImages.length &&
                    !removedImageIds.length && (
                      <div className="admin-image-tile">
                        <div
                          className="admin-image-preview"
                          style={{
                            backgroundImage: `url("${draft.imageUrl.replaceAll('"', "%22")}")`,
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => setDraft({ ...draft, imageUrl: "" })}
                        >
                          <Trash2 size={12} /> Remove cover
                        </button>
                      </div>
                    )}
                  {currentImages.map((image) => (
                    <div className="admin-image-tile" key={image.id}>
                      <div
                        className="admin-image-preview"
                        style={{
                          backgroundImage: `url("/api/media?id=${image.id}")`,
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => removeCurrentImage(image)}
                      >
                        <Trash2 size={12} /> Remove image
                      </button>
                    </div>
                  ))}
                  {selectedPreviews.map(({ file, url }, index) => (
                    <div
                      className="admin-image-tile"
                      key={`${file.name}-${file.lastModified}-${index}`}
                    >
                      <div
                        className="admin-image-preview"
                        style={{ backgroundImage: `url("${url}")` }}
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setSelectedFiles((current) =>
                            current.filter(
                              (_, fileIndex) => fileIndex !== index,
                            ),
                          )
                        }
                      >
                        <Trash2 size={12} /> Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <label>
                Project or product URL
                <input
                  type="url"
                  placeholder="https://…"
                  value={draft.linkUrl}
                  onChange={(event) =>
                    setDraft({ ...draft, linkUrl: event.target.value })
                  }
                />
              </label>
              <label className="admin-publish-toggle">
                <input
                  type="checkbox"
                  checked={draft.published}
                  onChange={(event) =>
                    setDraft({ ...draft, published: event.target.checked })
                  }
                />{" "}
                Publish this entry on the website
              </label>
              {message && (
                <p className="admin-feedback" role="status">
                  {message}
                </p>
              )}
              <div className="admin-form-actions">
                <button className="button button-coral" disabled={busy}>
                  {busy ? "Saving…" : editingId ? "Save changes" : "Add entry"}
                </button>
                {editingId && (
                  <button
                    type="button"
                    className="button button-light"
                    onClick={() => {
                      setEditingId(null);
                      setDraft(blank);
                      setSelectedFiles([]);
                      setRemovedImageIds([]);
                    }}
                  >
                    Cancel edit
                  </button>
                )}
              </div>
            </form>
          </section>

          <section className="admin-panel">
            <div className="admin-panel-heading">
              <div>
                <span className="eyebrow">YOUR CONTENT</span>
                <h2>Entries</h2>
              </div>
              <select
                aria-label="Filter entries"
                value={filter}
                onChange={(event) =>
                  setFilter(event.target.value as typeof filter)
                }
              >
                <option value="all">All</option>
                <option value="work">Client work</option>
                <option value="product">Products</option>
              </select>
            </div>
            <div className="admin-entry-list">
              {visibleEntries.length ? (
                visibleEntries.map((item) => (
                  <article className="admin-entry-row" key={item.id}>
                    <div className="admin-row-copy">
                      <span className="admin-tag">
                        {item.kind === "work" ? "CLIENT WORK" : "PRODUCT"} ·{" "}
                        {item.published ? "PUBLISHED" : "DRAFT"}
                      </span>
                      <h3>{item.title}</h3>
                      <p>
                        {item.category} — {item.summary}
                      </p>
                      <span className="admin-tag">
                        {item.images.length + (item.imageUrl ? 1 : 0)} IMAGE
                        {item.images.length + (item.imageUrl ? 1 : 0) === 1
                          ? ""
                          : "S"}
                      </span>
                    </div>
                    <div className="admin-row-actions">
                      <button onClick={() => edit(item)}>Edit</button>
                      <button
                        className="admin-delete"
                        onClick={() => void remove(item)}
                      >
                        Delete
                      </button>
                    </div>
                  </article>
                ))
              ) : (
                <p className="admin-empty">
                  No entries yet. Add a product or project using the form.
                </p>
              )}
            </div>
          </section>
        </div>

        <section className="admin-panel admin-inquiries" id="inquiries">
          <div className="admin-panel-heading">
            <div>
              <span className="eyebrow">PROJECT INBOX</span>
              <h2>
                Website inquiries{" "}
                <span className="admin-count">{inquiries.length}</span>
              </h2>
            </div>
            <p>
              Submissions are saved here even if email delivery needs
              configuration.
            </p>
          </div>
          <div className="admin-inquiry-list">
            {inquiries.length ? (
              inquiries.map((item) => (
                <article
                  className={`admin-inquiry ${item.isRead ? "is-read" : ""}`}
                  key={item.id}
                >
                  <div className="admin-inquiry-top">
                    <div>
                      <span className="admin-tag">
                        {item.projectType} · {item.isRead ? "READ" : "NEW"}
                      </span>
                      <h3>
                        {item.name}
                        {item.company ? <small> · {item.company}</small> : null}
                      </h3>
                    </div>
                    <div className="admin-inquiry-actions">
                      <a href={`mailto:${encodeURIComponent(item.email)}`}>
                        {item.email}
                      </a>
                      <button onClick={() => void setRead(item)}>
                        {item.isRead ? "Mark unread" : "Mark read"}
                      </button>
                      <button
                        className="admin-delete"
                        onClick={() => void removeInquiry(item)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  <p>{item.description}</p>
                  <div className="admin-inquiry-meta">
                    <span>Budget: {item.budget || "Not specified"}</span>
                    <span>Timeline: {item.timeline || "Not specified"}</span>
                    <span>
                      Privacy acknowledgement: {item.privacyAcknowledged ? "Yes" : "No"}
                    </span>
                    <span>
                      Email notification:{" "}
                      {item.emailStatus.replaceAll("_", " ")}
                    </span>
                    <time>
                      {new Date(
                        `${item.createdAt.replace(" ", "T")}Z`,
                      ).toLocaleString()}
                    </time>
                  </div>
                </article>
              ))
            ) : (
              <p className="admin-empty">
                No inquiries have been submitted yet.
              </p>
            )}
          </div>
        </section>
      </div>
    </section>
  );
}

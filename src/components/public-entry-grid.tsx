import { ArrowUpRight, Boxes, BriefcaseBusiness } from "lucide-react";
import type { ContentEntry } from "@/lib/admin-store";

export function PublicEntryGrid({ entries }: { entries: ContentEntry[] }) {
  if (!entries.length) return null;
  return (
    <div className="container public-entry-grid">
      {entries.map((entry) => (
        <article className="public-entry-card" key={entry.id}>
          {entry.images.length > 0 || entry.imageUrl ? (
            <div className="public-entry-gallery">
              {entry.images.length > 0 ? (
                entry.images.map((image, index) => (
                  <div
                    className="public-entry-image"
                    role="img"
                    aria-label={`${entry.title} image ${index + 1}`}
                    key={image.id}
                    style={{
                      backgroundImage: `url("/api/media?id=${image.id}")`,
                    }}
                  />
                ))
              ) : (
                <div
                  className="public-entry-image"
                  role="img"
                  aria-label={`${entry.title} cover image`}
                  style={{
                    backgroundImage: `url("${entry.imageUrl.replaceAll('"', "%22")}")`,
                  }}
                />
              )}
            </div>
          ) : (
            <div className="public-entry-placeholder">
              {entry.kind === "work" ? (
                <BriefcaseBusiness size={34} strokeWidth={1.2} />
              ) : (
                <Boxes size={36} strokeWidth={1.2} />
              )}
              <span>
                ATLaS / {entry.kind === "work" ? "SELECTED WORK" : "PRODUCT"}
              </span>
            </div>
          )}
          <div className="public-entry-copy">
            <span className="eyebrow">{entry.category}</span>
            <h2>{entry.title}</h2>
            <p>{entry.summary}</p>
            <p className="public-entry-description">{entry.description}</p>
            {entry.linkUrl && (
              <a
                className="text-link"
                href={entry.linkUrl}
                target="_blank"
                rel="noreferrer"
              >
                Visit project <ArrowUpRight size={15} />
              </a>
            )}
          </div>
        </article>
      ))}
    </div>
  );
}

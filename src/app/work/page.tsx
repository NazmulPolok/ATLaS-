import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Eyebrow, PageHero } from "@/components/ui";
import { listEntries } from "@/lib/admin-store";
import { PublicEntryGrid } from "@/components/public-entry-grid";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Work",
  description:
    "Verified ATLaS projects and case studies. Portfolio stories will be published as they are ready to share.",
};
export default function WorkPage() {
  const entries = listEntries("work", true);
  return (
    <>
      <PageHero
        eyebrow="SELECTED WORK / 01"
        title={
          <>
            Thoughtful work,
            <br />
            <span className="muted">shared honestly.</span>
          </>
        }
        text="As verified project stories are ready to share, this is where the details and decisions behind them will live."
      />
      <section className="section">
        {entries.length ? (
          <PublicEntryGrid entries={entries} />
        ) : (
          <div className="container work-page-empty">
            <div className="empty-graphic">
              <div className="empty-frame frame-one" />
              <div className="empty-frame frame-two" />
              <div className="empty-frame frame-three">
                <span>ATLaS</span>
                <span>WORK / 2026</span>
                <div className="empty-lines">
                  <i />
                  <i />
                  <i />
                </div>
              </div>
              <span className="empty-plus plus-one">+</span>
              <span className="empty-plus plus-two">+</span>
              <span className="empty-tag">IN PROGRESS</span>
            </div>
            <div>
              <Eyebrow>PORTFOLIO IN PROGRESS</Eyebrow>
              <h2>
                We’ll let the work
                <br />
                <span className="muted">speak for itself.</span>
              </h2>
              <p>
                There are no public case studies yet. We don’t publish client
                names, outcomes or demos without verified information and
                permission.
              </p>
              <Link className="text-link" href="/contact">
                Discuss a project <ArrowUpRight size={15} />
              </Link>
            </div>
          </div>
        )}
      </section>
    </>
  );
}

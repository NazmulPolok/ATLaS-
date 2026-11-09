import type { Metadata } from "next";
import { ArrowUpRight, BookOpenText } from "lucide-react";
import Link from "next/link";
import { Eyebrow, PageHero } from "@/components/ui";
export const metadata: Metadata = {
  title: "Insights",
  description:
    "Field notes from ATLaS on product thinking, engineering and security. Articles are in preparation.",
};
export default function InsightsPage() {
  return (
    <>
      <PageHero
        eyebrow="FIELD NOTES / 01"
        title={
          <>
            Better questions
            <br />
            <span className="muted">make better products.</span>
          </>
        }
        text="Practical thinking on digital products, engineering and security. We’re preparing the first notes from the studio."
      />
      <section className="section insights-empty">
        <div className="container insights-empty-layout">
          <div className="insight-art">
            <BookOpenText size={46} strokeWidth={1} />
            <span>ATLaS / FIELD NOTES</span>
            <i />
            <i />
            <i />
          </div>
          <div>
            <Eyebrow>IN THE WORKS</Eyebrow>
            <h2>
              Notes from the studio,
              <br />
              <span className="muted">coming into focus.</span>
            </h2>
            <p>
              We haven’t published any articles yet. When we do, each note will
              be grounded in what we’ve learned and made.
            </p>
            <Link className="text-link" href="/contact">
              Talk with the team <ArrowUpRight size={15} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

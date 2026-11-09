import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { services } from "@/content/site";
import { Eyebrow, PageHero } from "@/components/ui";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Explore ATLaS services across software engineering, mobile, cybersecurity, product design, branding and video.",
};
export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="CAPABILITIES / 01"
        title={
          <>
            Thoughtful work.
            <br />
            <span className="muted">Across the digital stack.</span>
          </>
        }
        text="A connected set of capabilities to help ambitious teams plan, build and improve digital experiences."
      />
      <section className="section services-index">
        <div className="container">
          <div className="services-index-grid">
            {services.map((s, i) => {
              const Icon = s.icon;
              return (
                <Link
                  className="services-index-card"
                  href={`/services/${s.slug}`}
                  key={s.slug}
                >
                  <div>
                    <Eyebrow>{`0${i + 1} / ${s.eyebrow.split("/")[0]}`}</Eyebrow>
                    <Icon size={24} />
                  </div>
                  <h2>{s.name}</h2>
                  <p>{s.short}</p>
                  <span className="text-link">
                    Explore capability <ArrowUpRight size={15} />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}

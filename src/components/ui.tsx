import Link from "next/link";
import { ArrowDownRight, ArrowRight, ArrowUpRight } from "lucide-react";
import type { ReactNode } from "react";

export function Eyebrow({
  children,
  light = false,
}: {
  children: ReactNode;
  light?: boolean;
}) {
  return (
    <div className={`eyebrow${light ? " eyebrow-light" : ""}`}>
      <span className="eyebrow-line" />
      {children}
    </div>
  );
}
export function SectionTitle({
  eyebrow,
  title,
  text,
  light = false,
}: {
  eyebrow: string;
  title: ReactNode;
  text?: string;
  light?: boolean;
}) {
  return (
    <div className={`section-title${light ? " section-title-light" : ""}`}>
      <Eyebrow light={light}>{eyebrow}</Eyebrow>
      <h2>{title}</h2>
      {text && <p>{text}</p>}
    </div>
  );
}
export function Cta({
  title = "Have something in mind?",
  text = "Tell us what you’re working toward. We’ll help you find a thoughtful way to get there.",
  light = false,
}: {
  title?: string;
  text?: string;
  light?: boolean;
}) {
  return (
    <section className={`cta-band${light ? " cta-band-light" : ""}`}>
      <div className="container cta-inner">
        <div>
          <Eyebrow light={light}>LET’S MAKE IT REAL</Eyebrow>
          <h2>{title}</h2>
          <p>{text}</p>
        </div>
        <div className="cta-actions">
          <Link className="button button-coral" href="/contact">
            Start a project <ArrowUpRight size={16} />
          </Link>
          <Link className="cta-email" href="/contact">
            Project inquiry form <ArrowRight size={15} />
          </Link>
        </div>
      </div>
      <span className="cta-orbit" aria-hidden="true" />
    </section>
  );
}
export function PageHero({
  eyebrow,
  title,
  text,
  dark = false,
}: {
  eyebrow: string;
  title: ReactNode;
  text: string;
  dark?: boolean;
}) {
  return (
    <section className={`page-hero${dark ? " page-hero-dark" : ""}`}>
      <div className="container page-hero-inner">
        <Eyebrow light={dark}>{eyebrow}</Eyebrow>
        <h1>{title}</h1>
        <p>{text}</p>
        <span className="page-hero-index" aria-hidden="true">
          <ArrowDownRight />
        </span>
      </div>
    </section>
  );
}

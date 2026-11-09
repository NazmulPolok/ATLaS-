import type { Metadata } from "next";
import {
  ArrowUpRight,
  Compass,
  Layers3,
  MessageCircle,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { Cta, Eyebrow, PageHero } from "@/components/ui";
export const metadata: Metadata = {
  title: "About",
  description:
    "Meet ATLaS, a technology and digital services agency from Bangladesh working with teams worldwide.",
};
export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="ABOUT ATLaS / 01"
        title={
          <>
            A digital agency
            <br />
            <span className="muted">for ambitious ideas.</span>
          </>
        }
        text="ATLaS is a technology and digital services agency based in Bangladesh, working with teams locally and around the world."
      />
      <section className="about-statement">
        <div className="container about-statement-grid">
          <Eyebrow>OUR POINT OF VIEW</Eyebrow>
          <div>
            <h2>Technology should make good ideas easier to act on.</h2>
            <p>
              We bring engineering, security and creative thinking together to
              help businesses move forward with clarity. Our work starts with
              listening, then turns shared understanding into useful digital
              experiences.
            </p>
            <p>
              We are building the studio one thoughtful project at a time. As we
              grow, the work and the relationships behind it will tell the
              story.
            </p>
            <Link className="text-link" href="/contact">
              Get to know us <ArrowUpRight size={15} />
            </Link>
          </div>
        </div>
      </section>
      <section className="about-principles section">
        <div className="container">
          <div className="section-title">
            <Eyebrow>WHAT GUIDES US</Eyebrow>
            <h2>
              Good work has
              <br />
              <span className="muted">good foundations.</span>
            </h2>
          </div>
          <div className="principle-grid">
            {[
              [
                Compass,
                "Start with the why",
                "Understand what needs to change before choosing how to build.",
              ],
              [
                Layers3,
                "Keep it maintainable",
                "Use clear foundations that a team can work with over time.",
              ],
              [
                ShieldCheck,
                "Build with care",
                "Think about security, accessibility and edge cases throughout.",
              ],
              [
                MessageCircle,
                "Make collaboration clear",
                "Keep decisions visible and communication straightforward.",
              ],
            ].map(([Icon, title, desc]) => {
              const I = Icon as typeof Compass;
              return (
                <article key={title as string}>
                  <I size={22} />
                  <h3>{title as string}</h3>
                  <p>{desc as string}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>
      <section className="about-note">
        <div className="container about-note-inner">
          <span>
            BASED IN BANGLADESH
            <br />
            WORKING WORLDWIDE
          </span>
          <p>
            Rooted in Bangladesh. Open to building with teams wherever a good
            idea begins.
          </p>
          <span>ATLaS / 2026</span>
        </div>
      </section>
      <Cta title="A good project starts with a conversation." />
    </>
  );
}

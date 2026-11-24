import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ArrowUpRight, MoveUpRight, Sparkles } from "lucide-react";
import { services, processSteps } from "@/content/site";
import { Cta, Eyebrow, SectionTitle } from "@/components/ui";
import { listEntries } from "@/lib/admin-store";
import { PublicEntryGrid } from "@/components/public-entry-grid";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default function HomePage() {
  const featuredWork = listEntries("work", true).slice(0, 2);
  return (
    <>
      <section className="hero">
        <div className="hero-grid" aria-hidden="true" />
        <div className="container hero-layout">
          <div className="hero-copy">
            <Eyebrow>DIGITAL AGENCY · BANGLADESH</Eyebrow>
            <h1>
              We engineer
              <br />
              <span>what’s next.</span>
            </h1>
            <p>
              Digital products, secure systems and distinctive experiences for
              ambitious businesses.
            </p>
            <div className="hero-actions">
              <Link className="button button-coral" href="/contact">
                Start a project <ArrowUpRight size={17} />
              </Link>
              <Link className="button button-outline" href="/work">
                Explore our work <ArrowRight size={16} />
              </Link>
            </div>
            <div className="hero-meta">
              <span>
                <i />
                Thoughtful by design. Built to endure.
              </span>
              <span>DIGITAL / BANGLADESH</span>
            </div>
          </div>
          <div
            className="hero-art"
            role="img"
            aria-label="Abstract ATLaS digital engineering graphic"
          >
            <div className="art-topline">
              <span>ATLAS / SYSTEMS</span>
              <span>
                23° 48′ N<br />
                90° 24′ E
              </span>
            </div>
            <div className="art-constellation">
              <div className="art-ring ring-one" />
              <div className="art-ring ring-two" />
              <div className="art-ring ring-three" />
              <div className="art-cross cross-a" />
              <div className="art-cross cross-b" />
              <div className="art-center">
                <Image
                  src="/brand/atlas-symbol.png"
                  alt=""
                  width={277}
                  height={324}
                  priority
                />
              </div>
              <span className="art-node node-a" />
              <span className="art-node node-b" />
              <span className="art-node node-c" />
              <span className="art-coordinate coordinate-a">A / 01</span>
              <span className="art-coordinate coordinate-b">
                BUILD WITH INTENT
              </span>
            </div>
            <div className="art-bottomline">
              <span>DESIGN × ENGINEERING</span>
              <span>01 — 07</span>
            </div>
          </div>
        </div>
        <div className="container hero-scroll">
          <span>SCROLL TO EXPLORE</span>
          <span className="scroll-line" />
        </div>
      </section>

      <section className="intro-strip">
        <div className="container intro-grid">
          <span className="intro-label">
            A PARTNER FOR
            <br />
            YOUR NEXT CHAPTER
          </span>
          <p>
            Good technology makes progress feel possible. We bring engineering,
            security and creative thinking together to help your next move take
            shape.
          </p>
          <Link
            href="/about"
            className="circle-link"
            aria-label="Learn about ATLaS"
          >
            <MoveUpRight size={20} />
          </Link>
        </div>
      </section>

      <section className="section services-section">
        <div className="container">
          <div className="section-heading-row">
            <SectionTitle
              eyebrow="WHAT WE DO / 01"
              title={
                <>
                  Capability with
                  <br />
                  <span className="muted">a point of view.</span>
                </>
              }
              text="A connected set of capabilities to take an idea from first sketch to a dependable digital experience."
            />
            <Link className="text-link section-side-link" href="/services">
              Explore all services <ArrowUpRight size={16} />
            </Link>
          </div>
          <div className="service-grid">
            {services.map((service, i) => {
              const Icon = service.icon;
              return (
                <Link
                  className={`service-card service-${service.color}`}
                  href={`/services/${service.slug}`}
                  key={service.slug}
                >
                  <div className="card-topline">
                    <span>
                      {String(i + 1).padStart(2, "0")} /{" "}
                      {String(services.length).padStart(2, "0")}
                    </span>
                    <span className="service-icon">
                      <Icon size={19} />
                    </span>
                  </div>
                  <div className="service-card-main">
                    <h3>{service.name}</h3>
                    <p>{service.short}</p>
                  </div>
                  <span className="card-arrow">
                    <ArrowUpRight size={17} />
                  </span>
                  <span className="service-index-bg">0{i + 1}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section work-section">
        <div className="container">
          <div className="section-heading-row">
            <SectionTitle
              eyebrow="SELECTED WORK / 02"
              title={
                <>
                  Good work speaks
                  <br />
                  <span className="muted">for itself.</span>
                </>
              }
              text="We’re building a portfolio of thoughtful digital work. The case studies here will grow alongside the studio."
            />
            <Link className="text-link section-side-link" href="/work">
              Visit the work page <ArrowUpRight size={16} />
            </Link>
          </div>
          {featuredWork.length ? (
            <PublicEntryGrid entries={featuredWork} />
          ) : (
            <div className="work-empty">
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
              <div className="work-empty-copy">
                <Eyebrow>MADE WITH INTENT</Eyebrow>
                <h3>
                  Our next chapter
                  <br />
                  is taking shape.
                </h3>
                <p>
                  We’re currently preparing verified project stories to share.
                  We’ll let the work speak when it’s ready.
                </p>
                <Link className="text-link" href="/contact">
                  Start a conversation <ArrowUpRight size={15} />
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="process-section section">
        <div className="container">
          <div className="section-heading-row">
            <SectionTitle
              eyebrow="HOW WE WORK / 03"
              title={
                <>
                  Clear thinking.
                  <br />
                  <span className="muted">Careful making.</span>
                </>
              }
              text="Good outcomes come from shared understanding and steady progress. Here’s how we move from the first conversation to what comes next."
            />
            <div className="process-marker">
              <Sparkles size={18} />
              <span>
                ONE THOUGHTFUL
                <br />
                STEP AT A TIME
              </span>
            </div>
          </div>
          <div className="process-grid">
            {processSteps.map(([num, title, text]) => (
              <article className="process-item" key={num}>
                <span className="process-num">{num}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="difference-section section">
        <div className="container difference-layout">
          <div className="difference-title">
            <Eyebrow light>WHY ATLaS / 04</Eyebrow>
            <h2>
              Serious about
              <br />
              the details that
              <br />
              <span>make a difference.</span>
            </h2>
            <p>
              Our work is grounded in good questions, considered decisions and a
              commitment to building things that serve their purpose well.
            </p>
            <Link className="button button-light" href="/about">
              Meet the studio <ArrowUpRight size={16} />
            </Link>
          </div>
          <div className="difference-list">
            <article>
              <span>01</span>
              <div>
                <h3>Business-minded from day one</h3>
                <p>
                  We start with what needs to change for your business, then
                  choose the right technology to support it.
                </p>
              </div>
            </article>
            <article>
              <span>02</span>
              <div>
                <h3>Built to be understood</h3>
                <p>
                  Clear scope, maintainable foundations and practical handover
                  make the work easier to grow over time.
                </p>
              </div>
            </article>
            <article>
              <span>03</span>
              <div>
                <h3>Security is part of the craft</h3>
                <p>
                  We consider risks and responsible defaults throughout the
                  build, with explicit scope for any security review.
                </p>
              </div>
            </article>
            <article>
              <span>04</span>
              <div>
                <h3>Close collaboration, no fog</h3>
                <p>
                  Frequent check-ins and plain-language updates help keep
                  decisions visible and momentum steady.
                </p>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="product-section section">
        <div className="container product-layout">
          <div className="product-visual">
            <div className="product-window">
              <div className="window-bar">
                <span />
                <span />
                <span />
                <i>ATLaS / PRODUCT STUDIO</i>
                <b>⌘</b>
              </div>
              <div className="window-content">
                <div className="window-sidebar">
                  <b className="mini-mark">A.</b>
                  <i />
                  <i />
                  <i />
                  <i />
                </div>
                <div className="window-main">
                  <div className="window-kicker">ECOMMERCE / ATLaS PRODUCT</div>
                  <div className="window-heading">
                    Built from
                    <br />a better question.
                  </div>
                  <div className="window-copy">
                    An e-commerce SaaS product developed by ATLaS. More details
                    to follow.
                  </div>
                  <div className="window-bars">
                    <i />
                    <i />
                    <i />
                  </div>
                </div>
              </div>
            </div>
            <div className="product-caption">
              <span>ATLaS / E-COMMERCE SAAS</span>
              <span>DETAILS IN PROGRESS</span>
            </div>
          </div>
          <div className="product-copy">
            <Eyebrow>BEYOND CLIENT WORK / 05</Eyebrow>
            <h2>
              Software of our own,
              <br />
              built with purpose.
            </h2>
            <p>
              ATLaS’s e-commerce SaaS is a product developed by the agency.
              We’ll share its purpose, capabilities and availability when
              verified product details are ready.
            </p>
            <Link className="text-link" href="/products">
              Explore ATLaS products <ArrowUpRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      <section className="insight-strip">
        <div className="container insight-layout">
          <div>
            <Eyebrow>FIELD NOTES / 06</Eyebrow>
            <h2>
              Better questions
              <br />
              make better products.
            </h2>
          </div>
          <div>
            <p>
              Practical notes on product thinking, engineering and security will
              appear here as they’re ready to share.
            </p>
            <Link className="text-link" href="/insights">
              See the field notes <ArrowUpRight size={15} />
            </Link>
          </div>
          <span className="insight-index">
            NOTES
            <br />
            FROM THE
            <br />
            STUDIO
          </span>
        </div>
      </section>

      <Cta
        title="Let’s build something that matters."
        text="Share the challenge, the ambition or the early idea. We’ll bring good questions and a clear next step."
      />
    </>
  );
}

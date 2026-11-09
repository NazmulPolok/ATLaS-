import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, Check } from "lucide-react";
import { services } from "@/content/site";
import { Cta, Eyebrow } from "@/components/ui";

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const s = services.find((x) => x.slug === slug);
  return s ? { title: s.name, description: s.intro } : {};
}
export default async function ServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = services.find((s) => s.slug === slug);
  if (!service) notFound();
  const Icon = service.icon;
  return (
    <>
      <section className="service-hero">
        <div className="container service-hero-layout">
          <div>
            <Eyebrow>{service.eyebrow.toUpperCase()}</Eyebrow>
            <h1>
              {service.name}
              <br />
              <span className="muted">with intent.</span>
            </h1>
            <p>{service.intro}</p>
            <Link className="button button-coral" href="/contact">
              Discuss your project <ArrowUpRight size={16} />
            </Link>
          </div>
          <div className={`service-hero-art service-${service.color}`}>
            <span className="service-art-label">ATLaS / CAPABILITY</span>
            <Icon size={78} strokeWidth={1} />
            <span className="service-art-index">
              {service.eyebrow.split("/")[1]?.trim()} —{" "}
              {String(services.length).padStart(2, "0")}
            </span>
            <span className="service-art-ring" />
          </div>
        </div>
      </section>
      <section className="section service-detail">
        <div className="container service-columns">
          <div className="service-detail-intro">
            <Eyebrow>THE CHALLENGE</Eyebrow>
            <h2>
              Move from
              <br />
              <span className="muted">stuck to possible.</span>
            </h2>
            <p>
              We work with teams facing real delivery challenges. This
              capability can help when:
            </p>
          </div>
          <ul className="check-list">
            {service.problems.map((item) => (
              <li key={item}>
                <span>
                  <Check size={15} />
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>
      <section className="service-deliverables">
        <div className="container service-columns">
          <div>
            <Eyebrow light>WHAT WE CAN DELIVER</Eyebrow>
            <h2>
              Practical outcomes,
              <br />
              shaped around you.
            </h2>
            <p className="service-dark-copy">
              Every engagement is scoped to your context. Here are some common
              ways we can help.
            </p>
          </div>
          <ul className="deliverable-list">
            {service.deliverables.map((x, i) => (
              <li key={x}>
                <span>0{i + 1}</span>
                {x}
                <ArrowUpRight size={16} />
              </li>
            ))}
          </ul>
        </div>
      </section>
      <section className="section">
        <div className="container service-columns">
          <div className="service-detail-intro">
            <Eyebrow>GOOD FIT FOR</Eyebrow>
            <h2>
              Work that needs
              <br />
              <span className="muted">a clear next step.</span>
            </h2>
          </div>
          <div className="project-type-grid">
            {service.projectTypes.map((x) => (
              <div key={x}>
                <span>↗</span>
                {x}
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="service-process">
        <div className="container">
          <div className="service-process-title">
            <Eyebrow>HOW WE APPROACH IT</Eyebrow>
            <h2>
              Make the complex
              <br />
              feel manageable.
            </h2>
          </div>
          <div className="service-steps">
            {service.process.map((x, i) => (
              <article key={x}>
                <span>0{i + 1}</span>
                <p>{x}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="section faq-section">
        <div className="container faq-layout">
          <div>
            <Eyebrow>GOOD TO KNOW</Eyebrow>
            <h2>
              Questions,
              <br />
              <span className="muted">answered.</span>
            </h2>
          </div>
          <div>
            {service.faqs.map((item) => (
              <details className="faq-item" key={item.q}>
                <summary>
                  {item.q}
                  <span>+</span>
                </summary>
                <p>{item.a}</p>
              </details>
            ))}
            {service.slug === "cybersecurity" && (
              <p className="security-note">
                Security work is performed only with explicit written
                authorization and an agreed scope.
              </p>
            )}
          </div>
        </div>
      </section>
      <Cta
        title={`Let’s talk ${service.name.toLowerCase()}.`}
        text="A useful first conversation starts with what you’re trying to make possible."
      />
    </>
  );
}

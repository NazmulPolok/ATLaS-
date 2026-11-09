import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/ui";
export const metadata: Metadata = {
  title: "Terms of use",
  description: "Terms for using the ATLaS website.",
};
export default function TermsPage() {
  return (
    <>
      <PageHero
        eyebrow="LEGAL / 02"
        title={
          <>
            A few terms
            <br />
            <span className="muted">for this website.</span>
          </>
        }
        text="These terms cover general use of the ATLaS website."
      />
      <article className="legal-content container">
        <p className="legal-updated">Last updated: October 25, 2026</p>
        <h2>Website content</h2>
        <p>
          Information on this website is provided for general informational
          purposes. It may change as ATLaS services and products evolve. A
          project engagement begins only through a separately agreed written
          scope.
        </p>
        <h2>Intellectual property</h2>
        <p>
          Unless otherwise stated, website text, design and original graphics
          are owned by or used by ATLaS. Do not reproduce or redistribute them
          commercially without permission.
        </p>
        <h2>Acceptable use</h2>
        <p>
          Do not misuse this website, attempt unauthorized access, interfere
          with its operation, or submit unlawful content through its forms.
        </p>
        <h2>External services</h2>
        <p>
          Links to third-party websites are provided for convenience. ATLaS does
          not control those sites or their content.
        </p>
        <h2>Contact</h2>
        <p>
          Questions about these terms can be sent through the{" "}
          <Link href="/contact">project inquiry form</Link>.
        </p>
        <p className="legal-note">
          This general template is not legal advice and should be reviewed for
          the intended production use.
        </p>
      </article>
    </>
  );
}

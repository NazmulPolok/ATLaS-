import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/ui";
export const metadata: Metadata = {
  title: "Privacy policy",
  description: "How ATLaS handles information submitted through this website.",
};
export default function PrivacyPage() {
  return (
    <>
      <PageHero
        eyebrow="LEGAL / 01"
        title={
          <>
            Privacy,
            <br />
            <span className="muted">in plain language.</span>
          </>
        }
        text="A practical overview of the information this website may receive and how it is handled."
      />
      <article className="legal-content container">
        <p className="legal-updated">Last updated: October 25, 2026</p>
        <h2>Information you share</h2>
        <p>
          If you contact us through the project inquiry form, we receive the
          details you choose to provide, such as your name, business email,
          project type and project description. Please avoid sending passwords,
          sensitive personal information or confidential credentials.
        </p>
        <h2>How we use it</h2>
        <p>
          We use inquiry information to respond to your request and assess
          whether we can help. Submissions are stored in the website’s private
          admin dashboard. If email delivery is configured, the form also sends
          a notification to the business address configured by the site
          operator. The dashboard is restricted to authorized administrators.
        </p>
        <h2>Cookies and analytics</h2>
        <p>
          This website does not intentionally add advertising cookies or
          third-party analytics scripts. Hosting providers may process technical
          request data needed to operate and secure the site.
        </p>
        <h2>Service providers and retention</h2>
        <p>
          If an email provider is configured, information submitted through the
          form will be processed by that provider to deliver the notification.
          Submissions are also retained in the website’s database until an
          administrator deletes them. The site operator should configure
          provider retention and administrator access according to its policies.
          We do not intentionally collect more information than needed for an
          inquiry.
        </p>
        <h2>Your choices</h2>
        <p>
          You can choose not to submit the form. If you have a question about an
          inquiry you sent, use the{" "}
          <Link href="/contact">project inquiry form</Link> to reach ATLaS.
        </p>
        <h2>Updates</h2>
        <p>
          This policy may change as the website and its services change.
          Material updates should be reflected here.
        </p>
        <p className="legal-note">
          This starter policy should be reviewed against ATLaS’s operating
          practices and applicable local requirements before production launch.
        </p>
      </article>
    </>
  );
}

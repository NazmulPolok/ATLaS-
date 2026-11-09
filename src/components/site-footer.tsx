import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Brand } from "@/components/site-header";
import { services } from "@/content/site";
import { socialLinks } from "@/content/social-links";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-top">
          <div className="footer-brand">
            <Brand />
            <p>
              Digital products, secure systems and distinctive experiences for
              ambitious businesses.
            </p>
            <Link className="text-link" href="/contact">
              Tell us what you’re building <ArrowUpRight size={15} />
            </Link>
            <div className="footer-social">
              <h3>Follow us</h3>
              <div>
                {socialLinks.map(({ name, href, Icon }) =>
                  href ? (
                    <a
                      key={name}
                      href={href}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`ATLaS on ${name}`}
                      title={name}
                    >
                      <Icon size={16} aria-hidden="true" />
                    </a>
                  ) : (
                    <span
                      className="footer-social-disabled"
                      key={name}
                      aria-label={`${name} profile link not added yet`}
                      aria-disabled="true"
                      title={`${name} link will be added later`}
                    >
                      <Icon size={16} aria-hidden="true" />
                    </span>
                  ),
                )}
              </div>
            </div>
          </div>
          <div className="footer-links">
            <div>
              <h3>Explore</h3>
              <Link href="/about">About ATLaS</Link>
              <Link href="/work">Selected work</Link>
              <Link href="/products">Products</Link>
              <Link href="/insights">Insights</Link>
            </div>
            <div>
              <h3>Capabilities</h3>
              {services.map((s) => (
                <Link key={s.slug} href={`/services/${s.slug}`}>
                  {s.name}
                </Link>
              ))}
              <Link href="/services">All services</Link>
            </div>
            <div>
              <h3>Get in touch</h3>
              <Link href="/contact">Project inquiry form</Link>
              <span>Bangladesh · Working worldwide</span>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} ATLaS. Built with intent.</span>
          <div>
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
          </div>
          <span className="footer-note">Digital agency from Bangladesh</span>
        </div>
      </div>
    </footer>
  );
}

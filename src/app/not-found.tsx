import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
export default function NotFound() {
  return (
    <section className="not-found">
      <div className="container">
        <span className="not-found-code">404 / NOT FOUND</span>
        <h1>
          This page took
          <br />
          <span className="muted">a different route.</span>
        </h1>
        <p>The page may have moved, or the address may be off.</p>
        <div>
          <Link className="button button-coral" href="/">
            Back to home <ArrowLeft size={16} />
          </Link>
          <Link className="text-link" href="/contact">
            Get in touch <ArrowUpRight size={15} />
          </Link>
        </div>
      </div>
    </section>
  );
}

import type { Metadata } from "next";
import { Boxes, CircleDashed } from "lucide-react";
import { Cta, Eyebrow, PageHero } from "@/components/ui";
import { listEntries } from "@/lib/admin-store";
import { PublicEntryGrid } from "@/components/public-entry-grid";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Products",
  description:
    "Explore software products developed by ATLaS. Product information will be published when verified and ready.",
};
export default function ProductsPage() {
  const products = listEntries("product", true);
  return (
    <>
      <PageHero
        eyebrow="ATLaS PRODUCTS / 01"
        title={
          <>
            An agency at heart.
            <br />
            <span className="muted">A maker by nature.</span>
          </>
        }
        text="ATLaS is the parent agency, with its own e-commerce SaaS product alongside client services. We’ll share product details as verified information becomes available."
      />
      <section className="section products-page">
        <div className="container product-card-large">
          <div className="product-symbol">
            <Boxes size={42} strokeWidth={1} />
            <span>ATLaS / E-COMMERCE SAAS</span>
          </div>
          <div>
            <Eyebrow>PRODUCT DEVELOPED BY ATLaS</Eyebrow>
            <h2>
              E-commerce SaaS,
              <br />
              built by the agency.
            </h2>
            <p>
              This is ATLaS’s own software product. Product purpose, feature
              details and availability are not published yet. We’ll update this
              page when verified information is ready.
            </p>
            <span className="product-status">
              <CircleDashed size={14} /> DETAILS IN PROGRESS
            </span>
          </div>
        </div>
        {products.length > 0 && <PublicEntryGrid entries={products} />}
      </section>
      <Cta
        title="Have a product idea of your own?"
        text="We can help you turn an early question into a clearer direction."
      />
    </>
  );
}

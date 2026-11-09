import type { Metadata, Viewport } from "next";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com";
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "ATLaS — We engineer what’s next", template: "%s | ATLaS" },
  description:
    "ATLaS builds digital products, secure systems and distinctive experiences for ambitious businesses in Bangladesh and beyond.",
  openGraph: {
    type: "website",
    siteName: "ATLaS",
    title: "ATLaS — We engineer what’s next",
    description:
      "Digital products, secure systems and distinctive experiences for ambitious businesses.",
    images: [{ url: "/opengraph-image" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "ATLaS — We engineer what’s next",
    description:
      "Digital products, secure systems and distinctive experiences for ambitious businesses.",
  },
  robots: { index: true, follow: true },
};
export const viewport: Viewport = {
  themeColor: "#101827",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <SiteHeader />
        <main id="main-content">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}

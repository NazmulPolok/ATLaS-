"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { navItems, services } from "@/content/site";

function Brand() {
  return (
    <Link className="brand" href="/" aria-label="ATLaS home">
      <span className="brand-mark" aria-hidden="true">
        <Image
          src="/brand/atlas-symbol.png"
          alt=""
          width={31}
          height={36}
          priority
        />
      </span>
      <span>ATLaS</span>
    </Link>
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  return (
    <header
      className="site-header"
      onKeyDown={(event) => {
        if (event.key === "Escape") close();
      }}
    >
      <div className="container header-inner">
        <Brand />
        <nav className="desktop-nav" aria-label="Main navigation">
          {navItems.map((item) => (
            <div className="nav-item" key={item.href}>
              <Link
                href={item.href}
                className={pathname.startsWith(item.href) ? "active" : ""}
                aria-current={
                  pathname.startsWith(item.href) ? "page" : undefined
                }
              >
                {item.label}
              </Link>
              {item.label === "Services" && (
                <div className="nav-dropdown">
                  {services.map((s) => (
                    <Link key={s.slug} href={`/services/${s.slug}`}>
                      {s.name}
                      <ArrowUpRight size={14} />
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
        <Link className="button button-small header-cta" href="/contact">
          Start a project <ArrowUpRight size={15} />
        </Link>
        <button
          className="menu-toggle"
          onClick={() => setOpen(!open)}
          aria-label={open ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={open}
          aria-controls="mobile-navigation"
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <nav
          id="mobile-navigation"
          className="mobile-nav"
          aria-label="Mobile navigation"
        >
          {navItems.map((item) => (
            <Link onClick={close} key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
          <div className="mobile-services">
            {services.map((s) => (
              <Link onClick={close} key={s.slug} href={`/services/${s.slug}`}>
                {s.name}
              </Link>
            ))}
          </div>
          <Link className="button" onClick={close} href="/contact">
            Start a project <ArrowUpRight size={16} />
          </Link>
        </nav>
      )}
    </header>
  );
}

export { Brand };

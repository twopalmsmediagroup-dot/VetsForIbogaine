"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Wordmark from "./Wordmark";
import { Close, Menu, ArrowRight } from "./Icons";

export const NAV = [
  { href: "/", label: "Home" },
  { href: "/about-ibogaine", label: "About Ibogaine" },
  { href: "/why-veterans", label: "Why Veterans" },
  { href: "/consortium/scientific-research", label: "Research" },
  { href: "/consortium", label: "Consortium" },
  { href: "/partners", label: "Partners" },
  { href: "/timeline", label: "Timeline" },
  { href: "/news", label: "News" },
];

export default function Header({ tagline }: { tagline?: string | null }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  useEffect(() => setOpen(false), [pathname]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || (href === "/consortium" && pathname.startsWith("/consortium") && !pathname.endsWith("scientific-research"));

  return (
    <header className="sticky top-0 z-50 border-b border-line/70 bg-paper/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Wordmark tagline={tagline} />
        <nav aria-label="Main" className="hidden xl:block">
          <ul className="flex items-center gap-6">
            {NAV.map((n) => (
              <li key={n.href}>
                <Link
                  href={n.href}
                  aria-current={isActive(n.href) ? "page" : undefined}
                  className={`relative py-2 text-[0.7rem] font-semibold tracking-[0.12em] uppercase transition-colors ${
                    isActive(n.href) ? "text-gold-600 after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:bg-gold-500" : "text-navy-900 hover:text-gold-600"
                  }`}
                >
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-3">
          <Link href="/contact?type=join" className="btn btn-gold hidden !px-4 !py-2.5 sm:inline-flex">
            Join the Consortium <ArrowRight />
          </Link>
          <button
            type="button"
            className="p-2 text-navy-900 xl:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <Close /> : <Menu />}
          </button>
        </div>
      </div>
      {open && (
        <nav id="mobile-nav" aria-label="Mobile" className="border-t border-line bg-paper xl:hidden">
          <ul className="mx-auto max-w-7xl px-4 py-3 sm:px-6">
            {NAV.map((n) => (
              <li key={n.href}>
                <Link href={n.href} className={`block border-b border-line/60 py-3 text-sm font-semibold tracking-[0.1em] uppercase ${isActive(n.href) ? "text-gold-600" : "text-navy-900"}`}>
                  {n.label}
                </Link>
              </li>
            ))}
            <li className="pt-4 pb-2">
              <Link href="/contact?type=join" className="btn btn-gold w-full justify-center">Join the Consortium <ArrowRight /></Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}

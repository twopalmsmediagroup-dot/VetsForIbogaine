import Link from "next/link";
import Image from "next/image";
import type { Settings } from "@/lib/types";

const SOCIAL: { key: string; label: string; path: string }[] = [
  { key: "linkedin_url", label: "LinkedIn", path: "M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9.5h4V21H3zM9.5 9.5h3.8v1.6h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.65 4.78 6.1V21h-4v-5.1c0-1.22-.02-2.78-1.7-2.78-1.7 0-1.95 1.32-1.95 2.7V21h-4z" },
  { key: "instagram_url", label: "Instagram", path: "M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm0 8.2a3.2 3.2 0 1 1 0-6.4 3.2 3.2 0 0 1 0 6.4zM17.3 5.5a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4zM12 2.5c-2.6 0-2.9 0-3.9.06C4.9 2.7 3 4.6 2.6 8.1 2.5 9.1 2.5 9.4 2.5 12s0 2.9.06 3.9c.15 3.2 2 5.1 5.5 5.5 1 .05 1.3.06 3.9.06s2.9 0 3.9-.06c3.2-.15 5.1-2 5.5-5.5.05-1 .06-1.3.06-3.9s0-2.9-.06-3.9c-.15-3.2-2-5.1-5.5-5.5-1-.05-1.3-.06-3.9-.06z" },
  { key: "youtube_url", label: "YouTube", path: "M23 7.2a3 3 0 0 0-2.1-2.1C19 4.6 12 4.6 12 4.6s-7 0-8.9.5A3 3 0 0 0 1 7.2 31 31 0 0 0 .5 12 31 31 0 0 0 1 16.8a3 3 0 0 0 2.1 2.1c1.9.5 8.9.5 8.9.5s7 0 8.9-.5a3 3 0 0 0 2.1-2.1 31 31 0 0 0 .5-4.8 31 31 0 0 0-.5-4.8zM9.7 15V9l5.8 3z" },
  { key: "x_url", label: "X", path: "M17.8 3h3.3l-7.2 8.2L22.4 21h-6.6l-5.2-6.8L4.7 21H1.4l7.7-8.8L1 3h6.8l4.7 6.2zm-1.2 16h1.8L6.9 4.9H5z" },
];

const COLS = [
  { title: "Explore", links: [["About Ibogaine", "/about-ibogaine"], ["Why Veterans", "/why-veterans"], ["Research", "/consortium/scientific-research"], ["Consortium", "/consortium"], ["Partners & Organizations", "/partners"], ["Timeline", "/timeline"], ["News & Articles", "/news"], ["Resources", "/resources"]] },
  { title: "Get Involved", links: [["Join the Consortium", "/contact?type=join"], ["Partner With Us", "/contact?type=partner"], ["Media Inquiries", "/contact?type=media"], ["Contact", "/contact"]] },
  { title: "Legal", links: [["Medical Disclaimer", "/medical-disclaimer"], ["Privacy Policy", "/privacy"], ["Terms of Use", "/terms"], ["Accessibility", "/accessibility"]] },
];

export default function Footer({ s }: { s: Settings }) {
  return (
    <footer className="on-dark bg-navy-950 text-white/80">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-x-6 gap-y-8 px-4 py-10 sm:grid-cols-3 sm:px-6 sm:py-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr_auto] lg:px-8">
        <div className="col-span-2 sm:col-span-3 lg:col-span-1">
          <Link href="/" className="flex items-center gap-3" aria-label="Vets for Ibogaine — home">
            <Image src="/brand/brain-mark.png" alt="" width={541} height={600} className="h-14 w-auto" />
            <span className="font-[family-name:var(--font-mark)] text-xl font-bold tracking-[0.04em]">
              <span className="text-white">VETS FOR </span><span className="gold-text">IBOGAINE</span>
            </span>
          </Link>
          <p className="mt-3 text-[0.62rem] font-semibold tracking-[0.2em] uppercase text-gold-400">{s.tagline || "Advocacy • Collaboration • Education"}</p>
          <p className="mt-4 max-w-xs text-sm">{s.footer_tagline || "Veterans deserve to know all their options."}</p>
          {s.contact_email && <a href={`mailto:${s.contact_email}`} className="mt-3 inline-block text-sm text-gold-300 hover:text-white">{s.contact_email}</a>}
        </div>
        {COLS.map((c) => (
          <nav key={c.title} aria-label={c.title}>
            <h2 className="text-sm font-semibold text-white">{c.title}</h2>
            <ul className="mt-3 space-y-2 text-sm">
              {c.links.map(([label, href]) => (
                <li key={href}><Link href={href} className="hover:text-gold-300">{label}</Link></li>
              ))}
            </ul>
          </nav>
        ))}
        {(SOCIAL.some((x) => s[x.key]) || s.donate_url) && (
        <div className="col-span-2 flex flex-col gap-5 sm:col-span-3 lg:col-span-1 lg:items-end">
          <ul className="flex gap-4">
            {SOCIAL.filter((x) => s[x.key]).map((x) => (
              <li key={x.key}>
                <a href={s[x.key]!} target="_blank" rel="noopener noreferrer" aria-label={x.label} className="text-white hover:text-gold-300">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d={x.path} /></svg>
                </a>
              </li>
            ))}
          </ul>
          {s.donate_url && <a href={s.donate_url} className="btn btn-gold justify-center" target="_blank" rel="noopener noreferrer">Donate</a>}
        </div>
        )}
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-5 text-xs text-white/60 sm:px-6 md:flex-row md:justify-between lg:px-8">
          <p>© {new Date().getFullYear()} Vets for Ibogaine. All rights reserved.</p>
          <p className="md:max-w-2xl md:text-right">
            Educational information only. Not medical advice. Ibogaine is not FDA-approved. {s.disclaimer_short}
          </p>
        </div>
      </div>
    </footer>
  );
}

import Link from "next/link";
import type { TimelineEntry } from "@/lib/types";
import { ArrowRight } from "./Icons";

/**
 * Stand-ins for the homepage photo slots while no photo is uploaded: real content instead of an
 * empty panel. Like the empty Visual, they are desktop-only so phones don't scroll past them.
 */
function Panel({ children, className = "", label }: { children: React.ReactNode; className?: string; label: string }) {
  return (
    <aside aria-label={label} className={`neural-bg on-dark relative hidden overflow-hidden text-white lg:flex lg:items-center ${className}`}>
      <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: "radial-gradient(#b9c7e3 1px, transparent 1px)", backgroundSize: "22px 22px" }} aria-hidden="true" />
      <div className="relative w-full px-12 py-14 xl:px-16">{children}</div>
    </aside>
  );
}

/** Live size of the network, from published content. */
export function NetworkPanel({ stats, className }: { stats: { value: number; label: string; href: string }[]; className?: string }) {
  return (
    <Panel label="The network at a glance" className={className}>
      <p className="eyebrow">The Network at a Glance</p>
      <dl className="mt-8 grid grid-cols-2 gap-px bg-white/10 ring-1 ring-white/10">
        {stats.map((s) => (
          <Link key={s.label} href={s.href} className="group bg-navy-900/80 p-6 transition hover:bg-navy-800">
            <dt className="sr-only">{s.label}</dt>
            <dd className="display accent-text text-5xl">{s.value}</dd>
            <dd className="mt-2 text-sm font-medium text-white/85 group-hover:text-white">{s.label}</dd>
          </Link>
        ))}
      </dl>
    </Panel>
  );
}

/** Cited key facts (sources listed on /about-ibogaine). */
export function FactsPanel({ className }: { className?: string }) {
  const facts = [
    "Studied for PTSD, traumatic brain injury and opioid use disorder — evidence is still early.",
    "Can cause serious, potentially fatal heart-rhythm problems and interacts with many medications.",
    "A Schedule I controlled substance in the United States.",
    "Not approved by the FDA for any use.",
  ];
  return (
    <Panel label="Key facts about ibogaine" className={className}>
      <p className="eyebrow">Key Facts</p>
      <ul className="mt-6 space-y-5">
        {facts.map((f, i) => (
          <li key={f} className="flex gap-4">
            <span className="display accent-text w-8 shrink-0 text-3xl leading-none">{String(i + 1).padStart(2, "0")}</span>
            <span className="text-lg leading-snug text-white/90">{f}</span>
          </li>
        ))}
      </ul>
      <Link href="/about-ibogaine" className="mt-8 inline-flex items-center gap-2 text-xs font-bold tracking-[0.14em] text-accent uppercase hover:text-white">
        See the sources <ArrowRight />
      </Link>
    </Panel>
  );
}

/** The most recent milestones from the timeline. */
export function MilestonesPanel({ entries, className }: { entries: TimelineEntry[]; className?: string }) {
  const latest = [...entries].sort((a, b) => b.year - a.year || b.sort_order - a.sort_order).slice(0, 3);
  if (!latest.length) return null;
  return (
    <Panel label="Recent milestones" className={className}>
      <p className="eyebrow">Recent Milestones</p>
      <ol className="mt-6 border-l border-accent/50 pl-6">
        {latest.map((e) => (
          <li key={e.id} className="relative pb-6 last:pb-0">
            <span className="absolute top-2 -left-[1.86rem] h-2.5 w-2.5 rotate-45 bg-accent-soft" aria-hidden="true" />
            <p className="display accent-text text-2xl">{e.date_label || e.year}</p>
            <p className="mt-1 text-lg text-white">{e.title}</p>
          </li>
        ))}
      </ol>
    </Panel>
  );
}

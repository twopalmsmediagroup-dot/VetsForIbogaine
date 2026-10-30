import Image from "next/image";
import type { Organization } from "@/lib/types";
import { External } from "./Icons";

export function RelationshipBadge({ r }: { r: Organization["relationship"] }) {
  return r === "confirmed_partner" ? (
    <span className="inline-flex items-center gap-1 rounded-full bg-gold-500/15 px-2.5 py-1 text-[0.62rem] font-bold tracking-[0.12em] uppercase text-gold-700 ring-1 ring-gold-500/40">
      <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M9 16.2l-3.5-3.5L4 14.2l5 5 11-11-1.5-1.5z" /></svg>
      Confirmed Partner
    </span>
  ) : (
    <span className="inline-flex rounded-full bg-navy-900/5 px-2.5 py-1 text-[0.62rem] font-semibold tracking-[0.12em] uppercase text-navy-700 ring-1 ring-navy-900/10">
      Informational Listing
    </span>
  );
}

export default function OrgCard({ o }: { o: Organization }) {
  return (
    <article className="flex h-full flex-col bg-white p-6 ring-1 ring-line/70">
      <div className="flex items-start justify-between gap-3">
        {o.logo_url ? (
          <Image src={o.logo_url} alt={`${o.name} logo`} width={160} height={60} className="h-12 w-auto object-contain" />
        ) : (
          <span className="display text-xl text-navy-900">{o.name}</span>
        )}
      </div>
      {o.logo_url && <h3 className="display mt-3 text-lg text-navy-900">{o.name}</h3>}
      <div className="mt-3"><RelationshipBadge r={o.relationship} /></div>
      {o.description && <p className="mt-3 text-sm text-muted">{o.description}</p>}
      <div className="mt-auto flex items-center justify-between gap-3 pt-4 text-xs text-muted">
        <span>{o.location}</span>
        {o.website && (
          <a href={o.website} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-semibold text-navy-700 hover:text-gold-700">
            Website <External /><span className="sr-only"> for {o.name}</span>
          </a>
        )}
      </div>
    </article>
  );
}

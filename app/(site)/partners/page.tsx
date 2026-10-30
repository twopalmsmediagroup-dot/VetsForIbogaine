import type { Metadata } from "next";
import Link from "next/link";
import { getOrganizations, getSettings } from "@/lib/data";
import PageHero from "@/components/PageHero";
import OrgCard from "@/components/OrgCard";

export const revalidate = 300;
export const metadata: Metadata = { title: "Partners & Organizations", description: "Confirmed consortium partners and informational listings of organizations working on ibogaine research and veteran care.", alternates: { canonical: "/partners" } };

export default async function PartnersPage() {
  const [s, orgs] = await Promise.all([getSettings(), getOrganizations()]);
  const partners = orgs.filter((o) => o.relationship === "confirmed_partner");
  const listings = orgs.filter((o) => o.relationship === "resource_listing");
  return (
    <>
      <PageHero eyebrow="Partners & Organizations" title={s.partners_title || "Organizations Shaping the Field."} summary={s.partners_body} />
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <section aria-labelledby="cp">
          <h2 id="cp" className="display text-3xl text-navy-900">Confirmed Consortium Partners</h2>
          <p className="mt-2 max-w-3xl text-sm text-muted">Organizations with a formal relationship with Vets for Ibogaine. A partnership is not a guarantee of any service or outcome.</p>
          {partners.length ? (
            <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{partners.map((o) => <li key={o.id}><OrgCard o={o} /></li>)}</ul>
          ) : (
            <div className="mt-8 bg-white p-8 ring-1 ring-line">
              <p className="text-ink/80">Founding partners will be announced soon.</p>
              <Link href="/contact?type=partner" className="btn btn-outline mt-5">Become a Partner</Link>
            </div>
          )}
        </section>
        <section aria-labelledby="il" className="mt-14">
          <h2 id="il" className="display text-3xl text-navy-900">Informational Listings</h2>
          <p className="mt-2 max-w-3xl text-sm text-muted">These organizations are listed for educational reference only. Inclusion does not mean they are affiliated with, partnered with, or endorsed by Vets for Ibogaine, or that they endorse us.</p>
          <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{listings.map((o) => <li key={o.id}><OrgCard o={o} /></li>)}</ul>
        </section>
      </div>
    </>
  );
}

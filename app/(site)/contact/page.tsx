import type { Metadata } from "next";
import { getSettings } from "@/lib/data";
import PageHero from "@/components/PageHero";
import InquiryForm from "@/components/InquiryForm";

export const metadata: Metadata = { title: "Contact & Get Involved", description: "Join the consortium, partner with Vets for Ibogaine, or reach out with a media inquiry.", alternates: { canonical: "/contact" } };

const TITLES: Record<string, string> = { join: "Join the Consortium", partner: "Partner With Us", media: "Media Inquiries", general: "Contact Us" };

export default async function ContactPage({ searchParams }: { searchParams: Promise<{ type?: string }> }) {
  const sp = await searchParams;
  const type = sp.type && TITLES[sp.type] ? sp.type : "general";
  const s = await getSettings();
  return (
    <>
      <PageHero eyebrow="Get Involved" title={TITLES[type]} summary="Researchers, clinicians, veterans, advocates, funders and journalists — we'd like to hear from you." />
      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_300px]">
        <InquiryForm defaultType={type} />
        <aside className="space-y-6 text-sm text-muted">
          <div className="bg-navy-900 p-6 text-white">
            <p className="font-semibold text-gold-300">Veterans in crisis</p>
            <p className="mt-2 text-white/85">Call or text <strong className="text-white">988</strong> and press <strong className="text-white">1</strong>, or text <strong className="text-white">838255</strong>. Free and confidential, 24/7.</p>
          </div>
          <p>{s.disclaimer_short}</p>
          {s.contact_email && <p>Email: <a href={`mailto:${s.contact_email}`} className="text-navy-700 underline">{s.contact_email}</a></p>}
        </aside>
      </div>
    </>
  );
}

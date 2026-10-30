import { serverClient, getStaffUser } from "@/lib/supabase/server";
import ConfirmButton from "@/components/admin/ConfirmButton";
import Notice from "@/components/admin/Notice";
import { createStoryFromInquiry, deleteInquiry, setInquiryHandled } from "../../actions";

const TYPES: Record<string, string> = { join: "Join the consortium", partner: "Partnership", media: "Media", story: "Veteran story", general: "General" };

export default async function Inbox({ searchParams }: { searchParams: Promise<Record<string, string>> }) {
  const sp = await searchParams;
  const sb = await serverClient();
  const [{ data: inquiries }, { data: subs, count: subCount }, me] = await Promise.all([
    sb.from("inquiries").select("*").order("handled").order("created_at", { ascending: false }).limit(200),
    sb.from("subscribers").select("email, created_at", { count: "exact" }).order("created_at", { ascending: false }).limit(100),
    getStaffUser(),
  ]);
  const isAdmin = me?.role === "admin";
  // Private story photos: short-lived signed links for staff viewing.
  const photoPaths = (inquiries ?? []).map((i) => i.photo_path).filter(Boolean) as string[];
  const signed: Record<string, string> = {};
  if (photoPaths.length) {
    const { data } = await sb.storage.from("submissions").createSignedUrls(photoPaths, 3600);
    for (const d of data ?? []) if (d.path && d.signedUrl) signed[d.path] = d.signedUrl;
  }
  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="text-2xl font-bold">Inbox & Subscribers</h1>
      <div className="mt-6"><Notice sp={sp} /></div>
      <h2 className="mt-8 text-lg font-bold">Messages</h2>
      <ul className="mt-3 space-y-3">
        {(inquiries ?? []).map((i) => (
          <li key={i.id} className={`rounded-lg bg-white p-5 shadow-sm ring-1 ${i.handled ? "ring-slate-200 opacity-70" : "ring-amber-300"}`}>
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="font-semibold">{i.name} {i.organization && <span className="font-normal text-slate-500">· {i.organization}</span>}</p>
                <a href={`mailto:${i.email}`} className="text-sm text-blue-800 underline">{i.email}</a>
              </div>
              <div className="text-right text-xs text-slate-500">
                <span className="rounded-full bg-slate-100 px-2 py-0.5 font-semibold text-slate-700">{TYPES[i.inquiry_type]}</span>
                <p className="mt-1">{new Date(i.created_at).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short", timeZone: "America/Los_Angeles" })}</p>
              </div>
            </div>
            {i.message && <p className="mt-3 whitespace-pre-wrap text-sm text-slate-700">{i.message}</p>}
            {i.inquiry_type === "story" && (
              <div className="mt-3 flex flex-col gap-4 rounded bg-slate-50 p-4 sm:flex-row">
                {i.photo_path && signed[i.photo_path] ? (
                  <a href={signed[i.photo_path]} target="_blank" rel="noopener noreferrer" className="shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={signed[i.photo_path]} alt={`Photo from ${i.name}`} className="h-36 w-28 rounded object-cover ring-1 ring-slate-200" />
                  </a>
                ) : <div className="flex h-36 w-28 shrink-0 items-center justify-center rounded bg-slate-200 text-xs text-slate-500">No photo</div>}
                <div className="min-w-0 text-sm">
                  {i.service && <p className="font-semibold text-slate-800">{i.service}</p>}
                  <p className="mt-1 whitespace-pre-wrap text-slate-700">{i.short_bio}</p>
                  <p className="mt-2 text-xs text-slate-500">{i.consent_share ? "✓ Gave permission to publish via the website form" : "No publishing permission given"}</p>
                </div>
              </div>
            )}
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <form action={setInquiryHandled.bind(null, i.id, !i.handled)}>
                <button className="rounded bg-white px-3 py-1.5 text-sm font-medium ring-1 ring-slate-300 hover:bg-slate-50">{i.handled ? "Mark as new" : "Mark as handled"}</button>
              </form>
              {i.inquiry_type === "story" && (
                <form action={createStoryFromInquiry.bind(null, i.id)}>
                  <button className="rounded bg-[#0b1d36] px-3 py-1.5 text-sm font-semibold text-white hover:bg-[#12294a]">Create draft story</button>
                </form>
              )}
              {isAdmin && <form action={deleteInquiry.bind(null, i.id)}><ConfirmButton confirmLabel="Confirm delete" /></form>}
            </div>
          </li>
        ))}
        {!inquiries?.length && <li className="rounded-lg bg-white p-8 text-center text-sm text-slate-500 ring-1 ring-slate-200">No messages yet.</li>}
      </ul>

      <div className="mt-12 flex items-center justify-between">
        <h2 className="text-lg font-bold">Newsletter subscribers ({subCount ?? 0})</h2>
        {!!subCount && <a href="/admin/subscribers.csv" download className="rounded bg-white px-3 py-2 text-sm font-medium ring-1 ring-slate-300">Download CSV</a>}
      </div>
      <p className="mt-1 text-sm text-slate-500">Import this list into your email tool (e.g. Mailchimp) to send updates.{(subCount ?? 0) > 100 ? " Showing the 100 most recent — the CSV has everyone." : ""}</p>
      <ul className="mt-3 divide-y divide-slate-100 rounded-lg bg-white text-sm ring-1 ring-slate-200">
        {(subs ?? []).map((s) => <li key={s.email} className="flex justify-between px-4 py-2"><span>{s.email}</span><span className="text-slate-500">{new Date(s.created_at).toLocaleDateString()}</span></li>)}
      </ul>
    </div>
  );
}

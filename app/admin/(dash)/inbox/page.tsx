import { serverClient, getStaffUser } from "@/lib/supabase/server";
import ConfirmButton from "@/components/admin/ConfirmButton";
import Notice from "@/components/admin/Notice";
import { removeOrphanStoryPhotos } from "@/lib/admin/cleanup";
import { IInbox, IMail } from "@/components/admin/AdminIcons";
import { timeAgo, shortDate } from "@/lib/admin/time";
import { createStoryFromInquiry, deleteInquiry, setInquiryHandled } from "../../actions";

const TYPES: Record<string, { label: string; cls: string }> = {
  join: { label: "Join the consortium", cls: "bg-navy-900 text-gold-300" },
  partner: { label: "Partnership", cls: "bg-gold-400/25 text-gold-700 ring-1 ring-gold-400/50" },
  media: { label: "Media", cls: "bg-sky-50 text-sky-800 ring-1 ring-sky-200" },
  story: { label: "Veteran story", cls: "bg-rose-50 text-rose-800 ring-1 ring-rose-200" },
  general: { label: "General", cls: "bg-slate-100 text-slate-700" },
};

export default async function Inbox({ searchParams }: { searchParams: Promise<Record<string, string>> }) {
  const sp = await searchParams;
  const sb = await serverClient();
  const [{ data: inquiries }, { data: subs, count: subCount }, me] = await Promise.all([
    sb.from("inquiries").select("*").order("handled").order("created_at", { ascending: false }).limit(200),
    sb.from("subscribers").select("email, created_at", { count: "exact" }).order("created_at", { ascending: false }).limit(100),
    getStaffUser(),
  ]);
  const isAdmin = me?.role === "admin";
  await removeOrphanStoryPhotos(sb);
  // Private story photos: short-lived signed links for staff viewing.
  const photoPaths = (inquiries ?? []).map((i) => i.photo_path).filter(Boolean) as string[];
  const signed: Record<string, string> = {};
  if (photoPaths.length) {
    const { data } = await sb.storage.from("submissions").createSignedUrls(photoPaths, 3600);
    for (const d of data ?? []) if (d.path && d.signedUrl) signed[d.path] = d.signedUrl;
  }
  const open = (inquiries ?? []).filter((i) => !i.handled);
  const done = (inquiries ?? []).filter((i) => i.handled);
  const btn = "rounded-lg bg-white px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm ring-1 ring-slate-300 hover:bg-slate-50";

  const card = (i: Record<string, any>) => {
    const t = TYPES[i.inquiry_type] ?? TYPES.general;
    return (
      <li key={i.id} className={`rounded-xl bg-white p-5 shadow-sm ring-1 transition ${i.handled ? "ring-slate-200/80" : "ring-gold-400/60"}`}>
        <div className="flex items-start gap-4">
          <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold ${i.handled ? "bg-slate-100 text-slate-500" : "bg-gradient-to-br from-gold-300 to-gold-500 text-navy-950"}`}>
            {String(i.name)[0]?.toUpperCase()}
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
              <p className="font-semibold text-slate-900">{i.name}{i.organization && <span className="font-normal text-slate-500"> · {i.organization}</span>}</p>
              <span className="text-xs text-slate-500" title={new Date(i.created_at).toLocaleString("en-US", { timeZone: "America/Los_Angeles" })}>{timeAgo(i.created_at)}</span>
            </div>
            <div className="mt-1 flex flex-wrap items-center gap-2">
              <span className={`rounded-full px-2 py-0.5 text-[0.7rem] font-semibold ${t.cls}`}>{t.label}</span>
              <a href={`mailto:${i.email}`} className="text-sm text-navy-700 hover:underline">{i.email}</a>
            </div>
            {i.message && <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-slate-700">{i.message}</p>}
            {i.inquiry_type === "story" && (
              <div className="mt-3 flex flex-col gap-4 rounded-lg bg-slate-50 p-4 ring-1 ring-slate-100 sm:flex-row">
                {i.photo_path && signed[i.photo_path] ? (
                  <a href={signed[i.photo_path]} target="_blank" rel="noopener noreferrer" className="shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={signed[i.photo_path]} alt={`Photo from ${i.name}`} className="h-36 w-28 rounded-lg object-cover ring-1 ring-slate-200" />
                  </a>
                ) : <div className="flex h-36 w-28 shrink-0 items-center justify-center rounded-lg bg-slate-200 text-xs text-slate-500">No photo</div>}
                <div className="min-w-0 text-sm">
                  {i.service && <p className="font-semibold text-slate-800">{i.service}</p>}
                  <p className="mt-1 whitespace-pre-wrap text-slate-700">{i.short_bio}</p>
                  <p className={`mt-2 text-xs font-medium ${i.consent_share ? "text-emerald-700" : "text-slate-500"}`}>{i.consent_share ? "✓ Gave permission to publish via the website form" : "No publishing permission given"}</p>
                </div>
              </div>
            )}
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <a href={`mailto:${i.email}`} className="inline-flex items-center gap-1.5 rounded-lg bg-navy-900 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-navy-800"><IMail size={14} className="text-gold-300" /> Reply</a>
              {i.inquiry_type === "story" && (
                <form action={createStoryFromInquiry.bind(null, i.id)}>
                  <button className="rounded-lg bg-gradient-to-b from-gold-400 to-gold-500 px-3 py-1.5 text-sm font-semibold text-navy-950 shadow-sm hover:brightness-105">Create draft story</button>
                </form>
              )}
              <form action={setInquiryHandled.bind(null, i.id, !i.handled)}>
                <button className={btn}>{i.handled ? "Move back to new" : "Mark as handled"}</button>
              </form>
              {isAdmin && <form action={deleteInquiry.bind(null, i.id)} className="ml-auto"><ConfirmButton confirmLabel="Confirm delete" /></form>}
            </div>
          </div>
        </div>
      </li>
    );
  };

  return (
    <div className="mx-auto max-w-5xl">
      <div className="flex items-start gap-4">
        <span className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-navy-900 text-gold-300 shadow sm:flex"><IInbox size={22} /></span>
        <div>
          <h1 className="font-display text-3xl text-navy-900">Inbox & Subscribers</h1>
          <p className="mt-1 text-sm text-slate-600">{open.length ? `${open.length} message${open.length === 1 ? "" : "s"} waiting for a reply.` : "You're all caught up."}</p>
        </div>
      </div>
      <div className="mt-6"><Notice sp={sp} /></div>

      <section aria-labelledby="new-h">
        <h2 id="new-h" className="flex items-center gap-2 font-semibold text-navy-900">New <span className="rounded-full bg-gold-400 px-2 text-xs font-bold text-navy-950">{open.length}</span></h2>
        <ul className="mt-3 space-y-3">
          {open.map(card)}
          {!open.length && <li className="rounded-xl bg-white p-8 text-center text-sm text-slate-500 ring-1 ring-slate-200/80">No new messages. 🎉</li>}
        </ul>
      </section>

      {done.length > 0 && (
        <details className="group mt-8">
          <summary className="cursor-pointer list-none font-semibold text-navy-900 marker:hidden">
            <span className="inline-flex items-center gap-2">Handled <span className="rounded-full bg-slate-200 px-2 text-xs font-bold text-slate-600">{done.length}</span>
              <span className="text-xs font-normal text-slate-500 group-open:hidden">Show</span><span className="hidden text-xs font-normal text-slate-500 group-open:inline">Hide</span></span>
          </summary>
          <ul className="mt-3 space-y-3 opacity-80">{done.map(card)}</ul>
        </details>
      )}

      <section className="mt-12 rounded-xl bg-white shadow-sm ring-1 ring-slate-200/80" aria-labelledby="subs-h">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
          <div>
            <h2 id="subs-h" className="flex items-center gap-2 font-semibold text-navy-900"><IMail size={16} className="text-gold-600" /> Newsletter subscribers</h2>
            <p className="mt-0.5 text-sm text-slate-500"><strong className="text-slate-800">{subCount ?? 0}</strong> people · import the CSV into your email tool (e.g. Mailchimp).</p>
          </div>
          {!!subCount && <a href="/admin/subscribers.csv" download className="rounded-lg bg-navy-900 px-3.5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-navy-800">Download CSV</a>}
        </div>
        <ul className="divide-y divide-slate-100 text-sm">
          {(subs ?? []).slice(0, 8).map((s) => <li key={s.email} className="flex justify-between px-5 py-2.5"><span className="truncate">{s.email}</span><span className="shrink-0 pl-3 text-slate-500">{shortDate(s.created_at)}</span></li>)}
        </ul>
        {(subs ?? []).length > 8 && (
          <details className="border-t border-slate-100">
            <summary className="cursor-pointer px-5 py-3 text-sm font-medium text-navy-700 hover:bg-slate-50">Show {(subs ?? []).length - 8} more{(subCount ?? 0) > 100 ? " (most recent 100 — the CSV has everyone)" : ""}</summary>
            <ul className="divide-y divide-slate-100 text-sm">
              {(subs ?? []).slice(8).map((s) => <li key={s.email} className="flex justify-between px-5 py-2.5"><span className="truncate">{s.email}</span><span className="shrink-0 pl-3 text-slate-500">{shortDate(s.created_at)}</span></li>)}
            </ul>
          </details>
        )}
        {!subCount && <p className="px-5 py-6 text-sm text-slate-500">No subscribers yet.</p>}
      </section>
    </div>
  );
}

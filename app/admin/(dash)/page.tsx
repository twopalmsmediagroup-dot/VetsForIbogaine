import Link from "next/link";
import { serverClient } from "@/lib/supabase/server";
import { ENTITIES } from "@/lib/admin/entities";

export default async function Overview() {
  const sb = await serverClient();
  const counts = await Promise.all(
    Object.values(ENTITIES).map(async (e) => {
      const [{ count: total }, { count: drafts }] = await Promise.all([
        sb.from(e.table).select("id", { count: "exact", head: true }),
        sb.from(e.table).select("id", { count: "exact", head: true }).eq("status", "draft"),
      ]);
      return { e, total: total ?? 0, drafts: drafts ?? 0 };
    })
  );
  const { count: newInquiries } = await sb.from("inquiries").select("id", { count: "exact", head: true }).eq("handled", false);
  const { count: subs } = await sb.from("subscribers").select("id", { count: "exact", head: true });

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="text-2xl font-bold">Welcome back</h1>
      <p className="mt-1 text-slate-600">Choose what you'd like to update. Everything you publish appears on the website within seconds.</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {counts.map(({ e, total, drafts }) => (
          <Link key={e.key} href={`/admin/${e.key}`} className="rounded-lg bg-white p-5 shadow-sm ring-1 ring-slate-200 hover:ring-blue-800">
            <p className="font-semibold">{e.label}</p>
            <p className="mt-1 text-sm text-slate-500">{e.description}</p>
            <p className="mt-3 text-sm"><strong>{total}</strong> total{drafts ? <> · <span className="text-amber-700">{drafts} draft{drafts > 1 ? "s" : ""}</span></> : null}</p>
          </Link>
        ))}
        <Link href="/admin/settings" className="rounded-lg bg-white p-5 shadow-sm ring-1 ring-slate-200 hover:ring-blue-800">
          <p className="font-semibold">Homepage & Site Settings</p>
          <p className="mt-1 text-sm text-slate-500">Homepage headlines, photos, tagline, footer, social links and donate button.</p>
        </Link>
        <Link href="/admin/inbox" className="rounded-lg bg-white p-5 shadow-sm ring-1 ring-slate-200 hover:ring-blue-800">
          <p className="font-semibold">Inbox & Subscribers</p>
          <p className="mt-1 text-sm text-slate-500">Messages from the contact form and newsletter sign-ups.</p>
          <p className="mt-3 text-sm"><strong>{newInquiries ?? 0}</strong> new message{newInquiries === 1 ? "" : "s"} · <strong>{subs ?? 0}</strong> subscribers</p>
        </Link>
      </div>
    </div>
  );
}

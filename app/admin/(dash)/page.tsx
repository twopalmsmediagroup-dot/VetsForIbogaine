import Link from "next/link";
import { serverClient, getStaffUser } from "@/lib/supabase/server";
import { ENTITIES } from "@/lib/admin/entities";
import { ENTITY_ICONS, IArrow, ICheck, IExternal, IInbox, IMail, IPencil, IPlus, ISpark } from "@/components/admin/AdminIcons";
import { firstName, timeAgo } from "@/lib/admin/time";

type Row = { id: string; title: string; status: string; updated_at: string; entity: string };

function greeting() {
  const h = Number(new Date().toLocaleString("en-US", { hour: "numeric", hour12: false, timeZone: "America/Los_Angeles" }));
  return h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
}

export default async function Overview() {
  const sb = await serverClient();
  const entities = Object.values(ENTITIES);
  const weekAgo = new Date(Date.now() - 7 * 864e5).toISOString();

  const [me, perEntity, inbox, subs, subsWeek, settings, aboutUs, partners, stories] = await Promise.all([
    getStaffUser(),
    Promise.all(entities.map(async (e) => {
      const cols = `id, ${e.titleField}, status, updated_at`;
      const [{ count: total }, { count: drafts }, { data: recent }, { data: draftRows }] = await Promise.all([
        sb.from(e.table).select("id", { count: "exact", head: true }),
        sb.from(e.table).select("id", { count: "exact", head: true }).eq("status", "draft"),
        sb.from(e.table).select(cols).order("updated_at", { ascending: false }).limit(4),
        sb.from(e.table).select(cols).eq("status", "draft").order("updated_at", { ascending: false }).limit(3),
      ]);
      const toRow = (r: Record<string, unknown>): Row => ({ id: String(r.id), title: String(r[e.titleField] ?? "(untitled)"), status: String(r.status), updated_at: String(r.updated_at), entity: e.key });
      return { e, total: total ?? 0, drafts: drafts ?? 0, recent: ((recent ?? []) as unknown as Record<string, unknown>[]).map(toRow), draftRows: ((draftRows ?? []) as unknown as Record<string, unknown>[]).map(toRow) };
    })),
    sb.from("inquiries").select("id, name, inquiry_type, created_at", { count: "exact" }).eq("handled", false).order("created_at", { ascending: false }).limit(3),
    sb.from("subscribers").select("id", { count: "exact", head: true }),
    sb.from("subscribers").select("id", { count: "exact", head: true }).gte("created_at", weekAgo),
    sb.from("site_settings").select("*").eq("id", 1).maybeSingle(),
    sb.from("pages").select("id, body").eq("slug", "about-us").maybeSingle(),
    sb.from("organizations").select("id", { count: "exact", head: true }).eq("relationship", "confirmed_partner").eq("status", "published"),
    sb.from("veteran_stories").select("id", { count: "exact", head: true }).eq("status", "published"),
  ]);

  const drafts = perEntity.reduce((n, x) => n + x.drafts, 0);
  const published = perEntity.reduce((n, x) => n + x.total - x.drafts, 0);
  const newMessages = inbox.count ?? 0;
  const recent = perEntity.flatMap((x) => x.recent).sort((a, b) => b.updated_at.localeCompare(a.updated_at)).slice(0, 6);
  const draftList = perEntity.flatMap((x) => x.draftRows).sort((a, b) => b.updated_at.localeCompare(a.updated_at)).slice(0, 4);
  const s = (settings.data ?? {}) as Record<string, string | null>;

  const checklist = [
    { label: "Homepage photos added", done: ["hero_image_url", "mission_image_url", "about_image_url", "timeline_image_url"].every((k) => s[k]), href: "/admin/settings" },
    { label: "About Us bio written", done: !!aboutUs.data?.body && !/replace this/i.test(String(aboutUs.data.body)), href: aboutUs.data ? `/admin/pages/${aboutUs.data.id}` : "/admin/pages" },
    { label: "Public contact email set", done: !!s.contact_email, href: "/admin/settings" },
    { label: "Social media links added", done: ["linkedin_url", "instagram_url", "youtube_url", "x_url"].some((k) => s[k]), href: "/admin/settings" },
    { label: "First veteran story published", done: (stories.count ?? 0) > 0, href: "/admin/stories" },
    { label: "First confirmed partner listed", done: (partners.count ?? 0) > 0, href: "/admin/organizations" },
    { label: "Email alerts for new messages on", done: !!process.env.RESEND_API_KEY, href: null },
  ];
  const doneCount = checklist.filter((c) => c.done).length;
  const pct = Math.round((doneCount / checklist.length) * 100);

  const summary = [
    newMessages ? `${newMessages} new message${newMessages === 1 ? "" : "s"}` : null,
    drafts ? `${drafts} draft${drafts === 1 ? "" : "s"} in progress` : null,
  ].filter(Boolean).join(" and ");

  const stat = "rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200/80";
  const quick = [
    { href: "/admin/articles/new", label: "New article" },
    { href: "/admin/resources/new", label: "Add a resource" },
    { href: "/admin/stories/new", label: "Add a story" },
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      {/* Welcome banner */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-navy-900 via-navy-800 to-navy-700 p-6 text-white shadow-lg sm:p-8">
        <div className="pointer-events-none absolute -top-20 -right-16 h-64 w-64 rounded-full bg-gold-400/20 blur-3xl" aria-hidden="true" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.06]" style={{ backgroundImage: "radial-gradient(#e2c98a 1px, transparent 1px)", backgroundSize: "20px 20px" }} aria-hidden="true" />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold tracking-[0.18em] text-gold-300 uppercase">
              {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", timeZone: "America/Los_Angeles" })}
            </p>
            <h1 className="mt-2 font-display text-3xl sm:text-4xl">{greeting()}{firstName(me?.email) ? `, ${firstName(me?.email)}` : ""}.</h1>
            <p className="mt-2 max-w-xl text-white/80">
              {summary ? <>You have <strong className="text-white">{summary}</strong>.</> : "Everything is up to date. Nice work."}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {quick.map((q) => (
              <Link key={q.href} href={q.href} className="inline-flex items-center gap-1.5 rounded-lg bg-white/10 px-3.5 py-2 text-sm font-medium ring-1 ring-white/15 backdrop-blur transition hover:bg-white/20">
                <IPlus size={15} className="text-gold-300" /> {q.label}
              </Link>
            ))}
            <Link href="/" target="_blank" className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-b from-gold-400 to-gold-500 px-3.5 py-2 text-sm font-semibold text-navy-950 shadow transition hover:brightness-105">
              View site <IExternal size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4" aria-label="At a glance">
        <Link href="/admin/inbox" className={`${stat} group transition hover:ring-gold-400 ${newMessages ? "ring-2 ring-gold-400/70" : ""}`}>
          <p className="flex items-center gap-2 text-xs font-semibold tracking-wide text-slate-500 uppercase"><IInbox size={15} className="text-gold-600" /> New messages</p>
          <p className="mt-2 text-3xl font-bold text-navy-900">{newMessages}</p>
          <p className="mt-1 text-xs text-slate-500 group-hover:text-navy-800">Open inbox →</p>
        </Link>
        <div className={stat}>
          <p className="flex items-center gap-2 text-xs font-semibold tracking-wide text-slate-500 uppercase"><IPencil size={15} className="text-amber-600" /> Drafts</p>
          <p className="mt-2 text-3xl font-bold text-navy-900">{drafts}</p>
          <p className="mt-1 text-xs text-slate-500">Hidden until published</p>
        </div>
        <div className={stat}>
          <p className="flex items-center gap-2 text-xs font-semibold tracking-wide text-slate-500 uppercase"><ICheck size={15} className="text-emerald-600" /> Live items</p>
          <p className="mt-2 text-3xl font-bold text-navy-900">{published}</p>
          <p className="mt-1 text-xs text-slate-500">Published on the site</p>
        </div>
        <div className={stat}>
          <p className="flex items-center gap-2 text-xs font-semibold tracking-wide text-slate-500 uppercase"><IMail size={15} className="text-navy-600" /> Subscribers</p>
          <p className="mt-2 text-3xl font-bold text-navy-900">{subs.count ?? 0}</p>
          <p className="mt-1 text-xs text-emerald-700">{subsWeek.count ? `+${subsWeek.count} this week` : <span className="text-slate-500">No new this week</span>}</p>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        {/* Needs attention */}
        <section className="rounded-xl bg-white shadow-sm ring-1 ring-slate-200/80" aria-labelledby="attn-h">
          <h2 id="attn-h" className="border-b border-slate-100 px-5 py-4 font-semibold text-navy-900">Needs your attention</h2>
          <ul className="divide-y divide-slate-100">
            {(inbox.data ?? []).map((m) => (
              <li key={m.id}>
                <Link href="/admin/inbox" className="flex items-center gap-3 px-5 py-3 transition hover:bg-slate-50">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gold-400/20 text-sm font-bold text-gold-700">{String(m.name)[0]?.toUpperCase()}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium text-slate-900">New message from {m.name}</span>
                    <span className="block text-xs text-slate-500"><span className="capitalize">{m.inquiry_type === "story" ? "Veteran story submission" : m.inquiry_type}</span> · {timeAgo(m.created_at)}</span>
                  </span>
                  <IArrow size={16} className="text-slate-400" />
                </Link>
              </li>
            ))}
            {draftList.map((d) => (
              <li key={`${d.entity}-${d.id}`}>
                <Link href={`/admin/${d.entity}/${d.id}`} className="flex items-center gap-3 px-5 py-3 transition hover:bg-slate-50">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-700"><IPencil size={15} /></span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium text-slate-900">Finish draft: {d.title}</span>
                    <span className="block text-xs text-slate-500">{ENTITIES[d.entity].singular} · edited {timeAgo(d.updated_at)}</span>
                  </span>
                  <IArrow size={16} className="text-slate-400" />
                </Link>
              </li>
            ))}
            {!newMessages && !draftList.length && (
              <li className="flex items-center gap-3 px-5 py-8 text-sm text-slate-500"><ISpark className="text-gold-500" /> Nothing waiting on you right now.</li>
            )}
          </ul>
        </section>

        {/* Launch checklist */}
        <section className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200/80" aria-labelledby="chk-h">
          <div className="flex items-baseline justify-between">
            <h2 id="chk-h" className="font-semibold text-navy-900">Launch checklist</h2>
            <span className="text-sm text-slate-500">{doneCount} of {checklist.length}</span>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label="Launch checklist progress">
            <div className="h-full rounded-full bg-gradient-to-r from-gold-500 to-gold-400" style={{ width: `${pct}%` }} />
          </div>
          <ul className="mt-4 space-y-1">
            {checklist.map((c) => {
              const inner = (
                <>
                  <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${c.done ? "bg-emerald-500 text-white" : "ring-1 ring-slate-300"}`}>
                    {c.done && <ICheck size={13} />}
                  </span>
                  <span className={`flex-1 ${c.done ? "text-slate-400 line-through" : "text-slate-800"}`}>{c.label}</span>
                  {!c.done && c.href && <IArrow size={14} className="text-slate-400" />}
                  {!c.done && !c.href && <span className="text-xs text-slate-400">Vercel setting</span>}
                </>
              );
              return (
                <li key={c.label}>
                  {c.href && !c.done
                    ? <Link href={c.href} className="flex items-center gap-3 rounded-md px-2 py-1.5 text-sm transition hover:bg-slate-50">{inner}</Link>
                    : <div className="flex items-center gap-3 px-2 py-1.5 text-sm">{inner}</div>}
                </li>
              );
            })}
          </ul>
        </section>
      </div>

      {/* Content sections */}
      <section aria-labelledby="content-h">
        <h2 id="content-h" className="mb-3 font-semibold text-navy-900">Manage content</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {perEntity.map(({ e, total, drafts: d }) => {
            const Icon = ENTITY_ICONS[e.key];
            return (
              <div key={e.key} className="group relative flex flex-col rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200/80 transition hover:-translate-y-0.5 hover:shadow-md hover:ring-gold-400/70">
                <div className="flex items-start justify-between gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-navy-900 text-gold-300 shadow-inner"><Icon size={20} /></span>
                  <Link href={`/admin/${e.key}/new`} className="relative z-10 inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-semibold text-navy-800 ring-1 ring-slate-200 transition hover:bg-navy-900 hover:text-white" aria-label={`Add ${e.singular.toLowerCase()}`}>
                    <IPlus size={13} /> Add
                  </Link>
                </div>
                <Link href={`/admin/${e.key}`} className="mt-4 font-semibold text-slate-900 after:absolute after:inset-0">{e.label}</Link>
                <p className="mt-1 line-clamp-2 text-sm text-slate-500">{e.description}</p>
                <div className="mt-4 flex gap-2 text-xs">
                  <span className="rounded-full bg-emerald-50 px-2 py-0.5 font-medium text-emerald-700 ring-1 ring-emerald-200">{total - d} live</span>
                  {d > 0 && <span className="rounded-full bg-amber-50 px-2 py-0.5 font-medium text-amber-700 ring-1 ring-amber-200">{d} draft{d > 1 ? "s" : ""}</span>}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Recent activity */}
      <section className="rounded-xl bg-white shadow-sm ring-1 ring-slate-200/80" aria-labelledby="recent-h">
        <h2 id="recent-h" className="border-b border-slate-100 px-5 py-4 font-semibold text-navy-900">Recently edited</h2>
        <ul className="divide-y divide-slate-100">
          {recent.map((r) => {
            const Icon = ENTITY_ICONS[r.entity];
            return (
              <li key={`${r.entity}-${r.id}`}>
                <Link href={`/admin/${r.entity}/${r.id}`} className="flex items-center gap-3 px-5 py-3 text-sm transition hover:bg-slate-50">
                  <Icon size={16} className="shrink-0 text-slate-400" />
                  <span className="min-w-0 flex-1 truncate font-medium text-slate-800">{r.title}</span>
                  <span className={`hidden rounded-full px-2 py-0.5 text-xs font-medium sm:inline ${r.status === "published" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>{r.status === "published" ? "Live" : "Draft"}</span>
                  <span className="w-24 shrink-0 text-right text-xs text-slate-500">{timeAgo(r.updated_at)}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}

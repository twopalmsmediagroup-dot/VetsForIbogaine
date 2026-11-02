import Link from "next/link";
import { notFound } from "next/navigation";
import { serverClient } from "@/lib/supabase/server";
import { ENTITIES } from "@/lib/admin/entities";
import Notice from "@/components/admin/Notice";
import { ENTITY_ICONS, IPlus, ISearch } from "@/components/admin/AdminIcons";
import { shortDate, timeAgo } from "@/lib/admin/time";
import { fetchMissingThumbnails } from "../../actions";

type Props = { params: Promise<{ entity: string }>; searchParams: Promise<Record<string, string>> };

export default async function EntityList({ params, searchParams }: Props) {
  const { entity: key } = await params;
  const sp = await searchParams;
  const e = ENTITIES[key];
  if (!e) notFound();
  const sb = await serverClient();
  const search = (sp.q ?? "").replace(/[%_]/g, "").trim();
  const status = sp.status === "draft" || sp.status === "published" ? sp.status : "";

  let q = sb.from(e.table).select("*");
  for (const o of e.order) q = q.order(o.column, { ascending: o.ascending, nullsFirst: false });
  if (search) q = q.ilike(e.titleField, `%${search}%`);
  if (status) q = q.eq("status", status);
  const count = (s?: string) => {
    let c = sb.from(e.table).select("id", { count: "exact", head: true });
    if (search) c = c.ilike(e.titleField, `%${search}%`);
    return s ? c.eq("status", s) : c;
  };
  const [{ data: rows }, all, pub, dra] = await Promise.all([q.limit(500), count(), count("published"), count("draft")]);

  const imageField = e.fields.find((f) => f.type === "image")?.name;
  const Icon = ENTITY_ICONS[key];
  const fieldLabel = (col: string, val: unknown) => {
    const f = e.fields.find((x) => x.name === col);
    if (f?.type === "date") return shortDate(val as string);
    return f?.options?.find((o) => o.value === val)?.label.split(" (")[0].split(" —")[0] ?? (val as string) ?? "—";
  };
  const tabHref = (s: string) => {
    const u = new URLSearchParams(); if (search) u.set("q", search); if (s) u.set("status", s);
    const str = u.toString(); return `/admin/${key}${str ? `?${str}` : ""}`;
  };
  const tabs = [{ s: "", label: "All", n: all.count ?? 0 }, { s: "published", label: "Live", n: pub.count ?? 0 }, { s: "draft", label: "Drafts", n: dra.count ?? 0 }];

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex items-start gap-4">
          <span className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-navy-900 text-gold-300 shadow sm:flex"><Icon size={22} /></span>
          <div>
            <h1 className="font-display text-3xl text-navy-900">{e.label}</h1>
            <p className="mt-1 max-w-2xl text-sm text-slate-600">{e.description}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {key === "articles" && (
            <form action={fetchMissingThumbnails}>
              <button className="rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-slate-300 hover:bg-slate-50">Fetch missing thumbnails</button>
            </form>
          )}
          <Link href={`/admin/${key}/new`} className="inline-flex items-center gap-1.5 rounded-lg bg-navy-900 px-4 py-2.5 text-sm font-semibold text-white shadow hover:bg-navy-800">
            <IPlus size={16} className="text-gold-300" /> Add {e.singular.toLowerCase()}
          </Link>
        </div>
      </div>
      <div className="mt-6"><Notice sp={sp} /></div>

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <nav aria-label="Filter by status" className="flex gap-1 rounded-lg bg-slate-200/60 p-1">
          {tabs.map((t) => {
            const on = status === t.s;
            return (
              <Link key={t.label} href={tabHref(t.s)} aria-current={on ? "page" : undefined}
                className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${on ? "bg-white text-navy-900 shadow-sm" : "text-slate-600 hover:text-navy-900"}`}>
                {t.label} <span className={`ml-1 text-xs ${on ? "text-gold-700" : "text-slate-400"}`}>{t.n}</span>
              </Link>
            );
          })}
        </nav>
        <form className="relative">
          {status && <input type="hidden" name="status" value={status} />}
          <ISearch size={16} className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-slate-400" />
          <input name="q" type="search" defaultValue={search} placeholder={`Search ${e.label.toLowerCase()}…`} aria-label="Search by title"
            className="w-full rounded-lg border border-slate-300 bg-white py-2 pr-3 pl-9 text-sm shadow-sm focus:border-navy-700 focus:ring-2 focus:ring-navy-700/15 focus:outline-none sm:w-72" />
        </form>
      </div>

      <div className="overflow-x-auto rounded-xl bg-white shadow-sm ring-1 ring-slate-200/80">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-100 text-xs font-semibold tracking-wide text-slate-500 uppercase">
            <tr>
              <th className="px-5 py-3">Title</th>
              {e.columns.map((c) => <th key={c.name} className="hidden px-4 py-3 md:table-cell">{c.label}</th>)}
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {(rows ?? []).map((r: Record<string, unknown>) => {
              const title = (r[e.titleField] as string) || "(untitled)";
              const thumb = imageField ? (r[imageField] as string | null) : null;
              return (
                <tr key={r.id as string} className="group relative transition hover:bg-gold-300/10">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      {imageField && (thumb
                        // eslint-disable-next-line @next/next/no-img-element
                        ? <img src={thumb} alt="" className="h-10 w-10 shrink-0 rounded-md object-cover ring-1 ring-slate-200" />
                        : <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-slate-100 text-sm font-semibold text-slate-400">{title[0]?.toUpperCase()}</span>)}
                      <div className="min-w-0">
                        <Link href={`/admin/${key}/${r.id}`} className="font-semibold text-slate-900 group-hover:text-navy-700 after:absolute after:inset-0">{title}</Link>
                        <p className="text-xs text-slate-500">Edited {timeAgo(r.updated_at as string)}</p>
                      </div>
                    </div>
                  </td>
                  {e.columns.map((c) => <td key={c.name} className="hidden px-4 py-3 text-slate-600 md:table-cell">{fieldLabel(c.name, r[c.name])}</td>)}
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${r.status === "published" ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200" : "bg-amber-50 text-amber-700 ring-1 ring-amber-200"}`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${r.status === "published" ? "bg-emerald-500" : "bg-amber-500"}`} aria-hidden="true" />
                      {r.status === "published" ? "Live" : "Draft"}
                    </span>
                  </td>
                </tr>
              );
            })}
            {!rows?.length && (
              <tr><td colSpan={e.columns.length + 2} className="px-5 py-14 text-center">
                <Icon size={28} className="mx-auto text-slate-300" />
                <p className="mt-2 font-medium text-slate-700">{search || status ? "Nothing matches that filter." : `No ${e.label.toLowerCase()} yet.`}</p>
                {!search && !status && <Link href={`/admin/${key}/new`} className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-navy-700 hover:underline"><IPlus size={14} /> Add the first one</Link>}
              </td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

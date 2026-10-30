import Link from "next/link";
import { notFound } from "next/navigation";
import { serverClient } from "@/lib/supabase/server";
import { ENTITIES } from "@/lib/admin/entities";
import Notice from "@/components/admin/Notice";

type Props = { params: Promise<{ entity: string }>; searchParams: Promise<Record<string, string>> };

export default async function EntityList({ params, searchParams }: Props) {
  const { entity: key } = await params;
  const sp = await searchParams;
  const e = ENTITIES[key];
  if (!e) notFound();
  const sb = await serverClient();
  let q = sb.from(e.table).select("*");
  for (const o of e.order) q = q.order(o.column, { ascending: o.ascending, nullsFirst: false });
  if (sp.q) q = q.ilike(e.titleField, `%${sp.q.replace(/[%_]/g, "")}%`);
  if (sp.status === "draft" || sp.status === "published") q = q.eq("status", sp.status);
  const { data: rows } = await q.limit(500);

  const fieldLabel = (col: string, val: unknown) => {
    const f = e.fields.find((x) => x.name === col);
    return f?.options?.find((o) => o.value === val)?.label.split(" (")[0].split(" —")[0] ?? (val as string) ?? "—";
  };

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">{e.label}</h1>
          <p className="mt-1 text-sm text-slate-600">{e.description}</p>
        </div>
        <Link href={`/admin/${key}/new`} className="rounded bg-[#0b1d36] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#12294a]">+ Add {e.singular.toLowerCase()}</Link>
      </div>
      <div className="mt-6"><Notice sp={sp} /></div>
      <form className="mb-4 flex flex-wrap gap-2">
        <input name="q" defaultValue={sp.q} placeholder="Search by title…" className="w-64 rounded border border-slate-300 bg-white px-3 py-2 text-sm" />
        <select name="status" defaultValue={sp.status || ""} className="rounded border border-slate-300 bg-white px-3 py-2 text-sm">
          <option value="">All</option><option value="published">Published</option><option value="draft">Drafts</option>
        </select>
        <button className="rounded bg-white px-3 py-2 text-sm font-medium ring-1 ring-slate-300">Filter</button>
      </form>
      <div className="overflow-x-auto rounded-lg bg-white shadow-sm ring-1 ring-slate-200">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Title</th>
              {e.columns.map((c) => <th key={c.name} className="px-4 py-3">{c.label}</th>)}
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {(rows ?? []).map((r: Record<string, unknown>) => (
              <tr key={r.id as string} className="hover:bg-slate-50">
                <td className="px-4 py-3 font-medium">
                  <Link href={`/admin/${key}/${r.id}`} className="text-blue-900 hover:underline">{(r[e.titleField] as string) || "(untitled)"}</Link>
                </td>
                {e.columns.map((c) => <td key={c.name} className="px-4 py-3 text-slate-600">{fieldLabel(c.name, r[c.name])}</td>)}
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${r.status === "published" ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"}`}>
                    {r.status === "published" ? "Published" : "Draft"}
                  </span>
                </td>
              </tr>
            ))}
            {!rows?.length && <tr><td colSpan={e.columns.length + 2} className="px-4 py-10 text-center text-slate-500">Nothing here yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

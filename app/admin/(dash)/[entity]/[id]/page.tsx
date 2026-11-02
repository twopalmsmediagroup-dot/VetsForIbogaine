import Link from "next/link";
import { notFound } from "next/navigation";
import { serverClient, getStaffUser } from "@/lib/supabase/server";
import { ENTITIES } from "@/lib/admin/entities";
import FieldInput from "@/components/admin/FieldInput";
import ConfirmButton from "@/components/admin/ConfirmButton";
import Notice from "@/components/admin/Notice";
import UnsavedGuard from "@/components/admin/UnsavedGuard";
import { ENTITY_ICONS, IExternal } from "@/components/admin/AdminIcons";
import { timeAgo } from "@/lib/admin/time";
import { saveEntity, deleteEntity } from "../../../actions";

type Props = { params: Promise<{ entity: string; id: string }>; searchParams: Promise<Record<string, string>> };

export default async function EntityEdit({ params, searchParams }: Props) {
  const { entity: key, id } = await params;
  const sp = await searchParams;
  const e = ENTITIES[key];
  if (!e) notFound();
  const isNew = id === "new";
  const sb = await serverClient();
  let row: Record<string, unknown> = {};
  if (!isNew) {
    const { data } = await sb.from(e.table).select("*").eq("id", id).maybeSingle();
    if (!data) notFound();
    row = data;
  }
  const { data: areas } = await sb.from("pages").select("slug, title").eq("kind", "consortium_area").order("sort_order");
  const user = await getStaffUser();
  const Icon = ENTITY_ICONS[key];
  const path = isNew ? null : e.publicPath?.(row) ?? null;
  const publicPath = row.status === "published" ? path : null;
  // Drafts can be previewed on the site itself (outside links can't).
  const previewPath = row.status !== "published" && path?.startsWith("/") ? `/admin/preview?path=${encodeURIComponent(path)}` : null;

  return (
    <div className="mx-auto max-w-4xl">
      <Link href={`/admin/${key}`} className="inline-flex items-center gap-1.5 text-sm text-slate-600 hover:text-navy-900"><Icon size={15} /> {e.label}</Link>
      <div className="mt-2 flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h1 className="font-display text-3xl text-navy-900">{isNew ? `New ${e.singular.toLowerCase()}` : (row[e.titleField] as string)}</h1>
          {!isNew && (
            <p className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-500">
              <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 font-semibold ${row.status === "published" ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200" : "bg-amber-50 text-amber-700 ring-1 ring-amber-200"}`}>
                <span className={`h-1.5 w-1.5 rounded-full ${row.status === "published" ? "bg-emerald-500" : "bg-amber-500"}`} aria-hidden="true" />
                {row.status === "published" ? "Live on the website" : "Draft — hidden from the public"}
              </span>
              {!!row.updated_at && <span>Last saved {timeAgo(row.updated_at as string)}</span>}
            </p>
          )}
        </div>
        <div className="flex gap-2">
          {publicPath && <a href={publicPath} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-lg bg-white px-3 py-2 text-sm font-medium text-navy-800 shadow-sm ring-1 ring-slate-300 hover:bg-slate-50">View on website <IExternal size={14} /></a>}
          {previewPath && <a href={previewPath} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-lg bg-white px-3 py-2 text-sm font-medium text-navy-800 shadow-sm ring-1 ring-slate-300 hover:bg-slate-50">Preview draft <IExternal size={14} /></a>}
        </div>
      </div>
      <div className="mt-6"><Notice sp={sp} /></div>
      <form id="entity-form" action={saveEntity.bind(null, key, isNew ? null : id)} className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200/80 sm:p-8">
        <div className="grid gap-6 sm:grid-cols-2">
          {e.fields.map((f) => <FieldInput key={f.name} f={f} value={isNew ? (f.name === "published_at" ? new Date().toISOString().slice(0, 10) : undefined) : row[f.name]} areas={areas ?? []} folder={key} />)}
        </div>
        <div className="sticky bottom-0 -mx-6 mt-8 flex items-center gap-4 rounded-b-xl border-t border-slate-200 bg-white/95 px-6 py-4 backdrop-blur sm:-mx-8 sm:px-8">
          <button className="rounded-lg bg-gradient-to-b from-navy-800 to-navy-900 px-6 py-2.5 text-sm font-semibold text-white shadow hover:from-navy-700 hover:to-navy-800">Save</button>
          <Link href={`/admin/${key}`} className="text-sm text-slate-600 hover:text-navy-900">Cancel</Link>
          <span className="ml-auto"><UnsavedGuard formId="entity-form" /></span>
        </div>
      </form>
      {!isNew && user?.role === "admin" && (
        <form action={deleteEntity.bind(null, key, id)} className="mt-6 flex items-center justify-between gap-4 rounded-xl border border-red-200 bg-white p-4">
          <p className="text-sm text-slate-600">Want to hide it instead? Set Visibility to <strong>Draft</strong> and save.</p>
          <ConfirmButton />
        </form>
      )}
    </div>
  );
}

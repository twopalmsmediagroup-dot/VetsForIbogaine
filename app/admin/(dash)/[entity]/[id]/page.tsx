import Link from "next/link";
import { notFound } from "next/navigation";
import { serverClient, getStaffUser } from "@/lib/supabase/server";
import { ENTITIES } from "@/lib/admin/entities";
import FieldInput from "@/components/admin/FieldInput";
import ConfirmButton from "@/components/admin/ConfirmButton";
import Notice from "@/components/admin/Notice";
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
  const publicPath = !isNew && row.status === "published" ? e.publicPath?.(row) : null;

  return (
    <div className="mx-auto max-w-4xl">
      <Link href={`/admin/${key}`} className="text-sm text-slate-600 hover:underline">← {e.label}</Link>
      <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">{isNew ? `New ${e.singular.toLowerCase()}` : (row[e.titleField] as string)}</h1>
        {publicPath && <a href={publicPath} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-blue-800 underline">View on website ↗</a>}
      </div>
      <div className="mt-6"><Notice sp={sp} /></div>
      <form action={saveEntity.bind(null, key, isNew ? null : id)} className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8">
        <div className="grid gap-6 sm:grid-cols-2">
          {e.fields.map((f) => <FieldInput key={f.name} f={f} value={isNew ? (f.name === "published_at" ? new Date().toISOString().slice(0, 10) : undefined) : row[f.name]} areas={areas ?? []} folder={key} />)}
        </div>
        <div className="sticky bottom-0 -mx-6 mt-8 flex items-center gap-3 border-t border-slate-200 bg-white px-6 py-4 sm:-mx-8 sm:px-8">
          <button className="rounded bg-[#0b1d36] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#12294a]">Save</button>
          <Link href={`/admin/${key}`} className="text-sm text-slate-600 underline">Cancel</Link>
        </div>
      </form>
      {!isNew && user?.role === "admin" && (
        <form action={deleteEntity.bind(null, key, id)} className="mt-6 flex items-center justify-between rounded-lg border border-red-200 bg-white p-4">
          <p className="text-sm text-slate-600">Want to hide it instead? Set Visibility to <strong>Draft</strong> and save.</p>
          <ConfirmButton />
        </form>
      )}
    </div>
  );
}

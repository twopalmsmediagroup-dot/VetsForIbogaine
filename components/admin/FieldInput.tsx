import type { Field } from "@/lib/admin/entities";
import ImageUpload from "./ImageUpload";
import MarkdownEditor from "./MarkdownEditor";
import GalleryUpload from "./GalleryUpload";

const input = "w-full rounded border border-slate-300 bg-white px-3 py-2.5 text-sm focus:border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-700/20";

export default function FieldInput({ f, value, areas, folder }: { f: Field; value: unknown; areas: { slug: string; title: string }[]; folder: string }) {
  const id = `f-${f.name}`;
  const v = value ?? f.defaultValue ?? "";
  let control: React.ReactNode;
  switch (f.type) {
    case "textarea":
      control = <textarea id={id} name={f.name} defaultValue={String(v)} rows={3} className={input} />; break;
    case "gallery":
      control = <GalleryUpload name={f.name} defaultValue={Array.isArray(value) ? (value as string[]) : []} folder={folder} />; break;
    case "markdown":
      control = <MarkdownEditor name={f.name} defaultValue={String(v)} />; break;
    case "image":
      control = <ImageUpload name={f.name} defaultValue={String(v)} folder={folder} />; break;
    case "select":
      control = (
        <select id={id} name={f.name} defaultValue={String(v)} className={input}>
          {f.options!.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      ); break;
    case "area":
      control = (
        <select id={id} name={f.name} defaultValue={String(v)} className={input}>
          <option value="">— None —</option>
          {areas.map((a) => <option key={a.slug} value={a.slug}>{a.title}</option>)}
        </select>
      ); break;
    case "checkbox":
      return (
        <label className="flex items-center gap-3 self-end rounded border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-800">
          <input type="checkbox" name={f.name} defaultChecked={Boolean(value)} className="h-4 w-4 accent-blue-800" /> {f.label}
        </label>
      );
    case "date":
      control = <input id={id} name={f.name} type="date" defaultValue={String(v)} className={input} />; break;
    case "number":
      control = <input id={id} name={f.name} type="number" defaultValue={String(v)} className={input} required={f.required} />; break;
    case "url":
      control = <input id={id} name={f.name} type="text" inputMode="url" placeholder="https://" defaultValue={String(v)} className={input} />; break;
    case "slug":
      control = (
        <div className="flex items-center rounded border border-slate-300 bg-slate-50 text-sm">
          <span className="pl-3 text-slate-500">/</span>
          <input id={id} name={f.name} defaultValue={String(v)} placeholder="created automatically from the title" className="w-full bg-transparent px-1 py-2.5 focus:outline-none" />
        </div>
      ); break;
    default:
      control = <input id={id} name={f.name} defaultValue={String(v)} className={input} required={f.required} />;
  }
  return (
    <div className={f.wide || f.type === "markdown" || f.type === "image" || f.type === "gallery" ? "sm:col-span-2" : ""}>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-slate-800">{f.label}{f.required && <span className="text-red-700"> *</span>}</label>
      {control}
      {f.help && <p className="mt-1.5 text-xs text-slate-500">{f.help}</p>}
    </div>
  );
}

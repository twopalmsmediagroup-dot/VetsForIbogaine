import { ICheck } from "./AdminIcons";

const box = "mb-6 flex items-start gap-3 rounded-lg border px-4 py-3 text-sm shadow-sm";

export default function Notice({ sp }: { sp: Record<string, string | undefined> }) {
  if (sp.error) return <div role="alert" className={`${box} border-red-200 bg-red-50 text-red-800`}><span className="mt-px font-bold">!</span><span>{sp.error}</span></div>;
  if (sp.saved) return (
    <div role="status" className={`${box} border-emerald-200 bg-emerald-50 text-emerald-900`}>
      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white"><ICheck size={13} /></span>
      <span><strong>Saved.</strong> Changes appear on the website within a few seconds.</span>
    </div>
  );
  if (sp.deleted) return <div role="status" className={`${box} border-slate-200 bg-white text-slate-700`}>Deleted.</div>;
  if (sp.info) return <div role="status" className={`${box} border-blue-200 bg-blue-50 text-blue-900`}>{sp.info}</div>;
  return null;
}

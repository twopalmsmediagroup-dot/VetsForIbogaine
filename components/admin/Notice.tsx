export default function Notice({ sp }: { sp: Record<string, string | undefined> }) {
  if (sp.error) return <div role="alert" className="mb-6 rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{sp.error}</div>;
  if (sp.saved) return <div role="status" className="mb-6 rounded border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">Saved. Changes appear on the website within a few seconds.</div>;
  if (sp.deleted) return <div role="status" className="mb-6 rounded border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">Deleted.</div>;
  if (sp.info) return <div role="status" className="mb-6 rounded border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-900">{sp.info}</div>;
  return null;
}

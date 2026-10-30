import { serverClient } from "@/lib/supabase/server";
import { SETTINGS_GROUPS } from "@/lib/admin/entities";
import FieldInput from "@/components/admin/FieldInput";
import Notice from "@/components/admin/Notice";
import { saveSettings } from "../../actions";

export default async function SettingsPage({ searchParams }: { searchParams: Promise<Record<string, string>> }) {
  const sp = await searchParams;
  const sb = await serverClient();
  const { data } = await sb.from("site_settings").select("*").eq("id", 1).single();
  const row = (data ?? {}) as Record<string, unknown>;
  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="text-2xl font-bold">Homepage & Site Settings</h1>
      <p className="mt-1 text-sm text-slate-600">Headlines, photos and text used across the homepage, plus footer and social links. Where no photo is set, the site shows a navy panel with the brain mark.</p>
      <div className="mt-6"><Notice sp={sp} /></div>
      <form action={saveSettings} className="space-y-6">
        {SETTINGS_GROUPS.map((g) => (
          <fieldset key={g.title} className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8">
            <legend className="sr-only">{g.title}</legend>
            <h2 className="mb-5 text-lg font-bold">{g.title}</h2>
            <div className="grid gap-6 sm:grid-cols-2">
              {g.fields.map((f) => <FieldInput key={f.name} f={f} value={row[f.name]} areas={[]} folder="site" />)}
            </div>
          </fieldset>
        ))}
        <div className="sticky bottom-0 flex items-center gap-3 rounded-lg bg-white px-6 py-4 shadow ring-1 ring-slate-200">
          <button className="rounded bg-[#0b1d36] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#12294a]">Save all settings</button>
        </div>
      </form>
    </div>
  );
}

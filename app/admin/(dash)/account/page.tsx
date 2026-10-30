import Notice from "@/components/admin/Notice";
import { getStaffUser } from "@/lib/supabase/server";
import { updatePassword } from "../../actions";

export default async function Account({ searchParams }: { searchParams: Promise<Record<string, string>> }) {
  const sp = await searchParams;
  const me = await getStaffUser();
  const input = "w-full rounded border border-slate-300 px-3 py-2.5 text-sm";
  return (
    <div className="mx-auto max-w-md">
      <h1 className="text-2xl font-bold">My Account</h1>
      <p className="mt-1 text-sm text-slate-600">Signed in as {me?.email} ({me?.role}).</p>
      <div className="mt-6"><Notice sp={sp} /></div>
      <form action={updatePassword} className="space-y-4 rounded-lg bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <h2 className="font-bold">Change password</h2>
        <div><label htmlFor="pw" className="mb-1 block text-sm font-semibold">New password</label><input id="pw" name="password" type="password" minLength={10} autoComplete="new-password" required className={input} /></div>
        <div><label htmlFor="pw2" className="mb-1 block text-sm font-semibold">Confirm new password</label><input id="pw2" name="confirm" type="password" minLength={10} autoComplete="new-password" required className={input} /></div>
        <button className="rounded bg-[#0b1d36] px-4 py-2.5 text-sm font-semibold text-white">Update password</button>
      </form>
    </div>
  );
}

import { serverClient, getStaffUser } from "@/lib/supabase/server";
import Notice from "@/components/admin/Notice";
import { addTeamMember, removeTeamMember } from "../../actions";

export default async function Team({ searchParams }: { searchParams: Promise<Record<string, string>> }) {
  const sp = await searchParams;
  const me = await getStaffUser();
  const sb = await serverClient();
  const [{ data: allow }, { data: profiles }] = await Promise.all([
    sb.from("admin_allowlist").select("*").order("created_at"),
    sb.from("profiles").select("email, role"),
  ]);
  const hasAccount = new Set((profiles ?? []).map((p) => p.email?.toLowerCase()));
  const isAdmin = me?.role === "admin";
  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-2xl font-bold">Team Access</h1>
      <p className="mt-1 text-sm text-slate-600">
        <strong>Administrators</strong> can do everything, including deleting and managing the team. <strong>Editors</strong> can create, edit and publish, but not delete.
      </p>
      <div className="mt-6"><Notice sp={sp} /></div>
      {!isAdmin ? <p className="rounded bg-white p-6 text-sm ring-1 ring-slate-200">Only administrators can manage team access.</p> : (
        <>
          <form action={addTeamMember} className="flex flex-wrap items-end gap-3 rounded-lg bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <div className="flex-1"><label htmlFor="t-email" className="mb-1 block text-sm font-semibold">Email</label><input id="t-email" name="email" type="email" required className="w-full rounded border border-slate-300 px-3 py-2 text-sm" /></div>
            <div><label htmlFor="t-role" className="mb-1 block text-sm font-semibold">Role</label>
              <select id="t-role" name="role" className="rounded border border-slate-300 px-3 py-2 text-sm"><option value="editor">Editor</option><option value="admin">Administrator</option></select></div>
            <button className="rounded bg-[#0b1d36] px-4 py-2 text-sm font-semibold text-white">Add</button>
          </form>
          <p className="mt-2 text-xs text-slate-500">After adding someone, create their login in Supabase (Authentication → Users → Add user). See the admin guide.</p>
          <ul className="mt-6 divide-y divide-slate-100 rounded-lg bg-white ring-1 ring-slate-200">
            {(allow ?? []).map((a) => (
              <li key={a.email} className="flex items-center justify-between px-5 py-3 text-sm">
                <div><p className="font-medium">{a.email}</p><p className="text-xs text-slate-500 capitalize">{a.role}{hasAccount.has(a.email.toLowerCase()) ? "" : " · login not created yet"}</p></div>
                {a.email.toLowerCase() !== me?.email?.toLowerCase() && (
                  <form action={removeTeamMember.bind(null, a.email)}><button className="text-sm font-medium text-red-700 hover:underline">Remove</button></form>
                )}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

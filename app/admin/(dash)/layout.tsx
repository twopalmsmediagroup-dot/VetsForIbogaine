import Link from "next/link";
import Image from "next/image";
import { getStaffUser, serverClient } from "@/lib/supabase/server";
import { ENTITIES } from "@/lib/admin/entities";
import SideNav, { type NavGroup } from "@/components/admin/SideNav";
import { IExternal, ILogout } from "@/components/admin/AdminIcons";
import { signOut } from "../actions";

export default async function DashLayout({ children }: { children: React.ReactNode }) {
  const user = await getStaffUser();
  const staff = user && (user.role === "admin" || user.role === "editor");
  const newMessages = staff
    ? (await (await serverClient()).from("inquiries").select("id", { count: "exact", head: true }).eq("handled", false)).count ?? 0
    : 0;
  const groups: NavGroup[] = [
    { items: [{ href: "/admin", label: "Overview", icon: "home" }] },
    { title: "Content", items: Object.values(ENTITIES).map((e) => ({ href: `/admin/${e.key}`, label: e.label, icon: e.key })) },
    { title: "Site", items: [
      { href: "/admin/settings", label: "Homepage & Settings", icon: "settings" },
      { href: "/admin/inbox", label: "Inbox & Subscribers", icon: "inbox", badge: newMessages },
    ] },
    { title: "People", items: [
      { href: "/admin/team", label: "Team Access", icon: "team" },
      { href: "/admin/account", label: "My Account", icon: "account" },
    ] },
  ];
  const initial = (user?.email ?? "?")[0].toUpperCase();

  return (
    <div className="lg:flex">
      <aside className="bg-gradient-to-b from-navy-900 to-navy-950 text-white lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col lg:overflow-y-auto">
        <Link href="/admin" className="flex items-center gap-3 px-5 py-5">
          <Image src="/brand/brain-mark.png" alt="" width={541} height={600} className="h-10 w-auto drop-shadow-[0_0_14px_rgba(214,180,100,0.35)]" />
          <span className="leading-tight">
            <span className="block font-[family-name:var(--font-mark)] text-[0.82rem] font-bold tracking-[0.04em] whitespace-nowrap">
              VETS FOR <span className="gold-text">IBOGAINE</span>
            </span>
            <span className="block text-[0.7rem] tracking-[0.14em] text-white/55 uppercase">Dashboard</span>
          </span>
        </Link>
        {staff && <SideNav groups={groups} />}
        <div className="mt-auto hidden border-t border-white/10 p-4 lg:block">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gold-400/90 text-sm font-bold text-navy-950">{initial}</span>
            <div className="min-w-0 text-xs">
              <p className="truncate text-white/90">{user?.email}</p>
              <p className="text-white/50 capitalize">{user?.role}</p>
            </div>
          </div>
          <div className="mt-3 flex gap-2 text-xs">
            <Link href="/" target="_blank" className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-md bg-white/10 px-2 py-1.5 text-white/85 hover:bg-white/15 hover:text-white">
              View site <IExternal size={13} />
            </Link>
            <form action={signOut} className="flex-1">
              <button className="inline-flex w-full items-center justify-center gap-1.5 rounded-md px-2 py-1.5 text-white/70 ring-1 ring-white/15 hover:bg-white/5 hover:text-white">
                <ILogout size={13} /> Sign out
              </button>
            </form>
          </div>
        </div>
      </aside>
      <main id="main" className="min-w-0 flex-1 px-4 py-6 sm:px-8 sm:py-8 lg:ml-64 lg:py-10">
        {staff ? children : (
          <div className="mx-auto max-w-lg rounded-xl bg-white p-8 text-center shadow-sm ring-1 ring-slate-200">
            <h1 className="font-display text-2xl text-navy-900">No editing access yet</h1>
            <p className="mt-2 text-sm text-slate-600">You&apos;re signed in as {user?.email}, but this account hasn&apos;t been given editor access. Ask an administrator to add your email under Team Access.</p>
            <form action={signOut} className="mt-6"><button className="rounded-md bg-navy-900 px-4 py-2 text-sm font-semibold text-white">Sign out</button></form>
          </div>
        )}
        <form action={signOut} className="mt-10 lg:hidden"><button className="text-sm text-slate-600 underline">Sign out</button></form>
      </main>
    </div>
  );
}

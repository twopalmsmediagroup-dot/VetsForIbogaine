import Link from "next/link";
import Image from "next/image";
import { getStaffUser } from "@/lib/supabase/server";
import { ENTITIES } from "@/lib/admin/entities";
import { signOut } from "../actions";

export default async function DashLayout({ children }: { children: React.ReactNode }) {
  const user = await getStaffUser();
  const staff = user && (user.role === "admin" || user.role === "editor");
  const nav = [
    { href: "/admin", label: "Overview" },
    ...Object.values(ENTITIES).map((e) => ({ href: `/admin/${e.key}`, label: e.label })),
    { href: "/admin/settings", label: "Homepage & Site Settings" },
    { href: "/admin/inbox", label: "Inbox & Subscribers" },
    { href: "/admin/team", label: "Team Access" },
    { href: "/admin/account", label: "My Account" },
  ];
  return (
    <div className="lg:flex">
      <aside className="bg-[#0b1d36] text-white lg:fixed lg:inset-y-0 lg:w-64 lg:overflow-y-auto">
        <div className="flex items-center gap-2 px-5 py-5">
          <Image src="/brand/brain-mark.png" alt="" width={541} height={600} className="h-9 w-auto" />
          <div className="leading-tight">
            <p className="text-sm font-bold tracking-wide">Vets for Ibogaine</p>
            <p className="text-xs text-white/60">Dashboard</p>
          </div>
        </div>
        {staff && (
          <nav aria-label="Dashboard" className="flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-col lg:pb-0">
            {nav.map((n) => (
              <Link key={n.href} href={n.href} className="whitespace-nowrap rounded px-3 py-2 text-sm text-white/85 hover:bg-white/10 hover:text-white">{n.label}</Link>
            ))}
          </nav>
        )}
        <div className="hidden border-t border-white/10 px-5 py-4 text-xs text-white/60 lg:block">
          <p className="truncate">{user?.email}</p>
          <p className="capitalize">{user?.role}</p>
          <div className="mt-3 flex gap-3">
            <Link href="/" target="_blank" className="underline hover:text-white">View site ↗</Link>
            <form action={signOut}><button className="underline hover:text-white">Sign out</button></form>
          </div>
        </div>
      </aside>
      <main id="main" className="min-w-0 flex-1 px-4 py-8 sm:px-8 lg:ml-64 lg:py-10">
        {staff ? children : (
          <div className="mx-auto max-w-lg rounded-lg bg-white p-8 text-center shadow">
            <h1 className="text-xl font-bold">No editing access yet</h1>
            <p className="mt-2 text-sm text-slate-600">You're signed in as {user?.email}, but this account hasn't been given editor access. Ask an administrator to add your email under Team Access.</p>
            <form action={signOut} className="mt-6"><button className="rounded bg-[#0b1d36] px-4 py-2 text-sm font-semibold text-white">Sign out</button></form>
          </div>
        )}
        <form action={signOut} className="mt-10 lg:hidden"><button className="text-sm text-slate-600 underline">Sign out</button></form>
      </main>
    </div>
  );
}

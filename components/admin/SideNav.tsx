"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ENTITY_ICONS, IHome, IInbox, ISliders, IUser, IUsers } from "./AdminIcons";

export type NavItem = { href: string; label: string; icon: string; badge?: number };
export type NavGroup = { title?: string; items: NavItem[] };

const ICONS: Record<string, (p: { size?: number; className?: string }) => React.JSX.Element> = { home: IHome, inbox: IInbox, settings: ISliders, team: IUsers, account: IUser, ...ENTITY_ICONS };

/** Sidebar on desktop, scrollable chip row on phones. Highlights the current section. */
export default function SideNav({ groups }: { groups: NavGroup[] }) {
  const pathname = usePathname();
  const active = (href: string) => (href === "/admin" ? pathname === "/admin" : pathname === href || pathname.startsWith(`${href}/`));
  return (
    <nav aria-label="Dashboard" className="flex gap-1 overflow-x-auto px-3 pb-3 lg:block lg:space-y-5 lg:overflow-visible lg:px-3 lg:pb-0">
      {groups.map((g, gi) => (
        <div key={gi} className="contents lg:block">
          {g.title && <p className="hidden px-3 pb-1.5 text-[0.65rem] font-semibold tracking-[0.16em] text-gold-400/80 uppercase lg:block">{g.title}</p>}
          <ul className="contents lg:block lg:space-y-0.5">
            {g.items.map((n) => {
              const Icon = ICONS[n.icon] ?? IHome;
              const on = active(n.href);
              return (
                <li key={n.href} className="shrink-0">
                  <Link href={n.href} aria-current={on ? "page" : undefined}
                    className={`group relative flex items-center gap-3 rounded-md px-3 py-2 text-sm whitespace-nowrap transition ${
                      on ? "bg-white/10 font-semibold text-white" : "text-white/75 hover:bg-white/5 hover:text-white"
                    }`}>
                    {on && <span className="absolute inset-y-1.5 left-0 hidden w-[3px] rounded-r bg-gold-400 lg:block" aria-hidden="true" />}
                    <Icon className={on ? "text-gold-300" : "text-white/55 group-hover:text-gold-300"} />
                    <span>{n.label}</span>
                    {!!n.badge && (
                      <span className="ml-auto rounded-full bg-gold-400 px-1.5 py-px text-[0.7rem] font-bold text-navy-950" aria-label={`${n.badge} new`}>{n.badge}</span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}

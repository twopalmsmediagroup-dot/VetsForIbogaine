import { NextResponse } from "next/server";
import { serverClient, getStaffUser } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const PAGE = 1000; // Supabase's default max rows per request

/** Quotes a CSV cell and defuses spreadsheet formulas (=, +, -, @). */
function cell(v: string) {
  const safe = /^[=+\-@\t\r]/.test(v) ? `'${v}` : v;
  return `"${safe.replace(/"/g, '""')}"`;
}

export async function GET() {
  const user = await getStaffUser();
  if (!user || (user.role !== "admin" && user.role !== "editor")) return new NextResponse("Forbidden", { status: 403 });
  const sb = await serverClient();
  const lines = ["email,subscribed"];
  for (let from = 0; ; from += PAGE) {
    const { data, error } = await sb.from("subscribers").select("email, created_at").order("created_at").order("id").range(from, from + PAGE - 1);
    if (error) return new NextResponse("Couldn't load subscribers.", { status: 500 });
    for (const s of data ?? []) lines.push(`${cell(s.email)},${cell(s.created_at)}`);
    if (!data || data.length < PAGE) break;
  }
  return new NextResponse(lines.join("\n") + "\n", {
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": 'attachment; filename="vfi-subscribers.csv"',
      "cache-control": "no-store",
    },
  });
}

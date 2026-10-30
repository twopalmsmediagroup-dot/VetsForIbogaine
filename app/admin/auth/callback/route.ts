import { NextResponse, type NextRequest } from "next/server";
import { serverClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const nextRaw = searchParams.get("next") || "/admin";
  const next = nextRaw.startsWith("/admin") ? nextRaw : "/admin";
  if (code) {
    const supabase = await serverClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(`${origin}${next}`);
  }
  return NextResponse.redirect(`${origin}/admin/login?error=${encodeURIComponent("That link is invalid or has expired.")}`);
}

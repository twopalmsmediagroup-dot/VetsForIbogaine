import { NextResponse, type NextRequest } from "next/server";
import { draftMode } from "next/headers";
import { getStaffUser } from "@/lib/supabase/server";

/** Staff-only: turns on draft preview, then opens the requested public page. */
export async function GET(request: NextRequest) {
  const user = await getStaffUser();
  if (!user || (user.role !== "admin" && user.role !== "editor")) return new NextResponse("Forbidden", { status: 403 });
  const raw = request.nextUrl.searchParams.get("path") || "/";
  const path = raw.startsWith("/") && !raw.startsWith("//") && !raw.startsWith("/admin") ? raw : "/";
  (await draftMode()).enable();
  return NextResponse.redirect(new URL(path, request.url));
}

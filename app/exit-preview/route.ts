import { NextResponse, type NextRequest } from "next/server";
import { draftMode } from "next/headers";

/** Turns off draft preview. Lives outside /admin so it works even after the session expires. */
export async function GET(request: NextRequest) {
  (await draftMode()).disable();
  const raw = request.nextUrl.searchParams.get("path") || "/";
  const path = raw.startsWith("/") && !raw.startsWith("//") ? raw : "/";
  return NextResponse.redirect(new URL(path, request.url));
}

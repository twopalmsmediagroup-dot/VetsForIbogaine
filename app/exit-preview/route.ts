import { NextResponse, type NextRequest } from "next/server";
import { draftMode } from "next/headers";

/**
 * Turns off draft preview. Lives outside /admin so it works even after the session expires.
 * Backslashes are rejected because browsers treat "/\host" as "//host" (open redirect).
 */
export async function GET(request: NextRequest) {
  (await draftMode()).disable();
  const raw = request.nextUrl.searchParams.get("path") || "/";
  const path = raw.startsWith("/") && !raw.startsWith("//") && !raw.includes("\\") ? raw : "/";
  return NextResponse.redirect(new URL(path, request.url));
}

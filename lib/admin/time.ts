/** "just now", "5 min ago", "3 h ago", "2 days ago", then a short date. */
export function timeAgo(iso: string | null | undefined, now = Date.now()) {
  if (!iso) return "";
  const s = Math.max(0, (now - Date.parse(iso)) / 1000);
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s / 60)} min ago`;
  if (s < 86400) return `${Math.floor(s / 3600)} h ago`;
  if (s < 7 * 86400) { const d = Math.floor(s / 86400); return `${d} day${d === 1 ? "" : "s"} ago`; }
  return shortDate(iso);
}

/** "Nov 1, 2026" for dates (YYYY-MM-DD) or timestamps. */
export function shortDate(v: string | null | undefined) {
  if (!v) return "—";
  const dt = new Date(v.length === 10 ? `${v}T12:00:00Z` : v);
  return Number.isNaN(dt.getTime()) ? v : dt.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "America/Los_Angeles" });
}

export function firstName(email: string | null | undefined) {
  const local = (email ?? "").split("@")[0].split(/[._-]/)[0];
  return local ? local[0].toUpperCase() + local.slice(1) : "";
}

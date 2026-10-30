import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/data";

export default function robots(): MetadataRoute.Robots {
  if (process.env.VERCEL_ENV !== "production") return { rules: [{ userAgent: "*", disallow: "/" }] };
  return { rules: [{ userAgent: "*", allow: "/", disallow: ["/admin"] }], sitemap: `${SITE_URL}/sitemap.xml` };
}

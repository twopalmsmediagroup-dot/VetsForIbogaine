import type { Metadata, Viewport } from "next";
import { Cinzel, Libre_Caslon_Display, Public_Sans } from "next/font/google";
import "./globals.css";
import { SITE_URL } from "@/lib/data";

const caslon = Libre_Caslon_Display({ weight: "400", subsets: ["latin"], variable: "--font-caslon", display: "swap" });
const publicSans = Public_Sans({ subsets: ["latin"], variable: "--font-public-sans", display: "swap" });
const cinzel = Cinzel({ weight: ["600", "700"], subsets: ["latin"], variable: "--font-cinzel", display: "swap" });

const isProd = process.env.VERCEL_ENV === "production";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "Vets for Ibogaine — Advocacy, Collaboration, Education", template: "%s | Vets for Ibogaine" },
  description:
    "A collaborative resource and advocacy platform connecting veterans, researchers, healthcare professionals and allied organizations around credible information on ibogaine and veteran well-being.",
  openGraph: { type: "website", siteName: "Vets for Ibogaine", locale: "en_US" },
  twitter: { card: "summary_large_image" },
  robots: isProd ? { index: true, follow: true } : { index: false, follow: false },
};

export const viewport: Viewport = { themeColor: "#0b1d36" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${caslon.variable} ${publicSans.variable} ${cinzel.variable}`}>
      <body>
        <a href="#main" className="skip-link">Skip to main content</a>
        {children}
      </body>
    </html>
  );
}

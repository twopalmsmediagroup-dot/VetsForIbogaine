import { draftMode } from "next/headers";
import Header from "@/components/Header";
import PreviewBanner from "@/components/PreviewBanner";
import Footer from "@/components/Footer";
import { getSettings } from "@/lib/data";

export const revalidate = 300;

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [s, { isEnabled: preview }] = await Promise.all([getSettings(), draftMode()]);
  return (
    <>
      {preview && <PreviewBanner />}
      <Header tagline={s.tagline} />
      <main id="main">{children}</main>
      <Footer s={s} />
    </>
  );
}

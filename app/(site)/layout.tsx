import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getSettings } from "@/lib/data";

export const revalidate = 300;

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const s = await getSettings();
  return (
    <>
      <Header tagline={s.tagline} />
      <main id="main">{children}</main>
      <Footer s={s} />
    </>
  );
}

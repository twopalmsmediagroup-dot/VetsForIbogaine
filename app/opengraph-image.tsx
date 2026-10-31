import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";

/** Default social-share card for every page without its own image (articles with a cover override it). */
export const alt = "Vets for Ibogaine — Advocacy • Collaboration • Education";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OgImage() {
  const mark = await readFile(path.join(process.cwd(), "public/brand/brain-mark.png"));
  const src = `data:image/png;base64,${mark.toString("base64")}`;
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", gap: 48, padding: "0 70px", background: "linear-gradient(135deg, #07152a 0%, #0b1d36 55%, #12294a 100%)", color: "#fff" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} width={216} height={240} alt="" />
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 66, fontWeight: 700, letterSpacing: 1 }}>
            <span>VETS FOR&nbsp;</span><span style={{ color: "#d6b464" }}>IBOGAINE</span>
          </div>
          <div style={{ marginTop: 18, fontSize: 22, letterSpacing: 4, color: "#e2c98a" }}>ADVOCACY • COLLABORATION • EDUCATION</div>
          <div style={{ marginTop: 34, fontSize: 30, color: "rgba(255,255,255,0.85)", maxWidth: 680 }}>
            Credible information on ibogaine and veteran well-being.
          </div>
        </div>
      </div>
    ),
    size,
  );
}

import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const alt = "DotGrey Digital — design, software, automation, data and AI";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const PAPER = "#eeede9";
const INK = "#111111";
const MUTED = "#6b6b68";

/** The share card: the site's wordmark and greeting, on paper. */
export default async function OpengraphImage() {
  const dir = join(process.cwd(), "src/assets/fonts");
  const [sans, serif] = await Promise.all([readFile(join(dir, "InterTight-800.ttf")), readFile(join(dir, "Cormorant-Italic-400.ttf"))]);

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", background: PAPER, color: INK, padding: "56px 64px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "Inter Tight", fontSize: 22, color: MUTED }}>
          <span>Design · Software · Automation · Data · ML</span>
          <span>Dhaka — worldwide</span>
        </div>
        <div style={{ display: "flex", fontFamily: "Inter Tight", fontSize: 236, letterSpacing: -14, lineHeight: 1, marginTop: 40 }}>DOTGREY</div>
        <div style={{ display: "flex", height: 2, background: INK, marginTop: 28 }} />
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginTop: 24 }}>
          <span style={{ fontFamily: "Cormorant", fontSize: 150, lineHeight: 1 }}>Hello.</span>
          <span style={{ fontFamily: "Inter Tight", fontSize: 30, maxWidth: 520, textAlign: "right", lineHeight: 1.2, marginBottom: 22 }}>
            One senior team, from the first sketch to the model behind it.
          </span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Inter Tight", data: sans, weight: 800, style: "normal" },
        { name: "Cormorant", data: serif, weight: 400, style: "italic" },
      ],
    },
  );
}

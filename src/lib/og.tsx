import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

/**
 * The shared share-card renderer.
 *
 * Satori cannot read the .woff2 files next/font emits, and it will not reach the network at
 * build time, so the display face is vendored as TTF under src/assets/fonts and read from
 * disk here. Without it every card falls back to the host's system sans and looks nothing
 * like the site.
 *
 * The palette and the uppercase display treatment mirror globals.css deliberately: a share
 * card that does not look like the page it links to is worse than no card at all.
 */

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

const BG = "#0a0908";
const FG = "#ffffff";
const MUTED = "#a09a95";
const ACCENT = "#ff5a3c";

const fontPath = (file: string) => join(process.cwd(), "src/assets/fonts", file);

async function displayFonts() {
  const [regular, semibold] = await Promise.all([
    readFile(fontPath("Kanit-Regular.ttf")),
    readFile(fontPath("Kanit-SemiBold.ttf")),
  ]);
  return [
    { name: "Kanit", data: regular, weight: 400 as const, style: "normal" as const },
    { name: "Kanit", data: semibold, weight: 600 as const, style: "normal" as const },
  ];
}

/**
 * Long titles have to shrink, or a three-line heading pushes the eyebrow up against the
 * logo and squeezes the footer into the description.
 */
function titleSize(title: string) {
  if (title.length > 58) return 54;
  if (title.length > 44) return 62;
  if (title.length > 30) return 74;
  return 92;
}

export type ShareCard = {
  /** The small line above the title — a category, a section name. */
  eyebrow?: string;
  title: string;
  /** One line under the title. Kept short; anything long is cut rather than wrapped away. */
  description?: string;
  /** The strip along the bottom — services, tags, a client name. */
  footer?: string;
};

export async function shareCard({ eyebrow, title, description, footer }: ShareCard) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: BG,
          padding: 72,
          fontFamily: "Kanit",
          position: "relative",
        }}
      >
        {/* The accent bloom the site's hero carries, flattened to a static gradient. */}
        <div
          style={{
            position: "absolute",
            top: -260,
            right: -200,
            width: 760,
            height: 760,
            borderRadius: 999,
            background: "radial-gradient(circle, rgba(255,90,60,0.30) 0%, rgba(255,90,60,0) 68%)",
            display: "flex",
          }}
        />

        <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 26, letterSpacing: 5 }}>
          <div style={{ width: 14, height: 14, borderRadius: 999, background: ACCENT, display: "flex" }} />
          <span style={{ color: ACCENT, fontWeight: 600 }}>DOT</span>
          <span style={{ color: FG, fontWeight: 600, marginLeft: -6 }}>GREY</span>
        </div>

        {/* The middle block takes the slack so the logo stays pinned to the top and the
            footer to the bottom however many lines the title runs to. */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            paddingTop: 28,
            paddingBottom: 28,
          }}
        >
          {eyebrow ? (
            <div
              style={{
                color: ACCENT,
                fontSize: 26,
                fontWeight: 600,
                letterSpacing: 4,
                textTransform: "uppercase",
                marginBottom: 20,
              }}
            >
              {eyebrow}
            </div>
          ) : null}

          <div
            style={{
              color: FG,
              fontSize: titleSize(title),
              fontWeight: 600,
              lineHeight: 1.06,
              letterSpacing: 1,
              textTransform: "uppercase",
              display: "flex",
            }}
          >
            {title}
          </div>

          {description ? (
            <div style={{ color: MUTED, fontSize: 30, lineHeight: 1.35, marginTop: 26, maxWidth: 980, display: "flex" }}>
              {description.length > 120 ? `${description.slice(0, 117)}…` : description}
            </div>
          ) : null}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div style={{ width: 64, height: 3, background: ACCENT, display: "flex" }} />
          <div style={{ color: MUTED, fontSize: 24, letterSpacing: 2, textTransform: "uppercase" }}>
            {footer ?? "dotgreydigital.com"}
          </div>
        </div>
      </div>
    ),
    { ...OG_SIZE, fonts: await displayFonts() },
  );
}

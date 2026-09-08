import { ImageResponse } from "next/og";
import { site } from "@/data/site";

export const alt = `${site.name} — ${site.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0a0908",
          padding: 72,
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 26, letterSpacing: 4 }}>
          <div style={{ width: 14, height: 14, borderRadius: 999, background: "#ff5a3c" }} />
          <span style={{ color: "#ff5a3c", fontWeight: 700 }}>DOT</span>
          <span style={{ color: "#ffffff", fontWeight: 700, marginLeft: -8 }}>GREY</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ color: "#ffffff", fontSize: 96, fontWeight: 800, lineHeight: 1.05, letterSpacing: -3 }}>
            We create
          </div>
          <div style={{ color: "#ff5a3c", fontSize: 96, fontWeight: 800, lineHeight: 1.05, letterSpacing: -3 }}>
            stunning
          </div>
          <div style={{ color: "#ffffff", fontSize: 96, fontWeight: 800, lineHeight: 1.05, letterSpacing: -3 }}>
            digital experiences
          </div>
        </div>

        <div style={{ color: "#a8a29e", fontSize: 28, maxWidth: 900 }}>
          UI/UX · Web development · Email templates · Banner ads · Veeva · Motion
        </div>
      </div>
    ),
    size,
  );
}

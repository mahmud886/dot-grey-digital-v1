import type { Metadata } from "next";
import { IBM_Plex_Mono, IBM_Plex_Sans_Condensed } from "next/font/google";
import { VersionBar } from "@/redesign/shared/VersionBar";
import { Crosshair } from "@/redesign/v3/Client";
import s from "@/redesign/v3/v3.module.css";

const cond = IBM_Plex_Sans_Condensed({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--v3-cond" });
const mono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--v3-mono" });

export const metadata: Metadata = {
  title: { default: "v3 Blueprint", template: "%s — v3 Blueprint" },
};

export default function V3Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${s.root} ${cond.variable} ${mono.variable}`}>
      <Crosshair />
      {children}
      <VersionBar current="v3" />
    </div>
  );
}

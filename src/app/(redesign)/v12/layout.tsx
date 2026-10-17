import type { Metadata } from "next";
import { Cormorant_Garamond, Onest } from "next/font/google";
import { VersionBar } from "@/redesign/shared/VersionBar";
import { Cursor, ScrollProgress } from "@/redesign/v12/Client";
import s from "@/redesign/v12/v12.module.css";

const sans = Onest({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--v12-sans" });
const serif = Cormorant_Garamond({ subsets: ["latin"], weight: ["400", "500"], style: ["italic"], variable: "--v12-serif" });

export const metadata: Metadata = {
  title: { default: "v12 Sculpture — DotGrey Digital", template: "%s — v12 Sculpture" },
};

export default function V12Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${s.root} ${sans.variable} ${serif.variable}`}>
      <ScrollProgress />
      {children}
      <Cursor />
      <VersionBar current="v12" />
    </div>
  );
}

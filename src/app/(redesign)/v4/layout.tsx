import type { Metadata } from "next";
import { Anton, Archivo } from "next/font/google";
import { VersionBar } from "@/redesign/shared/VersionBar";
import s from "@/redesign/v4/v4.module.css";

const display = Anton({ subsets: ["latin"], weight: "400", variable: "--v4-display" });
const sans = Archivo({ subsets: ["latin"], weight: ["400", "500", "700", "800"], variable: "--v4-sans" });

export const metadata: Metadata = {
  title: { default: "v4 Brutal — DotGrey Digital", template: "%s — v4 Brutal" },
};

export default function V4Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${s.root} ${display.variable} ${sans.variable}`}>
      {children}
      <VersionBar current="v4" />
    </div>
  );
}

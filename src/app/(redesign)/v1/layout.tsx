import type { Metadata } from "next";
import { JetBrains_Mono, Space_Grotesk } from "next/font/google";
import { VersionBar } from "@/redesign/shared/VersionBar";
import s from "@/redesign/v1/v1.module.css";

const display = Space_Grotesk({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--v1-display" });
const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--v1-mono" });

export const metadata: Metadata = {
  title: { default: "v1 Signal — DotGrey Digital", template: "%s — v1 Signal" },
};

export default function V1Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${s.root} ${display.variable} ${mono.variable}`}>
      {children}
      <VersionBar current="v1" />
    </div>
  );
}

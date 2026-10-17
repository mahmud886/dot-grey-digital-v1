import type { Metadata } from "next";
import { Doto, Geist_Mono } from "next/font/google";
import { VersionBar } from "@/redesign/shared/VersionBar";
import s from "@/redesign/v10/v10.module.css";

const dot = Doto({ subsets: ["latin"], weight: ["700", "900"], variable: "--v10-dot" });
const mono = Geist_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--v10-mono" });

export const metadata: Metadata = {
  title: { default: "v10 Engine — DotGrey Digital", template: "%s — v10 Engine" },
};

export default function V10Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${s.root} ${dot.variable} ${mono.variable}`}>
      {children}
      <VersionBar current="v10" />
    </div>
  );
}

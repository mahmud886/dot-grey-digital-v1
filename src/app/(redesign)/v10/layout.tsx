import type { Metadata } from "next";
import { Doto, Geist, Geist_Mono } from "next/font/google";
import { VersionBar } from "@/redesign/shared/VersionBar";
import { Header } from "@/redesign/v10/Chrome";
import s from "@/redesign/v10/v10.module.css";

const dot = Doto({ subsets: ["latin"], weight: ["700", "900"], variable: "--v10-dot" });
const mono = Geist_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--v10-mono" });
// Long-form reading (articles, legal) is set in Geist; the HUD stays mono.
const sans = Geist({ subsets: ["latin"], weight: ["400", "500"], variable: "--v10-sans" });

export const metadata: Metadata = {
  title: { default: "v10 Engine", template: "%s — v10 Engine" },
};

export default function V10Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${s.root} ${dot.variable} ${mono.variable} ${sans.variable}`}>
      <Header />
      {children}
      <VersionBar current="v10" />
    </div>
  );
}

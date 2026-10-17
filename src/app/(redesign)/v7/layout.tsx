import type { Metadata } from "next";
import { Bricolage_Grotesque, Figtree } from "next/font/google";
import { VersionBar } from "@/redesign/shared/VersionBar";
import s from "@/redesign/v7/v7.module.css";

const display = Bricolage_Grotesque({ subsets: ["latin"], weight: ["400", "600", "700", "800"], variable: "--v7-display" });
const body = Figtree({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--v7-body" });

export const metadata: Metadata = {
  title: { default: "v7 Warm Human", template: "%s — v7 Warm Human" },
};

export default function V7Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${s.root} ${display.variable} ${body.variable}`}>
      {children}
      <VersionBar current="v7" />
    </div>
  );
}

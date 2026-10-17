import type { Metadata } from "next";
import { Gloock, Hanken_Grotesk } from "next/font/google";
import { VersionBar } from "@/redesign/shared/VersionBar";
import { Preloader } from "@/redesign/v9/Client";
import s from "@/redesign/v9/v9.module.css";

const serif = Gloock({ subsets: ["latin"], weight: "400", variable: "--v9-serif" });
const sans = Hanken_Grotesk({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--v9-sans" });

export const metadata: Metadata = {
  title: { default: "v9 Index — DotGrey Digital", template: "%s — v9 Index" },
};

export default function V9Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${s.root} ${serif.variable} ${sans.variable}`}>
      <Preloader />
      {/* Without JS the mosaic never runs, so show the artwork straight away. */}
      <noscript>
        <style>{"[data-pix] svg{opacity:1!important}"}</style>
      </noscript>
      {children}
      <VersionBar current="v9" />
    </div>
  );
}

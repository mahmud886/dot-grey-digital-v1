import type { Metadata } from "next";
import { Libre_Franklin, Newsreader } from "next/font/google";
import { VersionBar } from "@/redesign/shared/VersionBar";
import s from "@/redesign/v2/v2.module.css";

const serif = Newsreader({ subsets: ["latin"], style: ["normal", "italic"], weight: ["400", "500", "600"], variable: "--v2-serif" });
const sans = Libre_Franklin({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--v2-sans" });

export const metadata: Metadata = {
  title: { default: "v2 Editorial — DotGrey Digital", template: "%s — v2 Editorial" },
};

export default function V2Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${s.root} ${serif.variable} ${sans.variable}`}>
      {children}
      <VersionBar current="v2" />
    </div>
  );
}

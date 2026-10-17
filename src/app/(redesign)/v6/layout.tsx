import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Sora } from "next/font/google";
import { VersionBar } from "@/redesign/shared/VersionBar";
import s from "@/redesign/v6/v6.module.css";

const display = Sora({ subsets: ["latin"], weight: ["300", "400", "600", "700"], variable: "--v6-display" });
const body = Plus_Jakarta_Sans({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--v6-body" });

export const metadata: Metadata = {
  title: { default: "v6 Spatial — DotGrey Digital", template: "%s — v6 Spatial" },
};

export default function V6Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${s.root} ${display.variable} ${body.variable}`}>
      {children}
      <VersionBar current="v6" />
    </div>
  );
}

import type { Metadata } from "next";
import { Schibsted_Grotesk } from "next/font/google";
import { VersionBar } from "@/redesign/shared/VersionBar";
import s from "@/redesign/v11/v11.module.css";

const grotesk = Schibsted_Grotesk({ subsets: ["latin"], variable: "--v11-font" });

export const metadata: Metadata = {
  title: { default: "v11 Grain", template: "%s — v11 Grain" },
};

export default function V11Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${s.root} ${grotesk.variable}`}>
      {children}
      <div className={s.grain} aria-hidden="true" />
      <VersionBar current="v11" />
    </div>
  );
}

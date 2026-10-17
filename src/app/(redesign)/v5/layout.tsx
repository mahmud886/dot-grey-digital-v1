import type { Metadata } from "next";
import { Fira_Code, VT323 } from "next/font/google";
import { VersionBar } from "@/redesign/shared/VersionBar";
import s from "@/redesign/v5/v5.module.css";

const pixel = VT323({ subsets: ["latin"], weight: "400", variable: "--v5-pixel" });
const code = Fira_Code({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--v5-code" });

export const metadata: Metadata = {
  title: { default: "v5 Terminal", template: "%s — v5 Terminal" },
};

export default function V5Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${s.root} ${pixel.variable} ${code.variable}`}>
      {children}
      <VersionBar current="v5" />
    </div>
  );
}

import type { Metadata } from "next";
import { Bodoni_Moda, Inter_Tight } from "next/font/google";
import { VersionBar } from "@/redesign/shared/VersionBar";
import { MotionProvider } from "@/redesign/v8/Client";
import s from "@/redesign/v8/v8.module.css";

const sans = Inter_Tight({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800", "900"], variable: "--v8-sans" });
const serif = Bodoni_Moda({ subsets: ["latin"], style: ["italic"], weight: ["400", "500", "600"], variable: "--v8-serif" });

export const metadata: Metadata = {
  title: { default: "v8 Wordmark", template: "%s — v8 Wordmark" },
};

export default function V8Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${s.root} ${sans.variable} ${serif.variable}`}>
      <MotionProvider>{children}</MotionProvider>
      <VersionBar current="v8" />
    </div>
  );
}

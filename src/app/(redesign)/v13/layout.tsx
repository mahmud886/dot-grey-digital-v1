import type { Metadata } from "next";
import { Cormorant_Garamond, Inter_Tight } from "next/font/google";
import { Header } from "@/redesign/v13/Chrome";
import { Cursor, MotionProvider, ScrollProgress } from "@/redesign/v13/Client";
import s from "@/redesign/v13/v13.module.css";

const sans = Inter_Tight({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800", "900"], variable: "--v13-sans" });
const serif = Cormorant_Garamond({ subsets: ["latin"], weight: ["400", "500"], style: ["italic"], variable: "--v13-serif" });

export const metadata: Metadata = {
  title: { default: "v13 Hybrid", template: "%s — v13 Hybrid" },
};

// The footer stays in each page, because every page signs off with its own word.
export default function V13Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${s.root} ${sans.variable} ${serif.variable}`}>
      <MotionProvider>
        <ScrollProgress />
        <Header />
        {children}
        <Cursor />
      </MotionProvider>
    </div>
  );
}

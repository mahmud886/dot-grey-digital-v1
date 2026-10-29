import type { Metadata } from "next";
import { Cormorant_Garamond, Inter_Tight } from "next/font/google";
import { Header } from "@/redesign/v13/Chrome";
import { Cursor, Magnet, MotionProvider, ScrollProgress } from "@/redesign/v13/Client";
import s from "@/redesign/v13/v13.module.css";

const sans = Inter_Tight({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800", "900"], variable: "--v13-sans" });
const serif = Cormorant_Garamond({ subsets: ["latin"], weight: ["400", "500"], style: ["italic"], variable: "--v13-serif" });

export const metadata: Metadata = {
  title: { default: "DotGrey Digital — design, software, automation, data and AI", template: "%s — DotGrey Digital" },
  description: "DotGrey Digital is a small, senior studio in Dhaka for product design, software, automation, data and machine learning — one team from first sketch to the model behind it.",
  openGraph: {
    type: "website",
    siteName: "DotGrey Digital",
    title: "DotGrey Digital",
    description: "Design, software, automation, data and machine learning — under one roof.",
  },
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
        <Magnet />
      </MotionProvider>
    </div>
  );
}

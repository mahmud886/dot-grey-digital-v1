import { Cormorant_Garamond, Inter_Tight } from "next/font/google";
import { Header } from "@/site/Chrome";
import { Cursor, Magnet, MotionProvider, ScrollProgress } from "@/site/Client";
import "@/site/shared/theme.css";
import s from "@/site/site.module.css";

const sans = Inter_Tight({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800", "900"], variable: "--site-sans" });
const serif = Cormorant_Garamond({ subsets: ["latin"], weight: ["400", "500"], style: ["italic"], variable: "--site-serif" });

// The footer stays in each page, because every page signs off with its own word.
export default function SiteLayout({ children }: { children: React.ReactNode }) {
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

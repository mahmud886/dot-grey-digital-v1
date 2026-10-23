import type { Metadata } from "next";
import { Schibsted_Grotesk } from "next/font/google";
import { Footer, Header } from "@/redesign/v11/Chrome";
import s from "@/redesign/v11/v11.module.css";

const grotesk = Schibsted_Grotesk({ subsets: ["latin"], variable: "--v11-font" });

export const metadata: Metadata = {
  title: { default: "v11 Grain", template: "%s — v11 Grain" },
};

export default function V11Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${s.root} ${grotesk.variable}`}>
      <Header />
      {children}
      <Footer />
      <div className={s.grain} aria-hidden="true" />
    </div>
  );
}

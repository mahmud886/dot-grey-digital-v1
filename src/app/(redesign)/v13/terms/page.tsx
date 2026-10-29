import type { Metadata } from "next";
import { legalPages } from "@/redesign/content";
import { Footer } from "@/redesign/v13/Chrome";
import { Legal } from "@/redesign/v13/Legal";

export const metadata: Metadata = { title: "Terms", description: "How DotGrey Digital handles terms." };

export default function V13Terms() {
  return (
    <>
      <Legal page={legalPages.terms} />
      <Footer signoff="That's all." />
    </>
  );
}

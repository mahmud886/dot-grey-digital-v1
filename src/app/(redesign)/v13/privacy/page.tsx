import type { Metadata } from "next";
import { legalPages } from "@/redesign/content";
import { Footer } from "@/redesign/v13/Chrome";
import { Legal } from "@/redesign/v13/Legal";

export const metadata: Metadata = { title: "Privacy", description: "How DotGrey Digital handles privacy." };

export default function V13Privacy() {
  return (
    <>
      <Legal page={legalPages.privacy} />
      <Footer signoff="That's all." />
    </>
  );
}

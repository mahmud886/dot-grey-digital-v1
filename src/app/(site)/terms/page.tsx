import type { Metadata } from "next";
import { pageMeta } from "@/site/meta";
import { legalPages } from "@/site/content";
import { Footer } from "@/site/Chrome";
import { Legal } from "@/site/Legal";

export const metadata: Metadata = pageMeta({ title: "Terms", description: "The terms that apply to using the DotGrey Digital site.", path: "/terms" });

export default function TermsPage() {
  return (
    <>
      <Legal page={legalPages.terms} />
      <Footer signoff="That's all." />
    </>
  );
}

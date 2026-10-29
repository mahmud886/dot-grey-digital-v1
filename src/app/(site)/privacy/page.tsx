import type { Metadata } from "next";
import { pageMeta } from "@/site/meta";
import { legalPages } from "@/site/content";
import { Footer } from "@/site/Chrome";
import { Legal } from "@/site/Legal";

export const metadata: Metadata = pageMeta({ title: "Privacy", description: "How DotGrey Digital collects, uses and keeps your information.", path: "/privacy" });

export default function PrivacyPage() {
  return (
    <>
      <Legal page={legalPages.privacy} />
      <Footer signoff="That's all." />
    </>
  );
}

import type { Metadata } from "next";
import { legalPages } from "@/redesign/content";
import { Footer, Legal } from "@/redesign/v8/Chrome";

export const metadata: Metadata = { title: "Privacy" };

export default function V8Privacy() {
  return (
    <>
      <Legal page={legalPages.privacy} />
      <Footer signoff="That's all." />
    </>
  );
}

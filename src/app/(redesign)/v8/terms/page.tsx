import type { Metadata } from "next";
import { legalPages } from "@/redesign/content";
import { Footer, Legal } from "@/redesign/v8/Chrome";

export const metadata: Metadata = { title: "Terms" };

export default function V8Terms() {
  return (
    <>
      <Legal page={legalPages.terms} />
      <Footer signoff="That's all." />
    </>
  );
}

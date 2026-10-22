import type { Metadata } from "next";
import { legalPages } from "@/redesign/content";
import { Legal } from "@/redesign/v9/Legal";

export const metadata: Metadata = { title: "Terms" };

export default function V9Terms() {
  return <Legal page={legalPages.terms} />;
}

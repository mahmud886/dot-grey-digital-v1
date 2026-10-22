import type { Metadata } from "next";
import { legalPages } from "@/redesign/content";
import { Legal } from "@/redesign/v11/Legal";

export const metadata: Metadata = { title: "Terms" };

export default function V11Terms() {
  return <Legal page={legalPages.terms} label="Legal ● Terms" />;
}

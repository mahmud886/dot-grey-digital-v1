import type { Metadata } from "next";
import { legalPages } from "@/redesign/content";
import { Legal } from "@/redesign/v12/Legal";

export const metadata: Metadata = { title: "Terms" };

export default function V12Terms() {
  return <Legal page={legalPages.terms} />;
}

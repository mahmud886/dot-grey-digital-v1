import type { Metadata } from "next";
import { legalPages } from "@/redesign/content";
import { Legal } from "@/redesign/v11/Legal";

export const metadata: Metadata = { title: "Privacy" };

export default function V11Privacy() {
  return <Legal page={legalPages.privacy} label="Legal ● Privacy" />;
}

import type { Metadata } from "next";
import { legalPages } from "@/redesign/content";
import { Legal } from "@/redesign/v10/Legal";

export const metadata: Metadata = { title: "Privacy" };

export default function V10Privacy() {
  return <Legal page={legalPages.privacy} />;
}

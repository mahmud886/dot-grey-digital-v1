import type { Metadata } from "next";
import { legalPages } from "@/redesign/content";
import { Legal } from "@/redesign/v12/Legal";

export const metadata: Metadata = { title: "Privacy" };

export default function V12Privacy() {
  return <Legal page={legalPages.privacy} />;
}

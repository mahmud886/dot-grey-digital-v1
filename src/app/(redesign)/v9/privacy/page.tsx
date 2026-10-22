import type { Metadata } from "next";
import { legalPages } from "@/redesign/content";
import { Legal } from "@/redesign/v9/Legal";

export const metadata: Metadata = { title: "Privacy" };

export default function V9Privacy() {
  return <Legal page={legalPages.privacy} />;
}

import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { ProseLayout } from "@/components/layout/ProseLayout";
import { legalPages } from "@/data/copy";

const copy = legalPages.privacy;

export const metadata: Metadata = {
  title: copy.title,
  description: copy.title,
};

export default function PrivacyPage() {
  return (
    <>
      <PageHero
        title={copy.title}
        breadcrumbs={[{ label: "Home", href: "/" }, { label: copy.title }]}
      />
      <ProseLayout updated={copy.updated} notice={copy.notice} blocks={copy.blocks} />
    </>
  );
}

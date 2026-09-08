import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { PricingCards } from "@/components/sections/PricingCards";
import { ComparisonTable } from "@/components/sections/ComparisonTable";
import { Faq } from "@/components/sections/Faq";
import { ProjectForm } from "@/components/sections/ProjectForm";
import { pages } from "@/data/copy";

const copy = pages.pricing;

export const metadata: Metadata = { title: "Pricing", description: copy.lead };

export default function PricingPage() {
  return (
    <>
      <PageHero
        title={copy.title}
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Pricing" }]}
        lead={copy.lead}
      />
      <PricingCards />
      <ComparisonTable label={copy.comparisonLabel} title={copy.comparisonTitle} />
      <Faq category="Pricing" limit={4} />
      <ProjectForm />
    </>
  );
}

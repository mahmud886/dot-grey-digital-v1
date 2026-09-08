import { Hero } from "@/components/sections/Hero";
import { FeatureRows } from "@/components/sections/FeatureRows";
import { MarqueeBand } from "@/components/sections/MarqueeBand";
import { Works } from "@/components/sections/Works";
import { Services } from "@/components/sections/Services";
import { InnovativeDesign } from "@/components/sections/InnovativeDesign";
import { StatsStrip } from "@/components/sections/StatsStrip";
import { Testimonials } from "@/components/sections/Testimonials";
import { LatestInsights } from "@/components/sections/LatestInsights";
import { Faq } from "@/components/sections/Faq";
import { ProjectForm } from "@/components/sections/ProjectForm";

export default function HomePage() {
  return (
    <>
      <Hero />
      <FeatureRows />
      <MarqueeBand />
      <Works />
      <Services />
      <InnovativeDesign />
      <StatsStrip />
      <Testimonials />
      <LatestInsights />
      <Faq />
      <ProjectForm />
    </>
  );
}

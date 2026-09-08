import data from "@/content/services.json";

export type Feature = { title: string; description: string; icon: string };
export type Benefit = { title: string; description: string };
export type TimelinePhase = { phase: string; title: string; body: string };
export type ServiceFaq = { q: string; a: string };

export type Service = {
  slug: string;
  number: string;
  title: string;
  /** lucide-react icon name, resolved through components/ui/Icon.tsx */
  icon: string;
  blurb: string;
  lead: string;
  tags: string[];
  overview: string[];
  included: string[];
  features: Feature[];
  benefits: Benefit[];
  industries: string[];
  deliverables: string[];
  timeline: TimelinePhase[];
  stat: { value: string; label: string };
  faqs: ServiceFaq[];
};

export const services: Service[] = data.services;

export const getServiceBySlug = (slug: string) => services.find((s) => s.slug === slug);

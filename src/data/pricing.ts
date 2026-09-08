import data from "@/content/pricing.json";

export type BillingMode = "monthly" | "project";
export type PricingMode = { id: BillingMode; label: string; suffix: string };

export type Plan = {
  id: string;
  name: string;
  price: Record<BillingMode, number>;
  blurb: string;
  features: string[];
  featured?: boolean;
};

export type ComparisonRow = { label: string; values: Record<string, string> };

export const pricingModes = data.modes as PricingMode[];
export const plans: Plan[] = data.plans;
export const comparison: ComparisonRow[] = data.comparison;

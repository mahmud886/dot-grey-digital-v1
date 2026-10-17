import legal from "@/content/pages/legal.json";

export type LegalBlock = (typeof legal.privacy.blocks)[number];
export type LegalPage = typeof legal.privacy;

export const legalPages = legal;

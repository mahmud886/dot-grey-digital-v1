import data from "@/content/site.json";

export type Office = { label: string; lines: string[] };
export type SocialLink = { label: string; href: string };
export type NavItem = { label: string; href: string; children?: NavItem[] };

export const site = {
  name: data.name,
  shortName: data.shortName,
  tagline: data.tagline,
  description: data.description,
  url: data.url,
  email: data.email,
  phone: data.phone,
  founded: data.founded,
};

export const offices: Office[] = data.offices;
export const socials: SocialLink[] = data.socials;
export const mainNav: NavItem[] = data.mainNav;
export const footerCompanyNav: NavItem[] = data.footerCompanyNav;
export const legalNav: NavItem[] = data.legalNav;
export const serviceOptions: string[] = data.serviceOptions;
export const budgetOptions: string[] = data.budgetOptions;
export const timelineOptions: string[] = data.timelineOptions;

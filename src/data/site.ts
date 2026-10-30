import data from "@/content/site.json";

export type Office = { label: string; lines: string[] };

export const site = {
  name: data.name,
  shortName: data.shortName,
  tagline: data.tagline,
  description: data.description,
  url: data.url,
  email: data.email,
  founded: data.founded,
};

export const offices: Office[] = data.offices;
export const budgetOptions: string[] = data.budgetOptions;
export const timelineOptions: string[] = data.timelineOptions;

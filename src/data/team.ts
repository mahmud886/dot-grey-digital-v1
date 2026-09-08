import data from "@/content/team.json";

export type Skill = { label: string; value: number };

export type Member = {
  slug: string;
  name: string;
  role: string;
  portrait: string;
  bio: string[];
  skills: Skill[];
  socials: { label: string; href: string }[];
};

export const team: Member[] = data.team;

export const getMemberBySlug = (slug: string) => team.find((m) => m.slug === slug);

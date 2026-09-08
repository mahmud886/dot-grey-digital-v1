import data from "@/content/jobs.json";

export type Benefit = { title: string; body: string };

export type Job = {
  slug: string;
  title: string;
  department: string;
  location: string;
  type: string;
  summary: string;
  responsibilities: string[];
  requirements: string[];
  niceToHave: string[];
};

export const benefits: Benefit[] = data.benefits;
export const jobs: Job[] = data.jobs;

export const getJobBySlug = (slug: string) => jobs.find((j) => j.slug === slug);

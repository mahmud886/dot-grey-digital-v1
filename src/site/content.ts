/**
 * Site content in one place. Works, stats, testimonials, posts, jobs, team, FAQ and legal
 * text live as JSON in src/content (typed in src/data); the service lineup, process and
 * per-project colours are defined here.
 */
import { works, getWorkBySlug, getNextWork, type Work } from "@/data/works";
import { stats } from "@/data/stats";
import { testimonials } from "@/data/testimonials";
import { offices, site } from "@/data/site";
import { posts, postCategories, getPostBySlug, getRelatedPosts, formatPostDate, type Post, type PostBlock } from "@/data/insights";
import { jobs, benefits, getJobBySlug, type Job } from "@/data/jobs";
import { team, getMemberBySlug, type Member } from "@/data/team";
import { faqs, faqCategories } from "@/data/faq";
import { values } from "@/data/values";
import { legalPages } from "@/data/legal";

export { works, getWorkBySlug, getNextWork, stats, testimonials, site, offices };
export { posts, postCategories, getPostBySlug, getRelatedPosts, formatPostDate, jobs, benefits, getJobBySlug };
export { team, getMemberBySlug, faqs, faqCategories, values, legalPages };
export type { Work, Post, PostBlock, Job, Member };

export type Discipline = {
  id: string;
  number: string;
  title: string;
  short: string;
  line: string;
  capabilities: string[];
  stack: string[];
};

export const disciplines: Discipline[] = [
  {
    id: "design",
    number: "01",
    title: "Product & Brand Design",
    short: "Design",
    line: "Research-led interfaces and identities that make the first try the successful one.",
    capabilities: ["UX research", "UI & interaction design", "Design systems", "Brand identity", "Prototyping"],
    stack: ["Figma", "Framer", "Maze", "Storybook"],
  },
  {
    id: "development",
    number: "02",
    title: "Web & App Development",
    short: "Development",
    line: "Fast, accessible websites and mobile apps engineered to be changed without fear.",
    capabilities: ["Marketing sites", "Web apps", "iOS & Android", "Headless CMS & commerce", "Performance"],
    stack: ["Next.js", "React Native", "TypeScript", "Vercel"],
  },
  {
    id: "software",
    number: "03",
    title: "Custom Software",
    short: "Software",
    line: "SaaS platforms, internal tools and APIs built around how your business actually runs.",
    capabilities: ["SaaS platforms", "Internal tools", "API design", "Cloud architecture", "Legacy modernisation"],
    stack: ["Node.js", "Python", "PostgreSQL", "AWS"],
  },
  {
    id: "automation",
    number: "04",
    title: "Automation & Integrations",
    short: "Automation",
    line: "Workflows that move data between your tools on their own — and tell you when they could not.",
    capabilities: ["Workflow automation", "CRM & ERP integrations", "AI agents", "Document processing", "Monitoring"],
    stack: ["n8n", "Temporal", "Zapier", "Webhooks"],
  },
  {
    id: "data",
    number: "05",
    title: "Data Science & Analytics",
    short: "Data",
    line: "Pipelines, dashboards and forecasts that turn scattered data into decisions.",
    capabilities: ["Data pipelines", "Dashboards & BI", "Forecasting", "Experimentation", "Data quality"],
    stack: ["dbt", "BigQuery", "Python", "Metabase"],
  },
  {
    id: "ml",
    number: "06",
    title: "Machine Learning & AI",
    short: "ML & AI",
    line: "Models and LLM products taken from notebook to production, with evaluation built in.",
    capabilities: ["LLM applications", "Retrieval (RAG)", "Computer vision", "Predictive models", "MLOps"],
    stack: ["PyTorch", "scikit-learn", "LangGraph", "MLflow"],
  },
];

export type Step = { title: string; body: string };

export const process: Step[] = [
  { title: "Discover", body: "Workshops, data audits and user interviews until the real problem is on the table." },
  { title: "Design", body: "Flows, interfaces and system architecture agreed before anything expensive is built." },
  { title: "Build", body: "Weekly releases you can click, with tests and documentation as part of done." },
  { title: "Automate", body: "Repeatable work handed to pipelines, integrations and models — with monitoring." },
  { title: "Measure", body: "Dashboards on the outcomes that matter, and a plan for the next iteration." },
];

/** Accent colours used for each case-study "cover", so each client gets its own colour. */
const WORK_COLORS: Record<string, string> = {
  workday: "#3d5afe",
  "verda-botanics": "#2e7d4f",
  "kestrel-athletics": "#e63946",
  "hakkas-dine": "#d97706",
  "northline-logistics": "#0f4c81",
  "medicove-intl": "#0d9488",
  "fintech-pro": "#6d28d9",
  "parallel-labs": "#db2777",
  "aurora-health": "#0891b2",
};

export function workColor(slug: string) {
  return WORK_COLORS[slug] ?? "#444444";
}

export const featuredWorks = works.slice(0, 6);

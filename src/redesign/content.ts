/**
 * Shared content for the redesign prototypes (/v1 – /v7).
 *
 * Works, stats and testimonials come straight from the existing CMS content so every
 * version shows the same real material; only the service lineup is new, because the
 * redesign repositions DotGrey from "design + web" to design, engineering, automation,
 * data and machine learning.
 */
import { works, getWorkBySlug, getNextWork, type Work } from "@/data/works";
import { stats } from "@/data/stats";
import { testimonials } from "@/data/testimonials";
import { offices, site } from "@/data/site";

export { works, getWorkBySlug, getNextWork, stats, testimonials, site, offices };
export type { Work };

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

/** Prototype metadata, used by the comparison index and the version switcher. */
export const versions = [
  {
    id: "v1",
    name: "Signal",
    idea: "AI/ML-first. Dark ink, neon lime, a living neural network.",
    signature: "Neural-network hero that reacts to the cursor, with live telemetry and a Pause button",
    fonts: "Space Grotesk + JetBrains Mono",
    palette: ["#07070c", "#e9eaf4", "#c8ff3d", "#5ce1e6"],
  },
  {
    id: "v2",
    name: "Editorial",
    idea: "A magazine. Cream paper, serif headlines, words that ink in as you read.",
    signature: "Local-time dateline and edition, scroll-inked manifesto, contents-page services",
    fonts: "Newsreader + Libre Franklin",
    palette: ["#f3ede2", "#191512", "#8c1c13", "#cfc4b3"],
  },
  {
    id: "v3",
    name: "Blueprint",
    idea: "Engineering drawings. Blueprint blue, self-drawing diagrams, a crosshair cursor.",
    signature: "Exploded system diagram you can hover, drafting crosshair, Gantt schedule",
    fonts: "IBM Plex Sans Condensed + IBM Plex Mono",
    palette: ["#0b2f63", "#e6efff", "#ffd23f", "#93acd6"],
  },
  {
    id: "v4",
    name: "Brutal",
    idea: "Raw and loud. Black, white and acid yellow, giant type, a pinned work reel.",
    signature: "Pinned horizontal work reel driven by scroll, VIEW cursor badge, scroll-linked band",
    fonts: "Anton + Archivo",
    palette: ["#ffffff", "#0a0a0a", "#e4ff00", "#6d6d6d"],
  },
  {
    id: "v5",
    name: "Terminal",
    idea: "A command line. Green phosphor, type commands, watch automations run.",
    signature: "Working shell (help, work, open …) and a step-by-step automation pipeline demo",
    fonts: "VT323 + Fira Code",
    palette: ["#050805", "#39ff6a", "#ffb000", "#1f8f3e"],
  },
  {
    id: "v6",
    name: "Spatial",
    idea: "Depth and glass. A live WebGL orb, cards that fly towards you.",
    signature: "WebGL iridescent orb with fallback and Pause, scroll-driven depth stack, tilt cards",
    fonts: "Sora + Plus Jakarta Sans",
    palette: ["#f3f2ff", "#14123a", "#6b4dff", "#ff7ac6"],
  },
  {
    id: "v7",
    name: "Warm Human",
    idea: "Friendly. Time-aware greeting, rounded shapes, a project scope planner.",
    signature: "Greeting in your time and Dhaka's, interactive scope planner that emails your plan",
    fonts: "Bricolage Grotesque + Figtree",
    palette: ["#fff6ec", "#2b1d14", "#ff6a2b", "#9cc5a1"],
  },
] as const;

export type VersionId = (typeof versions)[number]["id"];

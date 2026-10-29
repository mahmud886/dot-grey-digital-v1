/**
 * Shared content for the redesign prototypes (/v1 – /v13).
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
import { posts, postCategories, getPostBySlug, getRelatedPosts, formatPostDate, type Post, type PostBlock } from "@/data/insights";
import { jobs, benefits, getJobBySlug, type Job } from "@/data/jobs";
import { team, getMemberBySlug, type Member } from "@/data/team";
import { faqs, faqCategories } from "@/data/faq";
import { values } from "@/data/values";
import { legalPages } from "@/data/legal";

export { works, getWorkBySlug, getNextWork, stats, testimonials, site, offices };
// Carried over from the previous site for the full-page prototypes (about, insights, careers, FAQ, legal).
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

/** Prototype metadata, used by the comparison index and the version switcher. */
export const versions = [
  {
    id: "v1",
    set: "colour",
    name: "Signal",
    idea: "AI/ML-first. Dark ink, neon lime, a living neural network.",
    signature: "Neural-network hero that reacts to the cursor, with live telemetry and a Pause button",
    fonts: "Space Grotesk + JetBrains Mono",
    palette: ["#07070c", "#e9eaf4", "#c8ff3d", "#5ce1e6"],
  },
  {
    id: "v2",
    set: "colour",
    name: "Editorial",
    idea: "A magazine. Cream paper, serif headlines, words that ink in as you read.",
    signature: "Local-time dateline and edition, scroll-inked manifesto, contents-page services",
    fonts: "Newsreader + Libre Franklin",
    palette: ["#f3ede2", "#191512", "#8c1c13", "#cfc4b3"],
  },
  {
    id: "v3",
    set: "colour",
    name: "Blueprint",
    idea: "Engineering drawings. Blueprint blue, self-drawing diagrams, a crosshair cursor.",
    signature: "Exploded system diagram you can hover, drafting crosshair, Gantt schedule",
    fonts: "IBM Plex Sans Condensed + IBM Plex Mono",
    palette: ["#0b2f63", "#e6efff", "#ffd23f", "#93acd6"],
  },
  {
    id: "v4",
    set: "colour",
    name: "Brutal",
    idea: "Raw and loud. Black, white and acid yellow, giant type, a pinned work reel.",
    signature: "Pinned horizontal work reel driven by scroll, VIEW cursor badge, scroll-linked band",
    fonts: "Anton + Archivo",
    palette: ["#ffffff", "#0a0a0a", "#e4ff00", "#6d6d6d"],
  },
  {
    id: "v5",
    set: "colour",
    name: "Terminal",
    idea: "A command line. Green phosphor, type commands, watch automations run.",
    signature: "Working shell (help, work, open …) and a step-by-step automation pipeline demo",
    fonts: "VT323 + Fira Code",
    palette: ["#050805", "#39ff6a", "#ffb000", "#1f8f3e"],
  },
  {
    id: "v6",
    set: "colour",
    name: "Spatial",
    idea: "Depth and glass. A live WebGL orb, cards that fly towards you.",
    signature: "WebGL iridescent orb with fallback and Pause, scroll-driven depth stack, tilt cards",
    fonts: "Sora + Plus Jakarta Sans",
    palette: ["#f3f2ff", "#14123a", "#6b4dff", "#ff7ac6"],
  },
  {
    id: "v7",
    set: "colour",
    name: "Warm Human",
    idea: "Friendly. Time-aware greeting, rounded shapes, a project scope planner.",
    signature: "Greeting in your time and Dhaka's, interactive scope planner that emails your plan",
    fonts: "Bricolage Grotesque + Figtree",
    palette: ["#fff6ec", "#2b1d14", "#ff6a2b", "#9cc5a1"],
  },
  {
    id: "v8",
    set: "mono",
    name: "Wordmark",
    idea: "The name is the hero. A full-width DOTGREY wordmark, black and white chapters, a site that says hello and bye.",
    signature: "Time-aware \"Hello.\" greeting, pinned horizontal work reel, services that stack like a deck",
    fonts: "Inter Tight + Bodoni Moda",
    palette: ["#ffffff", "#0a0a0a", "#8f8f8f", "#e6e6e6"],
  },
  {
    id: "v9",
    set: "mono",
    name: "Index",
    idea: "A typographer's index. Text that decodes itself, work as giant type rows, glyphs set inline like words.",
    signature: "Scramble-decode intro, work titles with a pixel-mosaic preview that follows the cursor",
    fonts: "Gloock + Hanken Grotesk",
    palette: ["#f7f7f5", "#0b0b0b", "#9a9a9a", "#d9d9d6"],
  },
  {
    id: "v10",
    set: "mono",
    name: "Engine",
    idea: "A world, not a page. Thousands of points re-form into each discipline as you scroll.",
    signature: "Scroll-driven particle engine with a dot-matrix HUD, discipline filter and an ask box",
    fonts: "Doto + Geist Mono",
    palette: ["#000000", "#ffffff", "#5c5c5c", "#1a1a1a"],
  },
  {
    id: "v11",
    set: "mono",
    name: "Grain",
    idea: "Fashion-editorial. Uppercase grotesk on grain, the ● as punctuation, cursor badges that say what to do.",
    signature: "Kinetic-type reel with WATCH REEL cursor, drag carousel with progress, case covers that flow on",
    fonts: "Schibsted Grotesk",
    palette: ["#f4f4f2", "#1e1e1e", "#7a7a78", "#cfcfcc"],
  },
  {
    id: "v12",
    set: "mono",
    name: "Sculpture",
    idea: "Calm and tactile. Paper and ink, an interactive line sculpture, an italic voice.",
    signature: "Tap-to-shift wireframe sculpture with Pause, hairline service list, cards that straighten on hover",
    fonts: "Onest + Cormorant Garamond",
    palette: ["#eeede9", "#111111", "#6b6b68", "#d4d3ce"],
  },
  {
    id: "v13",
    set: "mono",
    name: "Hybrid",
    idea: "V8's voice in V12's material: the full-width wordmark, \"Hello.\" and the deck, on paper and ink with the sculpture.",
    signature: "Wordmark hero with a tap-to-shift sculpture, pinned reel of tilted cards, a services deck where every card turns its own form",
    fonts: "Inter Tight + Cormorant Garamond",
    palette: ["#eeede9", "#111111", "#6b6b68", "#e2e1dc"],
  },
] as const;

export type VersionId = (typeof versions)[number]["id"];

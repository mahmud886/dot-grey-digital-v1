/**
 * Agency copy for the site pages: how DotGrey works, how engagements are
 * shaped and priced, the AI offer, sectors, culture and the site's own policies.
 *
 * Everything here describes the studio's process and principles. It deliberately makes no
 * claims about results, clients, awards or headcount — those come only from src/content.
 * Price ranges are indicative starting points, labelled as such wherever they are shown.
 */
import { disciplines, works, type Work } from "./content";

/* ------------------------------------------------------------------ process */

export type Stage = {
  id: string;
  title: string;
  line: string;
  happens: string[];
  deliverables: string[];
  who: string[];
  duration: string;
};

export const stages: Stage[] = [
  {
    id: "discover",
    title: "Discover",
    line: "Find the real problem before anyone draws a screen.",
    happens: ["Kick-off workshop with the people who own the outcome", "Interviews with users and the team who support them", "Audit of the product, data and existing tools", "Agree what success looks like, in numbers"],
    deliverables: ["Problem statement", "Success metrics", "Risk list", "Plan and estimate for the next stage"],
    who: ["Project lead", "Designer", "Engineer", "Data person when data is involved"],
    duration: "1–3 weeks",
  },
  {
    id: "design",
    title: "Design",
    line: "Decide how it works, then how it looks.",
    happens: ["Flows and information architecture", "Interface design and prototypes tested with real users", "System architecture and data model sketched alongside the screens", "Scope cut to what moves the metric"],
    deliverables: ["Clickable prototype", "Design system foundations", "Architecture note", "Backlog for the build"],
    who: ["Product designer", "Tech lead", "Project lead"],
    duration: "2–6 weeks",
  },
  {
    id: "build",
    title: "Build",
    line: "Weekly releases you can click, from week two.",
    happens: ["Short cycles with a demo every week", "Tests, reviews and documentation as part of done", "Accessibility and performance checked continuously", "Staging environment you can use at any time"],
    deliverables: ["Working software in production", "Source code in your repository", "Runbooks and handover docs"],
    who: ["Engineers", "Designer", "QA", "Tech lead"],
    duration: "6–16 weeks, usually",
  },
  {
    id: "automate",
    title: "Automate",
    line: "Hand the repetitive work to systems that report back.",
    happens: ["Map the manual steps worth automating", "Integrations between your tools", "Models or AI features where judgement is needed, with a human override", "Monitoring and alerts for every automated step"],
    deliverables: ["Automated workflows", "Integration docs", "Monitoring dashboard", "Fallback procedures"],
    who: ["Automation engineer", "Data or ML engineer", "Your operations owner"],
    duration: "2–8 weeks per workflow",
  },
  {
    id: "measure",
    title: "Measure",
    line: "Check the numbers we agreed on, then plan the next round.",
    happens: ["Dashboards on the metrics agreed in Discover", "Review of what worked and what didn't", "Backlog re-prioritised from evidence", "Decision: iterate, scale or stop"],
    deliverables: ["Outcome report", "Live dashboard", "Next-step roadmap"],
    who: ["Project lead", "Data person", "Your leadership"],
    duration: "Ongoing, monthly reviews",
  },
];

export const rhythm = [
  { when: "Monday", what: "Plan the week together: priorities, blockers, what you will see on Friday." },
  { when: "Daily", what: "Async update in your Slack or Teams channel. No status meetings unless you want them." },
  { when: "Friday", what: "Demo of working software, not slides. Recorded for anyone who could not attend." },
  { when: "Monthly", what: "Outcome review against the metrics, budget burn and the plan for next month." },
];

export const fromYou = [
  "One decision-maker who can say yes or no within a day or two",
  "Access to the people who use or support the product",
  "Access to existing code, data and tools on day one",
  "An hour a week for the Friday demo",
];

/* ------------------------------------------------------------------ engagements */

export type Engagement = {
  id: string;
  name: string;
  line: string;
  bestFor: string;
  includes: string[];
  team: string;
  length: string;
  pricing: string;
  /** Indicative starting point only, never a quote. */
  from: string;
};

export const engagements: Engagement[] = [
  {
    id: "discovery",
    name: "Discovery",
    line: "A short, fixed-price study before you commit to a build.",
    bestFor: "New products, or a product that is not working and nobody agrees why.",
    includes: ["Workshops and interviews", "Product, data and tech audit", "Prototype of the riskiest idea", "Plan and estimate for the build"],
    team: "Project lead, designer, engineer",
    length: "2–4 weeks",
    pricing: "Fixed price, agreed upfront",
    from: "$4,000",
  },
  {
    id: "sprint",
    name: "Sprint",
    line: "A fixed scope, a fixed date, a fixed price.",
    bestFor: "A clearly defined website, feature, integration or automation.",
    includes: ["Design and build of the agreed scope", "Weekly demos", "Testing and launch", "Two weeks of support after launch"],
    team: "2–4 people",
    length: "4–12 weeks",
    pricing: "Fixed price per scope, paid in milestones",
    from: "$10,000",
  },
  {
    id: "product-team",
    name: "Product team",
    line: "A cross-discipline team that owns an outcome, month by month.",
    bestFor: "Products that need to keep improving after launch.",
    includes: ["Dedicated designer and engineers", "Data and ML support as needed", "Monthly outcome reviews", "Roadmap shaped with you"],
    team: "3–6 people",
    length: "3 months minimum, then monthly",
    pricing: "Monthly retainer, scaled to team size",
    from: "$12,000 / month",
  },
  {
    id: "embedded",
    name: "Embedded squad",
    line: "Our people inside your team, on your rituals and tools.",
    bestFor: "Teams with a roadmap and not enough hands, or a skill they do not have yet.",
    includes: ["Engineers, designers or data people joining your team", "Your process, your tools", "Knowledge transfer built in", "Swap or scale with one month's notice"],
    team: "1–4 people",
    length: "3 months minimum",
    pricing: "Monthly rate per person",
    from: "$5,000 / person / month",
  },
];

export const pricingNotes = [
  "Ranges are indicative starting points, not quotes. Every engagement is scoped after a call.",
  "Fixed-price work is paid in milestones; retainers are invoiced monthly in advance.",
  "Third-party costs (hosting, licences, paid APIs) are billed at cost or paid directly by you.",
  "You own the code, designs and data we produce, from the first invoice.",
];

export const engagementCompare: { label: string; values: Record<string, string> }[] = [
  { label: "Scope", values: { discovery: "Open question", sprint: "Fixed", "product-team": "Evolves monthly", embedded: "Your roadmap" } },
  { label: "Price", values: { discovery: "Fixed", sprint: "Fixed", "product-team": "Monthly", embedded: "Per person, monthly" } },
  { label: "Who leads", values: { discovery: "DotGrey", sprint: "DotGrey", "product-team": "DotGrey with you", embedded: "You" } },
  { label: "Weekly demos", values: { discovery: "Yes", sprint: "Yes", "product-team": "Yes", embedded: "Your rituals" } },
  { label: "Minimum", values: { discovery: "2 weeks", sprint: "4 weeks", "product-team": "3 months", embedded: "3 months" } },
];

export const engagementFaq = [
  { q: "Can we start with a Discovery and stop there?", a: "Yes. A Discovery ends with a plan you own. Build it with us, with another team or in-house." },
  { q: "What if the scope changes during a Sprint?", a: "We agree the change in writing, with its effect on price and date, before any work on it starts." },
  { q: "Do you work with early-stage startups?", a: "Often. A Discovery or a small Sprint is usually the right first step when budgets are tight." },
  { q: "Who owns the work?", a: "You do. Code lives in your repository and designs in your workspace from day one." },
];

/* ------------------------------------------------------------------ start wizard */

export const startNeeds = [...disciplines.map((d) => d.short), "Not sure yet"];

export const startStages = [
  { id: "idea", label: "An idea", note: "Nothing built yet." },
  { id: "early", label: "Early product", note: "Something exists; it needs work." },
  { id: "live", label: "Live product", note: "Real users, real problems to fix." },
  { id: "ops", label: "Internal process", note: "Manual work that should run on its own." },
];

/* ------------------------------------------------------------------ industries */

export type Sector = { id: string; name: string; slugs: string[]; problems: string[] };

/** Sectors derived only from published work; the slugs point at real case studies. */
export const sectors: Sector[] = [
  { id: "saas", name: "SaaS & workplace tools", slugs: ["workday", "parallel-labs"], problems: ["Onboarding that loses people", "Dashboards nobody opens", "Research tools used two hours a week"] },
  { id: "health", name: "Healthcare", slugs: ["medicove-intl", "aurora-health"], problems: ["Accessible patient journeys", "Regulated, segmented communication", "Clinician time spent on admin"] },
  { id: "fintech", name: "Finance", slugs: ["fintech-pro"], problems: ["Dense data made legible", "Trust and security in every screen", "Reporting that runs itself"] },
  { id: "retail", name: "Retail & consumer brands", slugs: ["verda-botanics", "kestrel-athletics"], problems: ["Campaign systems for many segments", "Identities that work on screen and on a label", "Personalisation without a big team"] },
  { id: "hospitality", name: "Food & hospitality", slugs: ["hakkas-dine"], problems: ["Booking and ordering in one flow", "Operations that scale past one location", "Payments and delivery integrations"] },
  { id: "logistics", name: "Logistics", slugs: ["northline-logistics"], problems: ["Brands that need to stay quiet and durable", "Tracking data turned into decisions", "Paperwork automated end to end"] },
];

export const worksFor = (slugs: string[]): Work[] => slugs.map((s) => works.find((w) => w.slug === s)).filter((w): w is Work => Boolean(w));

/* ------------------------------------------------------------------ stack */

export type Tool = { name: string; group: string };

/** Every tool named in the disciplines and in published case studies, grouped once. */
export function allTools(): Tool[] {
  const map = new Map<string, string>();
  for (const d of disciplines) for (const t of d.stack) map.set(t, d.short);
  for (const w of works) for (const t of w.tools) if (!map.has(t)) map.set(t, w.category === "Email" ? "Email" : w.category === "Branding" ? "Design" : "Development");
  return [...map].map(([name, group]) => ({ name, group })).sort((a, b) => a.name.localeCompare(b.name));
}

export const toolPrinciples = [
  { title: "Boring where it matters", body: "Proven tools for the parts that must not break: databases, payments, authentication." },
  { title: "Yours, not ours", body: "We choose tools your team can hire for and maintain after we leave." },
  { title: "Open by default", body: "Standard formats and exportable data, so switching later is a project, not a crisis." },
  { title: "Cost on day 400", body: "We price hosting and licences at scale before recommending anything." },
];

/* ------------------------------------------------------------------ AI */

export const aiOffer = [
  { title: "LLM applications", body: "Assistants, search and drafting tools built into the products your team already uses." },
  { title: "Retrieval (RAG)", body: "Answers grounded in your documents and data, with sources shown and permissions respected." },
  { title: "Agents & automation", body: "Multi-step workflows that act across your tools, with approvals where a person should decide." },
  { title: "Predictive models", body: "Forecasting, classification and scoring on your own data, when a simpler model will not do." },
  { title: "Document processing", body: "Invoices, forms and contracts read, checked and routed without retyping." },
  { title: "MLOps", body: "Evaluation, monitoring and retraining so a model keeps working after launch." },
];

export const aiPrinciples = [
  { title: "Evaluation first", body: "We agree how quality will be measured, and build the test set, before choosing a model." },
  { title: "A human can override", body: "Every AI feature has a way for a person to check, correct or switch it off." },
  { title: "Your data stays yours", body: "No training third-party models on your data. Providers and data flows are documented and agreed." },
  { title: "Plain-language limits", body: "Users are told when they are dealing with AI and what it can get wrong." },
];

export const aiWont = [
  "Promise accuracy we have not measured",
  "Ship a model without monitoring",
  "Use AI where a rule or a form would do the job better",
  "Build features meant to deceive users about what is automated",
];

/* ------------------------------------------------------------------ culture */

export const rituals = [
  { title: "Friday demos", body: "Everyone shows something that works. Unfinished is fine; slides are not." },
  { title: "Written decisions", body: "Every significant decision gets a short note: what, why, and what we ruled out." },
  { title: "Pairing across crafts", body: "Designers pair with engineers, engineers with data people. Hand-offs are where things go wrong." },
  { title: "Quiet mornings", body: "No meetings before noon, Dhaka time, so there is room for deep work." },
];

export const howWeWork = [
  { title: "Dhaka and remote", body: "A home base in Dhaka, people across time zones, and an overlap window with every client." },
  { title: "Small on purpose", body: "Teams of two to six. Everyone on a project can name its success metric." },
  { title: "Senior by default", body: "The people in the pitch are the people who do the work." },
];

/* ------------------------------------------------------------------ resources */

export type Checklist = { title: string; body: string; items: string[] };

/** Short, practical checklists published on /resources. */
export const checklists: Checklist[] = [
  {
    title: "Before you brief an agency",
    body: "Ten minutes with these makes the first call twice as useful.",
    items: [
      "Write the problem in one sentence, without naming a solution",
      "Name the one number that would prove it worked",
      "List who decides, who signs off and who uses the result",
      "Gather what exists: data, designs, code, past attempts",
      "Decide your real deadline and why it is real",
      "Set a budget range, even a wide one",
    ],
  },
  {
    title: "Is this process ready to automate?",
    body: "Automation pays when the work is frequent, rule-based and costly to get wrong by hand.",
    items: [
      "It happens at least weekly, and the steps are the same each time",
      "The inputs arrive in a predictable place and format",
      "You can write the rules down, including the exceptions",
      "Someone owns the process and can say what 'done' looks like",
      "A mistake is noticeable, and someone is told when it happens",
      "You know what an hour of this work costs today",
    ],
  },
  {
    title: "Shipping an AI feature responsibly",
    body: "Questions to answer before a model touches a customer.",
    items: [
      "What does the feature decide, and what happens when it is wrong?",
      "Do you have examples of good answers to test against?",
      "Which data does it see, and are you allowed to use it that way?",
      "How will you measure quality after launch, not just before?",
      "Can a person review, override or switch it off?",
      "Do users know when they are talking to a model?",
    ],
  },
];

/* ------------------------------------------------------------------ policies */

export const accessibility = {
  standard: "WCAG 2.2, level AA",
  done: [
    "Semantic HTML with one main heading per page and a skip link",
    "Visible focus on every interactive element",
    "Animations respect the reduced-motion setting, and looping motion has a Pause control",
    "Colour contrast checked in light and dark themes",
    "Forms label every field and announce errors",
  ],
  limits: [
    "Project images are illustrative concept visuals; the facts they show are also given in the text",
    "Some decorative motion effects are not available to screen readers by design",
    "We test with keyboard and screen readers on each release, but have not yet run a formal audit with assistive-technology users",
  ],
};

export const cookies = [
  { name: "dg-theme", purpose: "Remembers whether you chose the light or dark theme.", values: "light or dark", lasts: "1 year" },
  { name: "dg-accent", purpose: "Remembers an accent colour, if one was set. The site is black and white by default.", values: "mono, orange, blue, lime or violet", lasts: "1 year" },
];

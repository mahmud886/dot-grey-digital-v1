/**
 * Which published projects show each craft, and a couple of honest questions per craft.
 * Automation and ML have no published case study yet, and the pages say so rather than
 * borrowing unrelated work.
 */
export const RELATED: Record<string, string[]> = {
  design: ["workday", "medicove-intl", "kestrel-athletics"],
  development: ["hakkas-dine", "fintech-pro", "northline-logistics"],
  software: ["parallel-labs", "fintech-pro", "workday"],
  automation: [],
  data: ["fintech-pro", "parallel-labs"],
  ml: [],
};

export const CRAFT_FAQ: Record<string, { q: string; a: string }[]> = {
  design: [
    { q: "Do you design without research?", a: "Rarely, and only when the stakes are low. Most projects start with a week of interviews and a look at real usage data." },
    { q: "Will we get a design system?", a: "If the product will outlive the project, yes — components with real states, documented where your engineers already work." },
  ],
  development: [
    { q: "Which stack do you build on?", a: "Usually Next.js and TypeScript on the web and React Native on mobile, because they let a small team move fast. We follow your stack when you have one." },
    { q: "Who maintains it after launch?", a: "Your team, us, or both. We hand over with documentation and tests either way, so it never depends on us." },
  ],
  software: [
    { q: "Can you work with our legacy system?", a: "Yes. Most custom software starts next to something old. We wrap it, replace it piece by piece, and keep the business running." },
    { q: "How do you keep scope under control?", a: "Weekly releases you can click, and a short list of outcomes agreed up front. Anything new goes on the list, not into the sprint." },
  ],
  automation: [
    { q: "What can be automated first?", a: "The repetitive, rule-based work that eats hours every week: moving data between tools, chasing approvals, filing documents." },
    { q: "What happens when an automation fails?", a: "It tells someone. Every workflow we ship has monitoring and a clear fallback to a person." },
  ],
  data: [
    { q: "Our data is a mess. Is that a problem?", a: "It is the usual starting point. We fix the pipeline before we build the dashboard, so the numbers can be trusted." },
    { q: "Which tools do you use?", a: "dbt, BigQuery or Postgres, and a BI tool your team can actually maintain — often Metabase." },
  ],
  ml: [
    { q: "Do we need machine learning at all?", a: "Often not. If a rule does the job we will say so. We use a model when it measurably beats the simple answer." },
    { q: "How do you know a model is good enough?", a: "We agree an evaluation set and a target before building, and ship with monitoring and a human override." },
  ],
};

/** Per-project data for ProjectMockup: which kind of mockup, and the few real strings it shows. */
export type MockupKind = "app" | "email" | "brand";

export type MockupData = {
  kind: MockupKind;
  title: string;
  /** Shown in the browser bar of app mockups. */
  url: string;
  stat: string;
  statLabel: string;
  /** One line used on the system/overview frame. */
  line: string;
};

export const MOCKUPS: Record<string, MockupData> = {
  workday: { kind: "app", title: "Workday", url: "app.workday.example", stat: "−58%", statLabel: "taps to approve", line: "Approvals, cut to two taps" },
  "verda-botanics": { kind: "email", title: "Verda Botanics", url: "", stat: "−85%", statLabel: "time per campaign", line: "" },
  "kestrel-athletics": { kind: "brand", title: "Kestrel Athletics", url: "", stat: "+41%", statLabel: "prompted brand recall", line: "" },
  "hakkas-dine": { kind: "app", title: "Hakka's Dine", url: "hakkasdine.example", stat: "+64%", statLabel: "direct orders", line: "Ordering without the commission" },
  "northline-logistics": { kind: "brand", title: "Northline Logistics", url: "", stat: "3 → 1", statLabel: "identity systems", line: "" },
  "medicove-intl": { kind: "app", title: "Medicove", url: "join.medicove.example", stat: "4", statLabel: "onboarding steps, down from 11", line: "Onboarding in four calm steps" },
  "fintech-pro": { kind: "app", title: "Fintech Pro", url: "app.fintechpro.example", stat: "−58%", statLabel: "time to first insight", line: "A dashboard that answers first" },
  "parallel-labs": { kind: "app", title: "Parallel Labs", url: "parallel.example", stat: "2 clicks", statLabel: "to the common task, from 7", line: "Built around resuming work" },
  "aurora-health": { kind: "email", title: "Aurora Health", url: "", stat: "+38%", statLabel: "click-through rate", line: "" },
};

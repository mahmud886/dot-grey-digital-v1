/** V10's information architecture: used by the footer, the mobile menu and the sitemap. */
export const V10_MAP = [
  {
    label: "Studio",
    links: [
      { href: "/v10", label: "Home" },
      { href: "/v10/about", label: "About" },
      { href: "/v10/culture", label: "Inside" },
      { href: "/v10/careers", label: "Careers" },
      { href: "/v10/contact", label: "Contact" },
    ],
  },
  {
    label: "Services",
    links: [
      { href: "/v10/services", label: "All modules" },
      { href: "/v10/ai", label: "AI & automation" },
      { href: "/v10/capabilities", label: "Stack" },
      { href: "/v10/industries", label: "Industries" },
      { href: "/v10/work", label: "Work" },
    ],
  },
  {
    label: "Work with us",
    links: [
      { href: "/v10/process", label: "Process" },
      { href: "/v10/engagements", label: "Engagements" },
      { href: "/v10/start", label: "Start a project" },
      { href: "/v10/faq", label: "FAQ" },
    ],
  },
  {
    label: "Library",
    links: [
      { href: "/v10/insights", label: "Insights" },
      { href: "/v10/resources", label: "Resources" },
    ],
  },
  {
    label: "Legal",
    links: [
      { href: "/v10/privacy", label: "Privacy" },
      { href: "/v10/terms", label: "Terms" },
      { href: "/v10/cookies", label: "Cookies" },
      { href: "/v10/accessibility", label: "Accessibility" },
      { href: "/v10/sitemap", label: "Sitemap" },
    ],
  },
] as const;

/** Extra rows for the mobile menu, after the main nav. */
export const MENU_EXTRA = [
  { href: "/v10/process", label: "Process" },
  { href: "/v10/engagements", label: "Engagements" },
  { href: "/v10/start", label: "Start a project" },
];

/** Console boot lines shown above the start wizard. */
export const wizardSteps = ["need", "stage", "budget", "timing", "contact", "review"] as const;

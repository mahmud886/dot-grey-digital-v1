/** V12's information architecture, shared by the header, mobile menu, footer and sitemap. */
export const V12_NAV = [
  { href: "/v12/work", label: "Work" },
  { href: "/v12/services", label: "Services" },
  { href: "/v12/process", label: "Process" },
  { href: "/v12/about", label: "About" },
  { href: "/v12/insights", label: "Insights" },
];

export const V12_MAP = [
  {
    label: "Studio",
    links: [
      { href: "/v12", label: "Home" },
      { href: "/v12/about", label: "About" },
      { href: "/v12/culture", label: "Culture" },
      { href: "/v12/careers", label: "Careers" },
      { href: "/v12/contact", label: "Contact" },
    ],
  },
  {
    label: "Crafts",
    links: [
      { href: "/v12/services", label: "All services" },
      { href: "/v12/ai", label: "AI & automation" },
      { href: "/v12/capabilities", label: "Capabilities" },
      { href: "/v12/industries", label: "Industries" },
      { href: "/v12/work", label: "Work" },
    ],
  },
  {
    label: "Work with us",
    links: [
      { href: "/v12/process", label: "Process" },
      { href: "/v12/engagements", label: "Engagements" },
      { href: "/v12/start", label: "Start a project" },
      { href: "/v12/faq", label: "FAQ" },
    ],
  },
  {
    label: "Read",
    links: [
      { href: "/v12/insights", label: "Insights" },
      { href: "/v12/resources", label: "Resources" },
    ],
  },
  {
    label: "Fine print",
    links: [
      { href: "/v12/privacy", label: "Privacy" },
      { href: "/v12/terms", label: "Terms" },
      { href: "/v12/cookies", label: "Cookies" },
      { href: "/v12/accessibility", label: "Accessibility" },
      { href: "/v12/sitemap", label: "Sitemap" },
    ],
  },
] as const;

/** Mobile menu: the main nav plus the pages people look for on a phone. */
export const V12_MOBILE = [
  ...V12_NAV,
  { href: "/v12/engagements", label: "Engagements" },
  { href: "/v12/careers", label: "Careers" },
  { href: "/v12/contact", label: "Contact" },
  { href: "/v12/start", label: "Start a project" },
];

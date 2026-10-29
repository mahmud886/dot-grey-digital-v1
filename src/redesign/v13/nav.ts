/** V13's information architecture, shared by the header, mobile menu, footer and sitemap. */
export const V13_NAV = [
  { href: "/v13/work", label: "Work" },
  { href: "/v13/services", label: "Services" },
  { href: "/v13/process", label: "Process" },
  { href: "/v13/about", label: "About" },
  { href: "/v13/insights", label: "Insights" },
];

export const V13_MAP = [
  {
    label: "Studio",
    links: [
      { href: "/v13", label: "Home" },
      { href: "/v13/about", label: "About" },
      { href: "/v13/culture", label: "Culture" },
      { href: "/v13/careers", label: "Careers" },
      { href: "/v13/contact", label: "Contact" },
    ],
  },
  {
    label: "Crafts",
    links: [
      { href: "/v13/services", label: "All services" },
      { href: "/v13/ai", label: "AI & automation" },
      { href: "/v13/capabilities", label: "Capabilities" },
      { href: "/v13/industries", label: "Industries" },
      { href: "/v13/work", label: "Work" },
    ],
  },
  {
    label: "Work with us",
    links: [
      { href: "/v13/process", label: "Process" },
      { href: "/v13/engagements", label: "Engagements" },
      { href: "/v13/start", label: "Start a project" },
      { href: "/v13/faq", label: "FAQ" },
    ],
  },
  {
    label: "Read",
    links: [
      { href: "/v13/insights", label: "Insights" },
      { href: "/v13/resources", label: "Resources" },
    ],
  },
  {
    label: "Fine print",
    links: [
      { href: "/v13/privacy", label: "Privacy" },
      { href: "/v13/terms", label: "Terms" },
      { href: "/v13/cookies", label: "Cookies" },
      { href: "/v13/accessibility", label: "Accessibility" },
      { href: "/v13/sitemap", label: "Sitemap" },
    ],
  },
] as const;

/** Mobile menu: the main nav plus the pages people look for on a phone. */
export const V13_MOBILE = [
  ...V13_NAV,
  { href: "/v13/engagements", label: "Engagements" },
  { href: "/v13/careers", label: "Careers" },
  { href: "/v13/contact", label: "Contact" },
  { href: "/v13/start", label: "Start a project" },
];

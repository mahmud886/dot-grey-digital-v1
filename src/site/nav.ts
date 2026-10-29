/** The site's information architecture, shared by the header, mobile menu, footer and sitemap. */
export const SITE_NAV = [
  { href: "/work", label: "Work" },
  { href: "/services", label: "Services" },
  { href: "/process", label: "Process" },
  { href: "/about", label: "About" },
  { href: "/insights", label: "Insights" },
];

export const SITE_MAP = [
  {
    label: "Studio",
    links: [
      { href: "/", label: "Home" },
      { href: "/about", label: "About" },
      { href: "/culture", label: "Culture" },
      { href: "/careers", label: "Careers" },
      { href: "/contact", label: "Contact" },
    ],
  },
  {
    label: "Crafts",
    links: [
      { href: "/services", label: "All services" },
      { href: "/ai", label: "AI & automation" },
      { href: "/capabilities", label: "Capabilities" },
      { href: "/industries", label: "Industries" },
      { href: "/work", label: "Work" },
    ],
  },
  {
    label: "Work with us",
    links: [
      { href: "/process", label: "Process" },
      { href: "/engagements", label: "Engagements" },
      { href: "/start", label: "Start a project" },
      { href: "/faq", label: "FAQ" },
    ],
  },
  {
    label: "Read",
    links: [
      { href: "/insights", label: "Insights" },
      { href: "/resources", label: "Resources" },
    ],
  },
  {
    label: "Fine print",
    links: [
      { href: "/privacy", label: "Privacy" },
      { href: "/terms", label: "Terms" },
      { href: "/cookies", label: "Cookies" },
      { href: "/accessibility", label: "Accessibility" },
      { href: "/site-map", label: "Sitemap" },
    ],
  },
] as const;

/** Mobile menu: the main nav plus the pages people look for on a phone. */
export const SITE_MOBILE = [
  ...SITE_NAV,
  { href: "/engagements", label: "Engagements" },
  { href: "/careers", label: "Careers" },
  { href: "/contact", label: "Contact" },
  { href: "/start", label: "Start a project" },
];

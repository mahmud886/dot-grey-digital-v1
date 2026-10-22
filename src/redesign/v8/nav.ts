/** V8's information architecture, shared by the footer and the human sitemap. */
export const V8_MAP = [
  {
    label: "Studio",
    links: [
      { href: "/v8", label: "Home" },
      { href: "/v8/about", label: "About" },
      { href: "/v8/culture", label: "Culture" },
      { href: "/v8/careers", label: "Careers" },
      { href: "/v8/contact", label: "Contact" },
    ],
  },
  {
    label: "Services",
    links: [
      { href: "/v8/services", label: "All services" },
      { href: "/v8/ai", label: "AI & automation" },
      { href: "/v8/capabilities", label: "Capabilities" },
      { href: "/v8/industries", label: "Industries" },
      { href: "/v8/work", label: "Work" },
    ],
  },
  {
    label: "Work with us",
    links: [
      { href: "/v8/process", label: "Process" },
      { href: "/v8/engagements", label: "Engagements" },
      { href: "/v8/start", label: "Start a project" },
      { href: "/v8/faq", label: "FAQ" },
    ],
  },
  {
    label: "Resources",
    links: [
      { href: "/v8/insights", label: "Insights" },
      { href: "/v8/resources", label: "Resources" },
    ],
  },
  {
    label: "Legal",
    links: [
      { href: "/v8/privacy", label: "Privacy" },
      { href: "/v8/terms", label: "Terms" },
      { href: "/v8/cookies", label: "Cookies" },
      { href: "/v8/accessibility", label: "Accessibility" },
      { href: "/v8/sitemap", label: "Sitemap" },
    ],
  },
] as const;

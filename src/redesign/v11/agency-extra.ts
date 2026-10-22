/**
 * V11-only data for the agency pages: the site map that drives the footer, drawer and
 * /v11/sitemap, plus the few labels V11 sets differently. Shared copy stays in
 * src/redesign/agency.ts.
 */
import { disciplines } from "@/redesign/content";

export type NavLink = { label: string; href: string };
export type NavGroup = { title: string; links: NavLink[] };

export const SITE_MAP: NavGroup[] = [
  {
    title: "Studio",
    links: [
      { label: "Home", href: "/v11" },
      { label: "Work", href: "/v11/work" },
      { label: "About", href: "/v11/about" },
      { label: "Inside", href: "/v11/culture" },
      { label: "Careers", href: "/v11/careers" },
    ],
  },
  {
    title: "Services",
    links: [
      { label: "All services", href: "/v11/services" },
      ...disciplines.map((d) => ({ label: d.short, href: `/v11/services/${d.id}` })),
      { label: "AI & automation", href: "/v11/ai" },
    ],
  },
  {
    title: "Work with us",
    links: [
      { label: "Start a project", href: "/v11/start" },
      { label: "Engagements", href: "/v11/engagements" },
      { label: "Process", href: "/v11/process" },
      { label: "Industries", href: "/v11/industries" },
      { label: "Capabilities", href: "/v11/capabilities" },
      { label: "Contact", href: "/v11/contact" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Insights", href: "/v11/insights" },
      { label: "Resources", href: "/v11/resources" },
      { label: "FAQ", href: "/v11/faq" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy", href: "/v11/privacy" },
      { label: "Terms", href: "/v11/terms" },
      { label: "Cookies", href: "/v11/cookies" },
      { label: "Accessibility", href: "/v11/accessibility" },
      { label: "Sitemap", href: "/v11/sitemap" },
    ],
  },
];

/** Groups the stack filter offers, in the order the disciplines are listed. */
export const STACK_GROUPS = [...disciplines.map((d) => d.short), "Email"];

# DotGrey Digital — v2 Documentation

Scope documents for the animated rebuild of the DotGrey Digital website, on the
`v2-animated-redesign` branch.

| Doc | What it locks down |
| --- | --- |
| [00-brand.md](00-brand.md) | Positioning, voice, type scale, colour tokens for both themes, spacing |
| [01-sitemap.md](01-sitemap.md) | Every route, slug, nav tree and footer link graph |
| [02-sections.md](02-sections.md) | Per-section layout, copy and behaviour at each breakpoint |
| [03-components.md](03-components.md) | Component inventory — name, client/server, props |
| [04-motion.md](04-motion.md) | The animation catalogue and reduced-motion fallbacks |
| [05-content.md](05-content.md) | All placeholder content |
| [06-cms.md](06-cms.md) | The `/keystatic` CMS — what is editable and how it is wired |
| [07-cms-setup.md](07-cms-setup.md) | Click-by-click guide to turning the CMS on for the team |


## What changes from v1

v1 is a solid static layout. v2 keeps its identity — the orange, the warm gradient, the
uppercase Kanit headings, the card language — and rebuilds it as a motion-led, typed,
editable site.

| Area | v1 | v2 |
| --- | --- | --- |
| Language | JavaScript | **TypeScript** |
| Themes | Dark only | **Dark + light**, `data-theme`, no flash |
| Motion | CSS transitions and one Embla carousel | **GSAP + ScrollTrigger + Lenis**, a catalogued motion system |
| Routes | 6 | **~20**, including case studies, team, pricing, careers, FAQ, legal, 404 |
| Content | Hardcoded in components | **JSON in `src/content/`, edited through a CMS** |
| Images | Remote Unsplash only | **Generated brand placeholders**, remote images still supported |
| Forms | Markup only, no handler | **Server Actions + zod validation** |
| SEO | Root metadata still "Create Next App" | Per-route metadata, sitemap, robots, OG images, JSON-LD |
| Accessibility | Not addressed | Focus rings, ARIA on interactive parts, `prefers-reduced-motion` honoured |

## Decisions already made

| Decision | Value |
| --- | --- |
| Branch | `v2-animated-redesign` |
| Stack | Next.js 16 · TypeScript · Tailwind v4 · React Compiler |
| Motion | GSAP + ScrollTrigger · Lenis · Embla |
| Accent | Brand orange `#ff5a3c`, unchanged |
| Type | Kanit (display) + Roboto (body) |
| CMS | Keystatic, git-based, no database |

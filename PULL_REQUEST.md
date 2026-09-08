# v2 — animated redesign

`v2-animated-redesign` → `main`

A rebuild of the DotGrey Digital site on the v1 design language: same identity, same
structure, rewritten in TypeScript with a real motion system, a full set of inner pages, a
git-based CMS, and no database.

19 commits · 256 files · +17,932 / −3,207

---

## What changed

### Foundation
- **TypeScript throughout**, pinned to 5.9 — TS 6 rejects `import "./globals.css"`.
- **Design tokens** in `globals.css`, dark-first with a `[data-theme="light"]` override. The
  resolved theme is server-rendered and the client falls back to *that*, not to a global
  default, so there is no flash and no mismatch.
- **`tailwind-merge` is configured, not stock.** It reads `text-display-1` as a colour and
  lets `text-fg` override it, which silently drops every display size. `src/lib/cn.ts`
  declares the custom `font-size` / `text-color` / `bg-color` / `border-color` groups.
- Motion: GSAP + ScrollTrigger, Lenis for smooth scroll, Embla for carousels. No jQuery.

### Pages
14 routes: home, about, services (+ detail), works (+ detail), team (+ detail), insights
(+ detail), pricing, faq, careers (+ detail), contact, docs, privacy, terms, 404.

Every route has `generateMetadata`; there is a `sitemap.ts`, `robots.ts` and an
`Organization` JSON-LD block.

### Motion
45 catalogued animations (`docs/04-motion.md`) — split-text headings, a pinned horizontal
services track, a hero card stack, marquees, counters, magnetic buttons, animated icons,
page transitions. **Every one of them no-ops under `prefers-reduced-motion: reduce`**, and
that is verified, not assumed: a headless pass over twelve routes with the media feature
emulated confirms nothing is left invisible or off-position.

### CMS
Keystatic, git-based, **no database**. Fifteen singletons, each holding one JSON file under
`src/content/`, so the data stays synchronously importable and the whole site stays static.
`/keystatic` is isolated from the site chrome by a `(site)` route group and 404s in
production unless configured.

### Forms
Server Actions validated with zod, plus a honeypot. Resend is imported lazily and the action
degrades to logging when the keys are absent, so a missing env var cannot take the form down.

---

## Bugs found and fixed along the way

Several of these were introduced earlier in this branch and caught during verification:

| Problem | Cause |
| --- | --- |
| Mobile client-side crash on resize | GSAP `pin` inserts a spacer element; the section rendered a different tree per breakpoint, so React's `removeChild` failed. One stable tree, `gsap.matchMedia()` for the pin. |
| Header vanished instantly instead of sliding | Tailwind v4's `-translate-y-*` writes the standalone `translate` property; the transition named `transform`, which nothing was writing. **The same mistake was killing seven other animations** — two image zooms, an accordion icon, three link nudges. |
| Header twitched on any scroll | Direction flipped after 6px. Now 110px of downward travel to hide, 44px to come back, never inside the hero, always back at the page bottom. |
| Preloader could hang forever | Its counter ran on `requestAnimationFrame`, which browsers pause in background tabs — open the site in a tab you don't look at and the full-screen sheet stayed up, swallowing every click. |
| `/keystatic/singleton/services` and `/works` refused to open | Fields added to the JSON were never added to the schema, and Keystatic treats any undeclared key as a hard error. |
| LCP 3.2s, then `NO_LCP` | Hero text sat at `opacity: 0` until GSAP ran, so the entrance moved to CSS; the first fix then started the whole page at zero opacity on load, which is worse. |
| Validation error wiped the form | `FormData.get()` returns `null` for an empty select and zod reads null as a type error; React also ignores a changed `defaultValue` on an uncontrolled `<select>`. |

---

## Guards added

- **`npm run check:content`** walks every Keystatic singleton's schema against its JSON and
  names the offending path. It runs before `dev` and `build`, so schema drift fails in the
  terminal in front of whoever caused it, instead of in the CMS in front of an editor.
- Keystatic's **Edit item** dialog now has a close button; it shipped with Done as its only
  control.

---

## Verification

| | Performance | Accessibility | Best practices | SEO |
| --- | --- | --- | --- | --- |
| Home — mobile | 93 | 96 | 100 | 100 |
| Home — desktop | 99 | 97 | 100 | 100 |
| Works — mobile | 90 | 97 | 100 | 100 |
| Works — desktop | 99 | 97 | 100 | 100 |

Also checked: `tsc --noEmit` and `eslint` clean; all fifteen CMS singletons open without a
validation error; twelve routes walked in a headless browser, normally and with reduced
motion, with no page errors and no stranded content.

---

## Before this can go live

**The content is invented, and some of it would be wrong to publish.**
`docs/08-golive-checklist.md` lists it in full. The parts that matter:

- **Case-study results are fabricated.** Every percentage, every "+41% recall", every
  "−64% time to resume" was written to fill a layout. Publishing invented client outcomes is
  a real problem, not a cosmetic one. Replace them with figures you can stand behind, or
  delete the project.
- **Testimonials and their named authors are invented.** Nobody said these things.
- **Team members, their bios and their skill ratings are invented.** Presenting them as staff
  is a claim about real employment.
- **Stats** (7 years, 320+ projects, 18 people, 40+ clients) and **pricing** are placeholders.
- **Imagery** is generated SVG, sized to the ratios real photography should drop into.

## Known issues

- **White text on the orange accent measures 3.09:1**, below the WCAG minimum. It is v1's
  brand treatment and appears on every button and active tab, so changing it is a design
  decision rather than a bug fix: either darken the text or deepen the fill. Left as-is
  pending that call — it is the only thing standing between this and 100 on accessibility.
- The Keystatic dialog close button is layered onto Keystatic's own UI rather than being part
  of it, so a future Keystatic release could move the markup out from under it.

## Notes for review

- `src/components/layout/LogoMark.tsx` is **generated** by `scripts/trace-logo.mjs`, which
  traces `public/logo.png` into paths that take `currentColor` and `var(--accent)`. Edit the
  script, not the component.
- Placeholder art is generated by `scripts/generate-placeholders.mjs`; adding a project means
  adding its slug there too.
- Tailwind `@theme` token edits need a dev-server restart — HMR does not invalidate them.

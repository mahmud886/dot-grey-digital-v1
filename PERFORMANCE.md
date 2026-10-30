# Performance and accessibility

Last measured 30 October 2026, production build (`npm run build && npx next start`), Lighthouse 12
with default mobile and desktop emulation, on localhost (no CDN, so absolute times are optimistic;
compare scores between runs, not against other machines).

## Scores

Performance / Accessibility / Best Practices / SEO. Before = commit `196ac32`, after = this change.

| Page | Mobile before | Mobile after | Desktop before | Desktop after |
| --- | --- | --- | --- | --- |
| `/` | 97 / 97 / 100 / 100 | **99 / 100 / 100 / 100** | 99 / 97 / 100 / 100 | **100 / 100 / 100 / 100** |
| `/work` | 100 / 95 / 100 / 100 | 100 / 100 / 100 / 100 | 100 / 95 / 100 / 100 | 100 / 100 / 100 / 100 |
| `/services/automation` | **70** / 96 / 100 / 100 | **100** / 100 / 100 / 100 | 100 / 96 / 100 / 100 | 100 / 100 / 100 / 100 |
| other 9 pages tested | 100 / 96–97 / 100 / 100 | 95–100 / 100 / 100 / 100 | 100 / 96–97 / 100 / 100 | 100 / 100 / 100 / 100 |

Pages tested: `/`, `/work`, `/work/workday`, `/services`, `/services/automation`, `/about`,
`/insights`, `/insights/why-we-delete-features`, `/contact`, `/start`, `/faq`, `/privacy`.
Home mobile: LCP 1.2 s, CLS 0.004 (was 0.055), TBT 97 ms (was 184 ms).
`/services/automation` mobile TBT 78 ms (was 4,680 ms).
The two essay pages score 95–96 on mobile because of LCP variance on the throttled run (2.7 s); the
LCP element is the headline, there is nothing to optimise.

Accessibility, all 51 pages in sitemap order, light and dark, at 1440px and 390px (axe-core,
WCAG 2.0/2.1/2.2 A and AA plus best practices): **0 violations** (before: 323 entries across six
rules, mainly colour contrast and a mismatched theme-button name).
Keyboard and motion checks: skip link works, tab order follows reading order, mobile menu keeps
focus out of the page behind it and returns it to Menu on Escape, form and wizard errors are announced
and focus the first problem, and under `prefers-reduced-motion` no canvas or CSS animation runs.

## What changed

- Accessibility: contrast of the footer newsletter label and notes inside dark chapters, the
  services-deck stack line and the unread words of the scroll-darkening paragraph (floor raised from
  14% to 50% ink; text is now at least 24px so it counts as large text); theme button's accessible
  name now starts with its visible word; heading order on `/work`; unique footer landmark names;
  scrollable tables are keyboard-focusable regions; the dot-field canvas, not its wrapper, is the
  image (no focusable children inside `role="img"`); the mobile menu makes the page behind it
  `inert` and returns focus to the Menu button on Escape.
- Speed: homepage-only client code (dot field, work reel, deck, GSAP) moved from `Client.tsx` to
  `Home.tsx`, so inner pages no longer download it; wireframe sculpture draws at ~24 fps when idle,
  uses half the lines and a lower pixel ratio on phones, and starts after the page has loaded; the
  dot field batches dots by size, runs at ~30 fps and builds its masks only when near the viewport;
  the DOTGREY wordmark and greeting reserve their space in CSS so nothing jumps (CLS).
- Headers: `nosniff`, referrer policy, frame, permissions policy and a month of caching for the logo
  on the Node build (`next.config.ts`); the same plus Brotli and image caching in the cPanel
  `.htaccess` (`scripts/build-static.mjs`). `X-Powered-By` is off.

## How to measure again

Use a production build, never `next dev`. Both builds write to `.next/`, so run `npm run build`
again before `next start` if you have run `npm run build:static` since (otherwise unknown URLs return
500 instead of the site 404).

```bash
npm run build && npx next start -p 3230 &
mkdir /tmp/lh && cd /tmp/lh && npm init -y && npm i lighthouse @axe-core/playwright playwright-core
# one page, mobile (default) and desktop:
npx lighthouse http://localhost:3230/ --chrome-flags="--headless=new --no-sandbox" --output=html --output-path=home-mobile.html
npx lighthouse http://localhost:3230/ --preset=desktop --chrome-flags="--headless=new --no-sandbox" --output=html --output-path=home-desktop.html
```

For accessibility across every page, run axe (`withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa'])`)
over each URL in `/sitemap.xml`, in light and dark (set the `dg-theme` cookie) at 1440px and 390px.
Lighthouse's accessibility score only covers the page it loads, and misses dark mode.

## Budgets for future edits

- First-load JavaScript today (gzipped, measured from the served HTML): homepage about 255 KB,
  inner pages about 206 KB (React and Next account for roughly 150 KB of that). The homepage used to
  carry an extra ~90 KB of GSAP on every page; it is now about 49 KB and only on `/`. Do not let
  either number grow by more than about 15 KB without a reason. Check the sizes of the chunks a page
  lists in its HTML after `npm run build`.
- GSAP and anything canvas-based belongs in `Home.tsx` or a component that loads only where used;
  do not import it from `Client.tsx`, which every page loads.
- Canvases must pause offscreen, under reduced motion and behind the Pause control, cap pixel ratio
  at 2, and not animate before the `load` event.
- Reserve space for anything that changes after load (fonts, greeting, canvases): set a size or an
  aspect ratio in CSS.
- Any text colour must reach 4.5:1 (3:1 only for text of 24px, or 19px bold, and above) in light
  and dark. Check new greys against both `--paper` values.
- New photographs: use `next/image` with `sizes`, AVIF/WebP, and under 150 KB each. Project
  visuals are inline SVG mockups, keep them light (the homepage HTML is about 310 KB before
  compression, about 40 KB after).
- Every interactive element needs a visible `:focus-visible` style, a name that includes its visible
  text, and at least 24x24px of target.

# Responsive audit

> **বাংলায় সংক্ষেপে:** `node scripts/responsive-audit.mjs` সাইটের প্রতিটি পেজ ১৯টি স্ক্রিন-প্রস্থে (৩২০px থেকে ২৫৬০px), light ও dark, এবং ফোন/ট্যাবলেট landscape-এ খুলে ওভারফ্লো, ছোট লেখা, ছোট tap-target, লেখা-এর-উপর-লেখা, ফর্মে iOS zoom ইত্যাদি ধরে। কোনো সমস্যা পেলে exit code 1 দেয়। সাইট বদলানোর পর চালিয়ে দেখুন।

The script opens every route from `sitemap.xml` (plus a missing URL, to cover the 404) at many
viewport widths, in light and dark, and reports layout problems. It exits non-zero when it finds
any, so it can gate a release.

```bash
npm run build && npx next start -p 3230 &      # audit the production build, not `next dev`
node scripts/responsive-audit.mjs               # full sweep: 19 widths + landscape/tablet, light + dark
node scripts/responsive-audit.mjs --quick       # 4 widths, light only (about a minute)
node scripts/responsive-audit.mjs --routes /,/work --widths 320,390
node scripts/responsive-audit.mjs --base https://preview.example.com --out audit.json
```

It needs Playwright and a Chrome/Chromium it can launch (`PW_CHANNEL=chromium` to use the bundled
one). The sweep runs with reduced motion on, so animated sections are in their final layout.

## What it checks

| Check | Fails when |
| --- | --- |
| `overflow` | The page, or an element not inside a clipping/scrolling container, is wider than the viewport |
| `tiny-text` | Visible text is under 11px |
| `tap-target` | (touch viewports) a control is smaller than 40×40 CSS px, counting an invisible `::before`/`::after` hit area. Inline links in running text are exempt |
| `input-zoom` | (touch viewports) a text input is under 16px, which makes iOS Safari zoom in on focus |
| `collision` | Two visible text blocks overlap by more than a quarter of the smaller one. Closed accordions and the stacked deck are ignored |
| `fixed-cover` | A fixed or sticky bar covers more than a third of the screen |
| `console` | Console errors or uncaught exceptions |

## What it cannot check

- **Clipped but not overflowing content.** A word cut off by `overflow: clip` (as the homepage
  wordmark once was) looks fine to the script. Look at screenshots of the homepage at 320, 390 and
  1280 after touching the hero.
- **Real Safari.** WebKit isn't installable in the cloud build image, so the sweep runs on Chrome
  with phone emulation. `viewport-fit=cover`, `svh` units and safe-area padding are in place for the
  iOS notch and URL bar, but check on a real iPhone before a launch.
- **Whether it looks good.** Open the contact sheets, not just the report.

## Conventions that keep it green

- Single-column grids use `minmax(0, 1fr)`, never a bare `1fr`: a long word or table in a `1fr`
  track makes the whole column, and then the page, wider than the screen.
- Heading sizes have a floor that fits 320px (`clamp(2.1rem, 9.2vw, …)`), lifted from ~440px.
- On `(pointer: coarse)` every control gets a 44px hit area. Links get it from an invisible
  pseudo-element so the design doesn't move.
- Heights that follow the screen use `svh` (small viewport), so the iOS URL bar doesn't resize them.
- `env(safe-area-inset-*)` pads the header, footer, cookie banner and mobile menu.

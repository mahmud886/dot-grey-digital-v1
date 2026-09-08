# 00 — Brand & Design Tokens

## Who we are

**DotGrey Digital** — a digital product studio doing UI/UX design, web development, email
templates, banner ads and Veeva work. Small, fast, and unusually generous at the start of a
relationship: the site leads with free first deliverables.

- **Display name:** DotGrey Digital (wordmark `DOT` in orange, `GREY` in white, `DIGITAL` in grey)
- **Tagline:** *We create stunning digital experiences.*
- **Descriptor (meta, OG, footer):** DotGrey Digital designs and builds digital products —
  UI/UX, web development, email templates and banner ads.

## Tone of voice

Carried over from v1 and tightened.

| Do | Don't |
| --- | --- |
| Direct offers — "Your first template is on us" | Vague capability lists |
| Concrete deliverables and turnaround | "World-class", "cutting-edge" |
| ALL CAPS for headings, eyebrows and buttons | ALL CAPS for body copy |
| Sentence case in body text | Title Case Every Word |

**Correcting one thing from v1:** the global `text-transform: capitalize` on `body` forces
Every Word To Start Capitalised across the whole site, which is why v1 reads oddly in
paragraphs. v2 keeps uppercase for headings and eyebrows and leaves body copy alone.

## Type scale

| Role | Family | CSS var |
| --- | --- | --- |
| Display, headings, eyebrows, buttons | **Kanit** | `--font-display` |
| Body, UI, form fields | **Roboto** | `--font-body` |

All fluid, so there are no breakpoint jumps:

| Token | Clamp | Usage |
| --- | --- | --- |
| `display-1` | `clamp(2.75rem, 7vw, 6rem)` | Hero headline |
| `display-2` | `clamp(2rem, 4.5vw, 3.75rem)` | Section headlines, CTA band |
| `h1` | `clamp(1.875rem, 3.5vw, 3rem)` | Page hero titles |
| `h2` | `clamp(1.5rem, 2.4vw, 2.25rem)` | Sub-section titles |
| `h3` | `clamp(1.125rem, 1.5vw, 1.375rem)` | Card titles |
| `body-lg` | `clamp(1rem, 1.1vw, 1.125rem)` | Lead paragraphs |
| `body` | `1rem` | Default |
| `eyebrow` | `0.75rem` | Uppercase labels, `0.18em` tracking |

Headings: Kanit, weight 700, `line-height: 1.05`, `letter-spacing: -0.02em`, uppercase.
Body: Roboto 400, `line-height: 1.7`.

## Colour tokens

The orange is the brand and does not change between themes. What changes is everything
it sits on.

| Token | Light | Dark | Meaning |
| --- | --- | --- | --- |
| `--bg` | `#ffffff` | `#0a0908` | Page background |
| `--bg-elev` | `#f6f4f3` | `#14110f` | Alternating bands |
| `--bg-card` | `#ffffff` | `#1b1715` | Cards, form fields |
| `--fg` | `#0c0a09` | `#ffffff` | Primary text |
| `--fg-muted` | `#57534e` | `#a8a29e` | Body copy |
| `--fg-subtle` | `#78716c` | `#78716c` | Meta, captions |
| `--border` | `rgb(0 0 0 / .10)` | `rgb(255 255 255 / .10)` | Hairlines |
| `--border-strong` | `rgb(0 0 0 / .20)` | `rgb(255 255 255 / .20)` | Emphasised edges |
| `--accent` | `#ff5a3c` | `#ff5a3c` | Brand orange — fills, large text |
| `--accent-strong` | `#d93a1e` | `#d93a1e` | Small white-on-orange text, orange text on light |
| `--accent-fg` | `#ffffff` | `#ffffff` | Text on an accent fill |
| `--accent-dim` | `rgb(255 90 60 / .12)` | `rgb(255 90 60 / .14)` | Tints, hover washes |

### The contrast rule (important)

White on `#ff5a3c` measures **3.1:1**. That passes AA for large text only, so v1's small
white button labels on orange are below standard. v2 handles it explicitly:

- **Large text on orange** (≥24px, or ≥19px bold) — white on `--accent`. Keeps the look.
- **Small text on orange** (buttons, chips) — white on `--accent-strong` (**4.6:1** ✓).
- **Orange text on a light background** — always `--accent-strong` (**4.6:1** ✓), never
  `--accent`, which manages only 3.4:1 on white.
- **Orange text on dark** — `--accent` is fine (**5.9:1** on `#0a0908`).

Other checks: `--fg-muted` on `--bg` is 7.4:1 light, 8.1:1 dark. Both pass AA.

## The ambient gradient

v1's signature is a warm radial wash behind everything. v2 keeps it, moves it into tokens,
and gives it a light-mode counterpart.

- **Dark:** three ellipses — plum `rgb(87 24 69 / .22)`, deep red `rgb(153 27 27 / .18)` and
  ember `rgb(69 26 3 / .24)` — over `#12100f`.
- **Light:** the same three positions at much lower opacity in peach and rose over `#ffffff`,
  so the page reads as warm white rather than grey.

It drifts slowly and parallaxes on scroll (see `docs/04-motion.md`), and is a single fixed
layer rather than a per-page background.

## Spacing, radii, elevation

| `spacing` | Mobile | Desktop |
| --- | --- | --- |
| `sm` | `56px` | `80px` |
| `md` (default) | `80px` | `128px` |
| `lg` | `96px` | `160px` |

Container: `max-width 1200px` (v1 used `max-w-6xl` = 1152px; 1200 gives the wider grids room),
gutter `20px` mobile / `32px` desktop.

Radii: `24px` cards (v1's `rounded-3xl`), `16px` inner elements, `999px` pills.
Cards are glassy — `--bg-card` with a hairline border and `backdrop-blur(12px)` — carried
over from v1. Shadows are used only on the accent-filled card and the hero carousel.

Focus ring: `2px solid var(--accent)` at `2px` offset, visible in both themes.

## Theme behaviour

`<html data-theme="light|dark">`. **Dark-first**: `:root` holds the dark tokens and
`[data-theme="light"]` overrides them, so the design's native look survives a first visit
and a JavaScript-disabled one. The choice persists in `localStorage` under `dotgrey-theme`,
and an inline script stamps the attribute before first paint so there is no flash.

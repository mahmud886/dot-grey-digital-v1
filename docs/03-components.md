# 03 — Component Inventory

Path root: `src/components/`. Server components by default; `"use client"` noted explicitly.
Content comes from `src/data/*.ts`, which are typed wrappers over `src/content/*.json`.

## Layout & providers

| Component | Client? | Notes |
| --- | --- | --- |
| `layout/ThemeScript` | inline `<script>` | Stamps `data-theme` before first paint |
| `layout/ThemeProvider` | yes | Pass-through; state lives in `lib/theme-store` |
| `layout/ThemeToggle` | yes | Icon cross-rotate on switch |
| `layout/SmoothScroll` | yes | Lenis + GSAP ticker wiring |
| `layout/AmbientBackground` | yes | The drifting warm gradient, parallax, grain |
| `layout/Preloader` | yes | Once per session, skipped under reduced motion |
| `layout/ScrollProgress` | yes | Accent bar at the top of the viewport |
| `layout/Cursor` | yes | Dot + ring follower with hover states |
| `layout/Header` | yes | Condense, hide/show, accessible dropdowns |
| `layout/MobileMenu` | yes | Full-screen overlay, focus trap, scroll lock |
| `layout/Footer` | no | 4 columns + oversized wordmark |
| `layout/PageHero` | no | Breadcrumb + split-reveal title + optional meta |
| `layout/SiteChrome` | no | Wraps the public site so `/keystatic` can opt out |
| `layout/ProseLayout` | no | Legal pages, block-based |

**Theme contract:** `lib/theme-store.ts` reads the `data-theme` attribute already on
`<html>` — never a hardcoded default — and `useTheme()` consumes it through
`useSyncExternalStore`. `suppressHydrationWarning` goes on `<html>` itself; on an ancestor
it silently does nothing.

## Primitives

| Component | Client? | Props |
| --- | --- | --- |
| `ui/Container` | no | `size?: 'narrow' \| 'default' \| 'wide'` |
| `ui/Section` | no | `spacing`, `bg`, `bordered`, `id` |
| `ui/Eyebrow` | no | Uppercase label with a leading accent dot |
| `ui/SectionHeading` | no | `label`, `title`, `lead`, `action`, `align` |
| `ui/Button` / `ui/ButtonLink` | no | `variant: 'solid' \| 'outline' \| 'ghost' \| 'light'`, `size`, `arrow` |
| `ui/MagneticButton` | yes | Pointer-follow wrapper, desktop only |
| `ui/MarqueeButton` | yes | Repeating label that scrolls on hover |
| `ui/Reveal`, `ui/RevealGroup` | yes | Scroll entrance, `delay`, `y`, `stagger` |
| `ui/SplitText` | yes | `by: 'word' \| 'line'`, `trigger: 'scroll' \| 'mount'` |
| `ui/ScrollHighlightText` | yes | Word-by-word colour fill on scrub |
| `ui/Marquee` | yes | `items`, `speed`, `direction`, `outlined`, velocity-reactive |
| `ui/Counter` | yes | `to`, `suffix`, fires once |
| `ui/ProgressBar` | yes | Animates to width on scroll |
| `ui/Accordion` | yes | Single-open, `grid-template-rows` animation, full ARIA |
| `ui/Tabs` | yes | Sliding active pill, arrow-key navigation |
| `ui/TiltCard` | yes | 3D tilt + glare, desktop fine-pointer only |
| `ui/Lightbox` | yes | Gallery overlay, keyboard navigable |
| `ui/Field`, `ui/SelectField`, `ui/Honeypot` | yes | Form controls with inline errors |
| `ui/SubmitButton` | yes | `useFormStatus` pending state |

## Section components

`sections/` — each takes an optional `limit` where it renders a list, so inner pages reuse
the homepage sections with fewer items.

`Hero` · `HeroCardStack` · `FeatureRows` · `MarqueeBand` · `Works` · `Services` ·
`ServicesHorizontal` · `InnovativeDesign` · `StatsStrip` · `Testimonials` · `Faq` ·
`ProjectForm`

Inner-page only:

`Mission` · `Values` · `Approach` · `TeamGrid` · `SkillBars` · `ServicesList` · `Expertise` ·
`WhyPartner` · `ServiceFeatures` · `ServiceBenefits` · `IndustryExpertise` ·
`WorksFilterGrid` (client) · `WorkGallery` (client) · `NextProject` · `PricingCards` (client) ·
`ComparisonTable` · `FaqTabs` (client) · `BenefitCards` · `OpenRoles` · `ApplicationForm` (client) ·
`ContactDetails` · `MapPlaceholder`

## Cards

| Component | Client? | Notes |
| --- | --- | --- |
| `ui/ServiceCard` | no | Icon tile, accent variant for the highlighted one |
| `ui/WorkCard` | yes | Tilt + glare, cover parallax inside its mask |
| `ui/TeamCard` | yes | Portrait mask, grayscale → colour, socials slide up |
| `ui/TestimonialCard` | no | Quote, author, location, avatar |
| `ui/PricingCard` | no | `featured` variant |
| `ui/JobRow` | no | Title, department, location, type, arrow |

## Forms

| Item | Where |
| --- | --- |
| `app/actions/brief.ts` | Project brief Server Action — zod, honeypot, field errors |
| `app/actions/application.ts` | Job application Server Action |

Both validate and log, then return success. A single `// TODO: send via Resend/SMTP` marks
the integration point.

## Hooks

`hooks/useReducedMotion` · `hooks/useMediaQuery` (+ `useIsDesktop`, `useHasFinePointer`) ·
`hooks/useScrollDirection` · `hooks/useLockBodyScroll`

`useReducedMotion` and `useScrollDirection` are external stores rather than effect-driven
state, which keeps them clean under React Compiler's `set-state-in-effect` rule.

## Data modules (`src/data/`)

`site.ts` · `copy.ts` · `services.ts` · `works.ts` · `team.ts` · `testimonials.ts` ·
`pricing.ts` · `faq.ts` · `jobs.ts` · `stats.ts` · `values.ts`

Each exports typed arrays plus `getBySlug` helpers, so `generateStaticParams` and detail
pages share one source of truth.

# 01 — Sitemap & Routes

20 public routes plus `not-found`, all under the App Router in `src/app/`. Site pages live
in a `(site)` route group so `/keystatic` can opt out of the header and footer.

## Route table

| # | Route | Rendering | Purpose |
| --- | --- | --- | --- |
| 1 | `/` | Static | Homepage — 9 sections |
| 2 | `/about` | Static | Story, stats, values, approach, team strip |
| 3 | `/services` | Static | All 6 services, expertise, why-partner |
| 4 | `/services/[slug]` | SSG | Per-service detail |
| 5 | `/works` | Static | Filterable case-study grid |
| 6 | `/works/[slug]` | SSG | Case study detail |
| 7 | `/team` | Static | Full team grid |
| 8 | `/team/[slug]` | SSG | Member profile |
| 9 | `/pricing` | Static | Packages, comparison table, pricing FAQ |
| 10 | `/faq` | Static | Categorised FAQ |
| 11 | `/careers` | Static | Culture, benefits, open roles |
| 12 | `/careers/[slug]` | SSG | Role detail + application form |
| 13 | `/contact` | Static | Project brief form, offices, socials |
| 14 | `/privacy` | Static | Prose page |
| 15 | `/terms` | Static | Prose page |
| 16 | `/docs` | Static | Internal documentation index (noindex) |
| 17 | `/docs/[slug]` | SSG | Rendered markdown doc (noindex) |
| — | `*` | Static | 404 |

Also generated: `sitemap.ts`, `robots.ts`, `icon.tsx`, and share cards.

**Share cards.** `src/lib/og.tsx` renders every link preview at 1200×630. The site-wide card
lives at `src/app/opengraph-image.tsx`; `works`, `services`, `insights` and `team` each have
their own under `[slug]/opengraph-image.tsx`, so a shared case study previews as that case
study rather than as the homepage. Everything else falls back to the site card.

Two things about it are easy to break:

- The display face is vendored as **TTF** under `src/assets/fonts`. Satori cannot read the
  `.woff2` files `next/font` emits and will not fetch at build time, so without those files
  every card silently falls back to the host's system sans.
- The root layout deliberately sets **no `openGraph.title` or `description`**. Metadata merges
  field by field, so a title set there is inherited whole by every child route — put one back
  and every case study's preview reads "DotGrey Digital" again.

`/keystatic` and `/api/keystatic/*` sit outside the `(site)` group.

## Slugs

**Services** — carried over from v1, plus one addition
`email-templates` · `ui-ux-design` · `web-development` · `veeva-services` · `banner-ads` ·
`motion-video`

**Works** — v1's four, plus five so every filter lands on at least two projects
`workday` · `hakkas-dine` · `medicove-intl` · `fintech-pro` · `northline-logistics` ·
`aurora-health` · `verda-botanics` · `kestrel-athletics` · `parallel-labs`

**Team** — new in v2
`arif-hasan` · `nusrat-jahan` · `tanvir-ahmed` · `mahdi-rahman` · `sadia-islam` · `rifat-khan`

**Careers** — new in v2
`senior-ui-ux-designer` · `frontend-engineer` · `email-developer` · `motion-designer`

## Header navigation

```
Logo (DOT GREY DIGITAL)
├── About            → /about
├── Works            → /works
├── Services  ▾      → /services
│   ├── UI/UX Design         → /services/ui-ux-design
│   ├── Web Development      → /services/web-development
│   ├── Email Templates      → /services/email-templates
│   ├── Banner Ads           → /services/banner-ads
│   ├── Veeva Services       → /services/veeva-services
│   └── Motion & Video       → /services/motion-video
├── Company  ▾
│   ├── Team        → /team
│   ├── Pricing     → /pricing
│   ├── Careers     → /careers
│   └── FAQ         → /faq
└── Contact          → /contact
[ Theme toggle ]  [ GET A QUOTE → /contact ]
```

v1's dropdown opened on hover only and was invisible to keyboards. v2's opens on hover and
on focus, closes on `Escape`, and is arrow-key navigable.

Mobile: hamburger opens a full-screen overlay; the two dropdown groups become inline
accordions.

## Footer link graph

| Column | Links |
| --- | --- |
| **Brand** | Logo, descriptor, email, phone |
| **Services** | The six service detail pages |
| **Company** | About · Works · Team · Pricing · Careers · FAQ |
| **Connect** | LinkedIn · Dribbble · Behance · Instagram · X |
| **Bottom bar** | `© 2026 DotGrey Digital. All rights reserved.` · Privacy · Terms |

## Cross-links

- Home → every top-level page through section CTAs
- `/services` cards → `/services/[slug]`; each detail → 3 related services + `/contact`
- `/works` cards → `/works/[slug]`; each case study ends with a **Next project** link that
  wraps around the list
- `/team` cards → `/team/[slug]`; each profile shows 3 other members
- `/careers` rows → `/careers/[slug]`; each role links to its own application form
- `/pricing` and `/faq` both end on the contact band

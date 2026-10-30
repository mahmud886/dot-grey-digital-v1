# DotGrey Digital

The website for DotGrey Digital, a design and engineering studio in Dhaka: product and brand
design, web and app development, custom software, automation, data and machine learning.

Next.js 16 (App Router), TypeScript, CSS Modules, GSAP. Every page is statically generated; the forms endpoint is the only server route.

## Getting started

```bash
npm install
npm run dev     # http://localhost:3220
```

```bash
npm run build          # Node / Vercel build (forms send through Resend)
npm run build:static   # plain files in out/ for cPanel (forms send through api/forms.php)
npm run lint
npx tsc --noEmit
```

Hosting, the forms and their email setup (Resend or PHP mail) are covered in
[`DEPLOY.md`](DEPLOY.md). Editing content is covered in [`CONTENT.md`](CONTENT.md).

## Routes

| Route | Page |
| --- | --- |
| `/` | Home |
| `/work`, `/work/[slug]` | Work index and case studies |
| `/services`, `/services/[id]` | Services and the six service pages |
| `/process`, `/engagements`, `/start` | How we work, engagement models, start-a-project wizard |
| `/about`, `/team/[slug]`, `/culture`, `/careers`, `/careers/[slug]` | Studio, people, culture and roles |
| `/insights`, `/insights/[slug]`, `/resources` | Essays and resources |
| `/industries`, `/capabilities`, `/ai` | Sectors, tool stack, AI and automation |
| `/contact`, `/faq` | Contact brief and FAQ |
| `/privacy`, `/terms`, `/cookies`, `/accessibility`, `/site-map` | Fine print and a human site map |
| `/sitemap.xml`, `/robots.txt`, `/opengraph-image` | Generated for search engines and link previews |

## Where things are

| Path | Contents |
| --- | --- |
| `src/app/(site)/` | One folder per route; `layout.tsx` holds fonts, header, cursor and motion |
| `src/site/` | Components (`Chrome`, `Client`, `Bits`, `Pages`, `More`, `Legal`), styles, navigation (`nav.ts`) and page metadata (`meta.ts`) |
| `src/site/content.ts` | Services lineup and process, plus re-exports of everything in `src/data` |
| `src/site/agency.ts` | Engagement models, process detail, industries, AI principles and other page copy |
| `src/content/*.json`, `src/data/` | Works, stats, testimonials, team, posts, jobs, FAQ, values, legal text and site details |
| `src/site/shared/` | Theme (light/dark cookie, pre-paint script, toggle), project mockups, generative art, logo |

## Editing content

Most copy lives in `src/content/*.json` and `src/site/agency.ts`. Before launch, confirm:
team names and bios (`team.json`), engagement starting prices (`agency.ts`), and the
privacy and terms text, which is marked as needing legal review.

## Branches

- `legacy` — the previous production site (CMS, forms, docs).
- `prototypes-archive` — all thirteen redesign directions and the lab page they were compared on.

Analytics (Google Analytics 4, consent-gated, off until you set an ID): see [ANALYTICS.md](ANALYTICS.md).

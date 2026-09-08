# 05 — Content

Everything here becomes a typed module in `src/data/` reading JSON from `src/content/`.
v1's real copy is carried over wherever it existed; new sections are placeholder, written to
be plausible and replaced.

## Site basics (`site.json`)

| Key | Value |
| --- | --- |
| `name` | DotGrey Digital |
| `tagline` | We create stunning digital experiences. |
| `description` | DotGrey Digital designs and builds digital products — UI/UX, web development, email templates and banner ads. |
| `email` | hello@dotgreydigital.com |
| `phone` | +880 1700 000000 |
| `founded` | 2019 |

**Offices:** Dhaka (House 12, Road 7, Uttara, Dhaka 1230, Bangladesh) · Remote (Distributed team across 4 time zones)

**Socials:** LinkedIn · Dribbble · Behance · Instagram · X — all `#` placeholders.

## Services (`services.json`) — 6

Five carried from v1, plus Motion & Video.

| # | Slug | Title | Blurb |
| --- | --- | --- | --- |
| 01 | `ui-ux-design` | UI/UX Design | Websites, SaaS and dashboards designed for clarity and conversion. |
| 02 | `web-development` | Web Development | Clean builds, performance-minded, responsive by default. |
| 03 | `email-templates` | Email Templates | Compatible layouts that render properly in every major inbox. |
| 04 | `banner-ads` | Banner Ads | HTML5 display ads built for attention and message clarity. |
| 05 | `veeva-services` | Veeva Services | Approved email and CLM content for life-sciences teams. |
| 06 | `motion-video` | Motion & Video | Short promos, UI demos and reels — simple and clean edits. |

Each also carries: a lead, two overview paragraphs, 5 "What's included" bullets, 6 features
(title, description, lucide icon name), 4 benefits and 4 industries.
v1's `Lorem ipsum` feature descriptions are replaced with real sentences.

## Works (`works.json`) — 6

| Slug | Title | Year | Category | Client |
| --- | --- | --- | --- | --- |
| `workday` | Workday | 2025 | UI/UX | Workday |
| `hakkas-dine` | Hakka's Dine | 2025 | Web | Hakka's |
| `medicove-intl` | Medicove Intl | 2024 | UI/UX | Medicove |
| `fintech-pro` | Fintech Pro | 2024 | Web | Fintech Pro |
| `northline-logistics` | Northline Logistics | 2024 | Branding | Northline |
| `aurora-health` | Aurora Health | 2023 | Email | Aurora |

The first four keep v1's titles, descriptions and tags. Each gains: cover, 3-image gallery,
services list, challenge, solution, 3 result stats and a client quote.

## Team (`team.json`) — 6

| Slug | Name | Role |
| --- | --- | --- |
| `arif-hasan` | Arif Hasan | Founder & Design Director |
| `nusrat-jahan` | Nusrat Jahan | Lead UI/UX Designer |
| `tanvir-ahmed` | Tanvir Ahmed | Lead Engineer |
| `mahdi-rahman` | Mahdi Rahman | Email & Veeva Specialist |
| `sadia-islam` | Sadia Islam | Motion Designer |
| `rifat-khan` | Rifat Khan | Project Manager |

Each has two bio paragraphs, four skill bars and social links. Bios avoid pronouns — they
describe the work, not the person's gender.

## Testimonials (`testimonials.json`) — 5

v1 shipped three, two of which were the same paragraph duplicated and all crediting
"Musemind" rather than DotGrey. Rewritten and expanded.

Authors: George El Nachar (Founder, Trainmate — Dubai) · Val Kobal (Product Lead, Northline —
Ljubljana) · Sarah Jenkins (CEO, TechStart — San Francisco) · Imran Chowdhury (Marketing
Director, Aurora Health — Dhaka) · Elena Rossi (Head of Brand, Medicove — Milan).

## Values (`values.json`) — 6

Clarity over cleverness · Ship, then refine · Own the outcome · Design with constraints ·
Say the hard thing early · Leave it maintainable.

## Stats (`stats.json`)

`7` years · `320+` projects delivered · `18` people · `40+` clients worldwide.

## Pricing (`pricing.json`)

Toggle between **Monthly retainer** and **Fixed project**.

| Plan | Monthly | Project | Blurb |
| --- | --- | --- | --- |
| STARTER | $1,200 / mo | from $2,500 | One active request. For founders validating an idea. |
| GROWTH *(featured)* | $2,400 / mo | from $6,000 | Two active requests, priority turnaround, a dedicated designer. |
| SCALE | $4,500 / mo | from $12,000 | Unlimited queue, design plus engineering plus motion. |

Comparison rows: Active requests · Turnaround · Revisions · Design system · Development ·
Email templates · Motion · Dedicated channel · Strategy call · Support SLA.

## FAQ (`faq.json`) — 14 across 4 categories

**General** — What does DotGrey actually do? · Who do you usually work with? · Where is the
team based? · Do you sign NDAs?

**Process** — How does a project start? · How long does a typical project take? · How
involved do I need to be? · What do you need from me to get started?

**Pricing** — Are the free first deliverables really free? · Do you charge for revisions? ·
Can I pause or cancel a retainer? · What payment methods do you accept?

**Support** — Do you maintain things after launch? · Can I outsource white-label work to you?

## Careers (`jobs.json`) — 4

| Slug | Title | Department | Location | Type |
| --- | --- | --- | --- | --- |
| `senior-ui-ux-designer` | Senior UI/UX Designer | Design | Dhaka / Remote | Full-time |
| `frontend-engineer` | Frontend Engineer | Engineering | Remote | Full-time |
| `email-developer` | Email Developer | Production | Dhaka | Full-time |
| `motion-designer` | Motion Designer | Design | Remote | Contract |

Each has a summary, 5 responsibilities, 5 requirements, 4 nice-to-haves. Shared benefits:
flexible hours · remote-friendly · learning budget · health cover · paid time off ·
new machine on joining.

## Form option lists

**Service required:** UI/UX Design · Web Development · Email Templates · Banner Ads ·
Veeva Services · Motion & Video · Something else

**Budget:** Under $2,000 · $2,000 – $10,000 · $10,000 – $30,000 · $30,000+ · Not sure yet

**Timeline:** ASAP · 1–3 months · 3–6 months · Just exploring

## Page copy (`content/pages/*.json`)

Hero headline and lead, every section eyebrow/heading/button label, and each inner page's
title, lead and body blocks — all editable from the CMS, none hardcoded in components.

## Legal

`/privacy` and `/terms` carry generic placeholder prose behind a visible
**"Placeholder text — requires legal review before launch."** banner.

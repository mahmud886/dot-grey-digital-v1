# DotGrey Digital — Website (v2)

Marketing site for DotGrey Digital, a digital product studio. Next.js 16 (App Router),
TypeScript, Tailwind v4, GSAP + Lenis, fully static.

This is the `v2-animated-redesign` branch: a motion-led, typed, editable rebuild of v1 that
keeps its identity — the orange, the warm gradient, the uppercase Kanit headings — and
changes almost everything underneath. See [`docs/README.md`](docs/README.md) for the
v1 → v2 comparison.

## Getting started

```bash
npm install
npm run dev     # http://localhost:3220
```

```bash
npm run build   # static build of all routes
npm run lint
npx tsc --noEmit
```

## What is here

| Path | Contents |
| --- | --- |
| `docs/` | The scope specs — brand tokens, sitemap, section behaviour, component inventory, the motion catalogue, content, and the CMS guides. **Read these first.** Also browsable at `/docs`. |
| `src/content/` | All site content and page copy as JSON. This is what the CMS reads and writes. |
| `src/data/` | Thin typed wrappers around `src/content/`. Components import these, never the JSON directly. |
| `keystatic.config.ts` | The CMS content model |
| `src/components/ui/` | Primitives — `Section`, `Reveal`, `SplitText`, `Marquee`, `Magnetic`, `TiltCard`, `Accordion`, `Field`… |
| `src/components/sections/` | Page sections, reusable across routes via `limit` props |
| `src/components/layout/` | Header, footer, mobile menu, cursor, preloader, ambient background, theme |
| `src/app/actions/` | Server Actions for the project brief and job application forms |
| `src/proxy.ts` | Blocks the CMS in production until GitHub is configured |
| `scripts/generate-placeholders.mjs` | Regenerates every placeholder image in `public/img` |

## Editing content

The site has a built-in CMS at **`/keystatic`**. It is git-based — **there is no database**.
Content lives as JSON in `src/content/`, and saving from the CMS writes those files; in
production that becomes a commit and the site rebuilds.

- **Locally:** `npm run dev`, then open http://localhost:3220/keystatic. No login.
- **For the team:** editors sign in with GitHub, and CMS access is simply write access to
  this repository. Setup is a one-time, fifteen-minute job — Keystatic's own wizard creates
  the GitHub App and writes most of the environment variables for you. Follow
  [`docs/07-cms-setup.md`](docs/07-cms-setup.md) step by step.

Until that setup is done, `/keystatic` returns 404 in production on purpose.

## Design system

Dark-first. `:root` holds the dark tokens, `[data-theme="light"]` overrides them, and
`ThemeScript` stamps the attribute before first paint so there is no flash — a visitor with
JavaScript disabled still gets a correct dark page. The brand orange `#ff5a3c` is the same
in both themes.

Type is Kanit (display, uppercase) and Roboto (body), both fluid via `clamp()`. Full token
table in [`docs/00-brand.md`](docs/00-brand.md).

Two things worth knowing before you edit styles:

- `cn()` uses a **configured** `tailwind-merge` (`src/lib/cn.ts`). Without it, merge reads
  custom classes like `text-display-1` as colours and silently drops them next to `text-fg`.
  If you add a token to the `--text-*` or `--color-*` scales, add it there too.
- Changing a `@theme` token in `globals.css` needs a **dev server restart** — Tailwind's dev
  cache does not invalidate on those edits, and you will keep seeing the old value.

## Motion

GSAP + ScrollTrigger for scroll work, Lenis for smooth scroll, Embla for carousels. Every
animation is scoped with `useGSAP` so it reverts on unmount, and every one is skipped under
`prefers-reduced-motion` — content renders in its final state, Lenis is never initialised,
pinned sections stop pinning, and the cursor, magnetic and tilt effects are off. Catalogue
in [`docs/04-motion.md`](docs/04-motion.md).

## Placeholder content

Everything is placeholder, written to be replaced:

- **Copy** lives in `src/content/**.json` and is editable from the CMS.
- **Imagery** is generated SVG in the brand's warm palette rather than stock photography.
  Aspect ratios are fixed — `16:10` for work covers, `4:5` for team — so real images drop in
  without layout changes. Remote images are still supported (`images.remotePatterns` keeps
  Unsplash allowed), so real photography can be used as soon as it exists.
- **Forms** validate with zod and send through Resend. Without `RESEND_API_KEY` they
  still accept submissions and write them to the server log, so a missing key never
  turns into a failed submission for a visitor. See [`.env.example`](.env.example).
- **`/privacy` and `/terms`** carry a visible placeholder banner and need legal review.

## Before launch

[`docs/08-golive-checklist.md`](docs/08-golive-checklist.md) lists every placeholder that
has to be replaced, field by field. The short version:

1. Real logo as SVG — the wordmark is currently set as type, because v1's `logo.png` is
   white artwork that disappears on the light theme
2. Real project imagery, case-study content and team photos
3. Confirm office addresses, phone and email (CMS → Site settings)
4. Set the site URL to the real domain (CMS → Site settings) — it feeds metadata, OG and the sitemap
5. Add `RESEND_API_KEY` and `CONTACT_FROM_EMAIL` so form submissions arrive by email
6. Legal review of `/privacy` and `/terms`
7. Replace the social `#` placeholders (CMS → Site settings)
8. Configure the CMS for GitHub login — see [`docs/07-cms-setup.md`](docs/07-cms-setup.md)

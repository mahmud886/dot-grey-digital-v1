# 06 — CMS

The site has a built-in editor at **`/keystatic`** so non-technical team members can change
content without touching code. It uses [Keystatic](https://keystatic.com), a git-based CMS:
there is **no database**. Content lives as JSON files in the repository, and saving from the
CMS writes those files.

```
Editor changes text  →  commit to the repo  →  site rebuilds  →  change is live
```

## What is editable

Everything under `src/content/`. The CMS dashboard groups it as:

| Group | What it covers |
| --- | --- |
| **Site** | Agency name, tagline, email, phone, offices, socials, header and footer navigation, form dropdown options |
| **Home page** | Hero headline, accent word, lead and buttons; every section eyebrow, heading and button label |
| **Content** | Services, works, team, testimonials, values, stats |
| **Commercial** | Pricing plans and comparison table, FAQ, careers benefits and open roles |
| **Page copy** | Titles, intros and body text for About, Services, Works, Team, Pricing, FAQ, Careers, Contact and 404, plus Privacy and Terms |

Images upload directly — work covers and galleries, team portraits, the about and culture
images. Uploads are committed to `public/img/…` and the stored value is the path the site
renders.

**Not editable from the CMS** (these are code): page layout and section order, colours and
typography, animations, and the form-handling logic.

## Local editing (no login)

With the dev server running, open `http://localhost:3220/keystatic`. There is no login —
saving writes straight into your working tree and shows up in `git status` like any other
edit. This is the mode to use while developing.

## Team editing (GitHub login)

For the team, the CMS runs against GitHub. Each editor needs a free GitHub account with
write access to the repository; saving creates a commit and the host rebuilds the site.

**One-time setup** — done once, on your own machine, in about fifteen minutes.
[`docs/07-cms-setup.md`](07-cms-setup.md) walks through it click by click; the short version:

1. Push the repository to GitHub and deploy the site.
2. Locally, put one line in a `.env` file — the repository, as `owner/name`.
3. Run `npm run dev` and open `/keystatic`. Keystatic shows a setup wizard, sends you to
   GitHub to create a GitHub App, and on the way back **writes the remaining four values
   into `.env` for you**.
4. Install that app on the repository when GitHub offers.
5. Copy all five values into your host's environment variables and redeploy.
6. Give each team member **Write** access to the repository. CMS access is repository
   access — remove someone from the repo and they lose the CMS too.

The five variables, in plain terms:

| Variable | What it is |
| --- | --- |
| `NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO` | Which repository content is committed to |
| `NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG` | The name GitHub gave the app, used to build the sign-in link |
| `KEYSTATIC_GITHUB_CLIENT_ID` | The app's public identifier with GitHub |
| `KEYSTATIC_GITHUB_CLIENT_SECRET` | The app's password with GitHub — keep private |
| `KEYSTATIC_SECRET` | A random key used to sign editors' login cookies — keep private |

**Until step 5 is done, `/keystatic` returns 404 in production.** That is deliberate:
without a configured repo the CMS would fall back to local mode with no login at all, so
`src/proxy.ts` blocks it rather than shipping an open editor.

## How it is wired

| File | Role |
| --- | --- |
| `keystatic.config.ts` | The content model — which fields the editor sees, and which file each writes |
| `src/app/keystatic/[[...params]]/page.tsx` | The admin UI. **Must** be a Client Component — without `"use client"` the bundler resolves Keystatic's react-server stub and the page renders blank with no error |
| `src/app/api/keystatic/[...params]/route.ts` | Handles the GitHub sign-in and commit flow |
| `src/proxy.ts` | 404s the CMS in production until GitHub is configured |
| `src/app/(site)/layout.tsx` | The site's chrome lives here, not in the root layout, so the CMS does not inherit it |
| `src/content/**.json` | The content itself |
| `src/data/*.ts` | Thin typed wrappers that import the JSON. Components import these, never the JSON directly |

## Why singletons rather than collections

Each content type is one JSON file holding an array, not one file per entry. That keeps the
data synchronously importable (`import data from "@/content/works.json"`), which is what
lets the whole site stay statically generated and lets client components like the pricing
toggle and works filter read content directly. Per-entry files would force Keystatic's
async reader API and a much larger refactor.

A Keystatic singleton `path` **without** a trailing slash writes `<path>.json`; with one it
writes `<path>/index.json`. Ours are flat, so the paths have no trailing slash.

Practical consequence: in the CMS, works and team members appear as a reorderable list
inside one screen rather than as separate documents.

## Rules for editors

- **Slugs are URLs.** Changing a project's slug changes its page address and breaks any
  existing link. Rename the title freely; leave the slug alone unless you mean it.
- **IDs must stay unique.** Testimonials and FAQ entries have an `id` that is not shown on
  the site but must not be duplicated.
- **Categories must match.** A work's category and an FAQ question's category have to be
  spelled exactly like one of the entries in the category list above them, or they will not
  appear under any filter.
- **Pricing plan IDs** (`starter`, `growth`, `scale`) tie the plans to the comparison table
  columns. Renaming a plan is fine; changing its ID is not.
- **The hero accent word** must appear in one of the headline lines, or nothing is
  highlighted. It is matched on the word itself, not its position.
- **Image shapes matter.** Work covers read best at 16:10, team portraits at 4:5. Other
  ratios will be cropped to fit.

## Editing a list item

Clicking a row in any list opens an **Edit item** dialog. Keystatic ships that dialog with
**Done** as its only control, so a dialog you opened by mistake has no obvious way out. There
is now a **×** in its top-right corner that closes it.

Closing is all it does, and that is all it needs to do: everything you type in that dialog is
already in the form the moment you type it, and Done does not commit anything either. Neither
button touches the content files — nothing is written until you press **Save** at the top of
the screen behind. To throw away a set of edits, leave the screen without saving.

## Adding a new editable field

1. Add it to the JSON file in `src/content/`.
2. Add a matching field to `keystatic.config.ts`.
3. Read it in the component through `src/data/copy.ts` or the relevant `src/data/*.ts`.

Steps 1 and 2 must agree, and the consequence of getting it wrong is worse than a dropped
field: Keystatic validates the whole file before it renders the form, and treats any key the
schema does not declare as a hard error. One undeclared key and the entry will not open at
all — the editor sees `Field validation failed` where the form should be, with no way to
edit their way out of it.

So `npm run dev` and `npm run build` both run `scripts/check-content.mjs` first, which walks
every singleton's schema against its JSON and fails with the offending path:

```
services.services[0].__probe — in the JSON, missing from keystatic.config.ts
```

Run it on its own with `npm run check:content`. It only flags keys the JSON has and the
schema does not; the reverse is legal, since a field the content omits is filled from the
schema's default.

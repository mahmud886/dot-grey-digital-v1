# 09 — Moving to the real domain

The site runs on **`https://dot-grey-digital-v1.vercel.app`** until it has a domain of its own. This page is
the full list of what changes when it does. Most of it is not code: the site works out its own
address, so there is nothing to edit in the project.

## Why there is no code to change

Everything that needs the site's full address — link-preview images, the sitemap, robots.txt,
the Organization data search engines read — takes it from `src/lib/site-url.ts`, which asks
Vercel which domain it is serving. Today that is `dot-grey-digital-v1.vercel.app`. Attach a domain in Vercel and
the next deployment uses it automatically.

It checks, in order:

1. `NEXT_PUBLIC_SITE_URL`, if set — an override, for hosting somewhere other than Vercel.
2. `VERCEL_PROJECT_PRODUCTION_URL` — set by Vercel itself; you never add this one.
3. The website address in **Site settings** in the CMS — the fallback for local development.

## Before you have the domain

`dotgreydigital.com` currently serves the **previous site**, on Hostinger. The new site keeps
working on its Vercel address until DNS moves, and nothing on it points at the old server any
more — share images, the sitemap and robots.txt all use the address that actually serves them.

## The switch, step by step

Say the new domain is `dotgreydigital.com`.

### 1. Attach it in Vercel

Vercel → the project → **Settings** → **Domains** → **Add** → type `dotgreydigital.com`.

Vercel then shows the DNS records to create. Add them at the company you bought the domain
from — usually one `A` record for `dotgreydigital.com` and one `CNAME` for `www.dotgreydigital.com`. It
can take from a few minutes to a day to take effect; Vercel shows **Valid Configuration** when
it has.

Add both `dotgreydigital.com` and `www.dotgreydigital.com`, and set one to redirect to the other.
Vercel's production address is the *shortest* domain attached, so use the one without `www`
as the main one, or the link previews will name the other.

### 2. Redeploy

**Deployments** → ⋯ on the latest → **Redeploy**. The address is read when the site is built,
so the change needs one new build to take effect.

### 3. Add the new address to the GitHub App

GitHub → **Settings** → **Developer settings** → **GitHub Apps** → the app → **General** →
**Add redirect URI**:

```
https://dotgreydigital.com/api/keystatic/github/oauth/callback
```

Keep the existing ones — the `dot-grey-digital-v1.vercel.app` one keeps the CMS working on the old address
during the switch, and `http://127.0.0.1:3220/…` keeps it working on your computer.
Change **Homepage URL** on the same page to the new domain. Press **Save changes**.

Tell your editors the new CMS address: `https://dotgreydigital.com/keystatic`. Nothing else
changes for them — same login, same content.

### 4. Update Site settings in the CMS

`https://dotgreydigital.com/keystatic` → **Site settings**:

- **Website URL** → `https://dotgreydigital.com`
- **Email** → the address on the new domain — but only once mail works on it. A domain does
  not receive email by itself; you need a mail service (Google Workspace, Zoho Mail, or your
  registrar's own) and its DNS records added too. Send yourself a test before changing it.

Save. This updates what the site *displays*; the technical addresses already changed in step 2.

### 5. Check it

- `https://dotgreydigital.com` loads the site, and `www.` redirects to it.
- Paste a page link into **opengraph.xyz** — the preview should show that page's own card,
  with the new domain.
- `https://dotgreydigital.com/sitemap.xml` lists addresses on the new domain.
- Log in to `https://dotgreydigital.com/keystatic` and save a small change.

### After the switch: the old site

Once DNS points at Vercel, the Hostinger site stops being reachable at the domain. Keep the
Hostinger account until you have checked the new site is live on the domain, then cancel it.
The old `dot-grey-digital.vercel.app` deployment answers every URL with a page, even ones that
do not exist, so search engines can count it as a copy of the site — delete that Vercel
project once the domain is live.

## If something looks wrong

**Link previews still show the old address.** The site has not been rebuilt since the domain
was attached (step 2). Facebook and LinkedIn also cache previews for days: ask them to fetch
it again with Facebook's **Sharing Debugger** or LinkedIn's **Post Inspector**.

**The CMS login fails on the new domain but works on the old one.** Step 3 is missing or has
a typo — the address has to match character for character, including `https://`.

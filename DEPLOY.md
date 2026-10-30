# Deploying the site and its forms

> **Bangla summary:** Site duibhabe chalano jay. **(1) Vercel + Resend** — sobcheye shohoj: Vercel-e 3-4 ta environment variable dilei form theke email sorasori inbox-e ashbe. **(2) cPanel** — `npm run build:static` chalan, `out/` folder-er shob kichu `public_html`-e upload korun, tarpor `api/config.example.php` copy kore `api/config.php` banan ar setting din. Kono setting na thakle form visitor-er email app khule dey, tai kono brief hariye jay na.

The site has four forms: the project brief (`/contact`), the start-a-project steps (`/start`),
job applications (`/careers/<role>`) and the newsletter field (footer and `/resources`). All
of them post the same JSON to a forms endpoint, which emails the studio.

There are two interchangeable endpoints:

| Hosting | Endpoint | Sends with |
| --- | --- | --- |
| Vercel or any Node host (`npm run build`) | `/api/forms` (`src/app/api/forms/route.server.ts`) | Resend |
| cPanel / shared hosting, no Node (`npm run build:static`) | `/api/forms.php` (`php/forms.php`) | Resend, or the host's own mail server |

Both validate every field again on the server, ignore bots (a hidden honeypot field and a
minimum time on the form), allow 5 submissions per visitor per 10 minutes, and escape
everything they put in an email. If an endpoint has no mail service configured, or sending
fails, the browser falls back to opening the visitor's email app with the message filled in,
and tells them so — nothing is lost either way. Nothing is stored in a database.

---

## Option 1 — Vercel + Resend (recommended)

1. **Create a Resend account** at <https://resend.com> and add your domain
   (Domains → Add domain → `dotgreydigital.com`).
2. **Add the DNS records Resend shows you** at your DNS provider: an MX and TXT record for the
   sending subdomain (SPF), a TXT record for DKIM (`resend._domainkey`), and optionally DMARC
   (`_dmarc`, e.g. `v=DMARC1; p=none;`). Wait until Resend shows the domain as **Verified**.
3. **Create an API key** (API Keys → Create, "Sending access" is enough unless you use the
   newsletter list, which needs "Full access").
4. **In Vercel** → Project → Settings → Environment Variables, add (Production and Preview):

   | Variable | Example | Required |
   | --- | --- | --- |
   | `RESEND_API_KEY` | `re_…` | yes |
   | `CONTACT_FROM_EMAIL` | `DotGrey Digital <website@dotgreydigital.com>` — must be on the verified domain | yes |
   | `CONTACT_TO_EMAIL` | `hello@dotgreydigital.com` (defaults to the email in `src/content/site.json`) | no |
   | `RESEND_AUDIENCE_ID` | a Resend segment/audience id; newsletter signups are added to it. Empty = each signup is emailed to you instead | no |
   | `CONTACT_AUTOREPLY` | `true` to send the visitor a short "thanks, we got it" email | no |

5. **Redeploy** (Deployments → … → Redeploy) so the variables take effect.
6. **Test:** send the form on `/contact` with your own address. You should see "Thanks — we'll
   reply within one working day" and receive the email; pressing Reply answers the visitor.
   Resend → Emails shows every send and any error.

`.env.example` lists the same variables for local development (`.env.local`).

---

## Option 2 — cPanel / shared hosting (no Node server)

The whole site exports to plain HTML files plus one PHP file for the forms.

### Build

```bash
npm install
NEXT_PUBLIC_SITE_URL=https://dotgreydigital.com npm run build:static
```

`NEXT_PUBLIC_SITE_URL` makes the canonical links, sitemap and share images point at your real
domain. The result is in `out/`:

- one `.html` file per page (`about.html`, `work/workday.html`, …), `404.html`, `sitemap.xml`,
  `robots.txt`, the share image and favicon, and `_next/` (scripts, styles, fonts)
- `.htaccess` — clean URLs (`/about` serves `about.html`), the 404 page, caching, and
  commented-out HTTPS / www redirects you can switch on
- `api/forms.php`, `api/config.example.php`, `api/.htaccess` — the form endpoint

### Upload

1. In cPanel → File Manager, open `public_html` (or the domain's document root).
2. Upload **everything inside** `out/`, including the hidden `.htaccess` files and the `api/`
   folder. (Easiest: zip the contents of `out/`, upload the zip, then Extract.)
3. In `public_html/api/`, copy `config.example.php` to **`config.php`** and edit it:
   - **Resend mode (recommended):** set `RESEND_API_KEY` and a `CONTACT_FROM_EMAIL` on your
     Resend-verified domain (see Option 1, steps 1–3).
   - **Host mail mode (no Resend):** leave the key empty and set `CONTACT_FROM_EMAIL` to an
     address on your own domain, e.g. `website@dotgreydigital.com` (create it in cPanel →
     Email Accounts so the server is allowed to send as it).
   - `CONTACT_TO_EMAIL` is where submissions arrive.
   `config.php` is blocked from the web by `api/.htaccess` and is not in git. If you keep a
   filled-in `php/config.php` locally, `npm run build:static` copies it into `out/api/` too.
4. **PHP version:** 7.4 or newer (cPanel → Select PHP Version / MultiPHP Manager). The Resend
   mode needs the `curl` extension, which is on by default almost everywhere.
5. Turn on SSL (cPanel → SSL/TLS Status → AutoSSL), then uncomment the HTTPS redirect at the
   top of `public_html/.htaccess`.

### Test

- Open `https://yourdomain/about` (no `.html`) — it should load. Open a made-up URL — you
  should get the site's "Lost." page.
- `https://yourdomain/api/forms.php` in the browser should say `{"ok":false,"error":"Use POST."}`;
  `https://yourdomain/api/config.php` should be **Forbidden**.
- Send the form on `/contact`. "Thanks — we'll reply within one working day" means it was sent.
  "We couldn't send it from here…" means the endpoint has no working mail setup, and the
  visitor's email app was opened instead.

### Troubleshooting

| Symptom | Fix |
| --- | --- |
| Pages other than the home page show 404 | `.htaccess` was not uploaded (it's hidden — enable "Show hidden files" in File Manager), or `mod_rewrite` is off (ask the host). |
| Form always says "We couldn't send it from here" | `api/config.php` is missing or has neither a Resend key nor a From address. Check cPanel → Errors / `error_log` in `api/` for `[dotgrey forms] send failed`. |
| Emails sent with host mail land in spam | Use Resend mode, or add SPF/DKIM for your domain in cPanel → Email Deliverability. The From address must be on your own domain. |
| "Too many messages in a short time" while testing | The endpoint allows 5 sends per visitor per 10 minutes. Wait, or delete the files in the temp folder `dotgrey-forms/` (or the folder set in `RATE_LIMIT_DIR`). |
| Newsletter signups don't appear in Resend | Set `RESEND_AUDIENCE_ID` and use an API key with full access; otherwise signups are emailed to you. |

---

## How the two builds differ

`next.config.ts` reads `STATIC_EXPORT=1` (set by `npm run build:static`). Files that need a
running server are named `*.server.ts(x)` and are only routes in the Node build: the forms
route handler and the catch-all that renders the site 404 for unknown URLs. The static build
uses `404.html` (from `src/app/not-found.tsx`) via `.htaccess` instead. `npm run build` for
Vercel is unchanged.

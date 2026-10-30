# Analytics (Google Analytics 4)

**বাংলায় সারসংক্ষেপ:** সাইটে Google Analytics 4 বসানো আছে, কিন্তু `NEXT_PUBLIC_GA_ID` (যেমন `G-ABC123XYZ9`) না দেওয়া পর্যন্ত কিছুই চলে না: কোনো ব্যানার নেই, কোনো স্ক্রিপ্ট নেই। ID দিলে প্রথমবার আসা ভিজিটর একটি cookie ব্যানার দেখবেন। **Accept** চাপলে তবেই Google-এর স্ক্রিপ্ট লোড হয় ও পেজ ভিউ/ইভেন্ট গোনা শুরু হয়; **Decline** চাপলে বা কিছু না করলে কিছুই লোড হয় না, কোনো `_ga` cookie বসে না। সব কিছু ব্রাউজারে চলে, তাই Node সার্ভার ছাড়া cPanel-এ (`npm run build:static` → `out/`) একইভাবে কাজ করে। ID বসানোর পর **আবার build করতে হবে**, কারণ ID কোডের ভেতরে ঢুকে যায়। Footer-এর "Cookie settings" থেকে ভিজিটর যেকোনো সময় মত বদলাতে পারেন।

---

Analytics is **off until you give the site a Measurement ID**. Without one there is no banner, no script and no `dataLayer`: the site behaves as if this feature did not exist.

## 1. Create the GA4 property and find the ID

1. Go to <https://analytics.google.com> → **Admin** → **Create** → **Property**. Name it `DotGrey Digital`, pick your time zone (Asia/Dhaka) and currency.
2. Under the property: **Data streams** → **Add stream** → **Web**. URL `https://dotgreydigital.com`, name `Website`. Leave **Enhanced measurement** on.
3. Open the stream. The **Measurement ID** at the top right looks like `G-ABC123XYZ9`. That is the value you need.
4. Recommended settings (Admin → Data collection and modification):
   - **Data retention** → *Event data retention*: **14 months** (this is what the privacy policy says).
   - **Data collection** → **Google signals**: leave **off**. The site already switches ad personalisation off.
   - **Data streams** → your stream → **Configure tag settings** → *Define internal traffic* if you want to exclude your office IP.
5. Mark `generate_lead` as a key event: Admin → **Events** → toggle **Mark as key event** next to `generate_lead` (it appears after the first one is sent).

## 2. Turn it on

The ID is read **at build time** from `NEXT_PUBLIC_GA_ID` and baked into the JavaScript. After setting or changing it, rebuild.

| Where you host | What to do |
| --- | --- |
| **Vercel** | Project → Settings → Environment Variables → add `NEXT_PUBLIC_GA_ID` = `G-…` for Production → redeploy. |
| **cPanel / static** | On your computer: `NEXT_PUBLIC_GA_ID=G-ABC123XYZ9 npm run build:static` (or put the line in `.env.production` first), then upload the contents of `out/` again. No Node server is needed on the host. |
| **Local test** | Add `NEXT_PUBLIC_GA_ID=G-…` to `.env.local` and run `npm run dev`. |

An ID that does not look like `G-` followed by letters/digits is ignored.

## 3. How consent works

- **First visit:** after about a second a small banner asks. **Decline** and **Accept** look identical. Nothing is sent, and Google's script is **not even downloaded**, until the visitor accepts.
- **Consent Mode v2:** before anything else, the page defines `gtag` and sets all four signals (`analytics_storage`, `ad_storage`, `ad_user_data`, `ad_personalization`) to `denied`. Accepting changes only `analytics_storage` to `granted`; the ad signals stay denied. IP anonymisation, Google signals and ad personalisation are off.
- **The choice** is stored in a first-party cookie, `dg-consent` (`granted` or `denied`, one year). The banner does not return unless the visitor clears it.
- **Changing their mind:** the footer's **Cookie settings** button (and the Cookies page) reopen the banner. Choosing **Decline** immediately stops events, sets consent back to denied and deletes `_ga` / `_ga_*` cookies.
- **Browser opt-out signals:** if the browser sends Global Privacy Control or Do Not Track and the visitor has not decided, analytics stays off and the banner is not shown. They can still opt in from Cookie settings.
- **Clear my preferences** on the Cookies page also forgets the answer, so the banner asks again.

## 4. What is measured

Page views (including client-side navigation, once per page) plus these events. None of them carries a name, email, message or any form content.

| Event | When | Parameters |
| --- | --- | --- |
| `page_view` | Each page, after consent | page path, location, title |
| `generate_lead` | A contact, Start-a-project or job-application form is sent (also when it falls back to the visitor's email app) | `form`: `contact`, `start` or `careers` |
| `sign_up` | Newsletter signup | `method`: `newsletter` |
| `wizard_step` | Each step of `/start` reached | `step` (1–6), `name` (Need, Stage, …) |
| `wizard_complete` | The wizard's final send | none |
| `cta_click` | Any link to `/start` ("Start a project", …) | `label`, `location` (`header`, `footer` or `page:/path`) |
| `project_view` | A case study is opened | `slug` |
| `faq_open` | An FAQ question is opened | `index`, `page` |
| `theme_change` | Light/dark switch used | `theme` |

Where to see them: **Reports → Engagement → Events** (and **Pages and screens**). Leads: **Reports → Engagement → Conversions** once `generate_lead` is a key event. Real-time: **Reports → Realtime**.

## 5. Test it

1. Build with an ID and open the site in a private window: the banner appears after a moment; DevTools → Network shows **no** request to `googletagmanager.com`.
2. Click **Accept**: one request to `gtag/js?id=G-…`, then `collect` requests; cookies `dg-consent`, `_ga`, `_ga_<ID>` appear.
3. In GA: **Admin → DebugView**. Install the *Google Analytics Debugger* Chrome extension, reload, and watch events arrive in seconds.
4. Footer → **Cookie settings** → **Decline**: `_ga*` cookies disappear and no more requests are sent.

## 6. Turn it off

Remove `NEXT_PUBLIC_GA_ID` and rebuild/redeploy. The banner, the script and the footer button disappear. (Visitors' old `dg-consent` cookie is harmless.) The privacy and cookie pages describe analytics as "when switched on", and the Cookies page lists the Google cookies only on builds that have an ID.

## Files

`src/site/analytics/` — `config.ts` (reads the ID), `consent.ts` (cookie + state), `track.ts` (events), `Defaults.tsx` (Consent Mode defaults in `<head>`), `Analytics.tsx` (banner, loader, page views, click/FAQ listeners). Styles: `.consent*` in `src/site/site.module.css`.

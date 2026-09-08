# 02 — Section Specifications

Breakpoints: **M** < 768px, **T** 768–1023px, **D** ≥ 1024px.
Motion numbers in brackets refer to the catalogue in [04-motion.md](04-motion.md).

---

## A. Global chrome

### A1. Preloader
Fixed sheet in `--bg`. Counter `000 → 100` in `display-2` Kanit, orange progress line beneath.
On completion the sheet wipes upward with an orange sheet trailing it [1, 2]. Once per
session (`sessionStorage`). Not rendered under reduced motion. Budget 1.4s.

### A2. Scroll progress
A 2px accent bar pinned to the top of the viewport, width tracking scroll [45].

### A3. Header
- **M/T:** logo left, theme toggle + hamburger right, height `64px`.
- **D:** logo left, nav centre, toggle + `GET A QUOTE` right, height `80px`.
- Transparent over the hero; past `80px` it gains `--bg` at 80%, `backdrop-blur(16px)` and a
  bottom hairline [33]. Hides on scroll-down, returns on scroll-up [34].
- Nav hover: label slides up, duplicate slides in, accent underline grows [30].
- Dropdowns open on hover **and focus**, close on `Escape`, arrow keys move between items —
  v1's dropdown was hover-only and keyboard-inaccessible.
- Mobile: full-screen overlay, circular `clip-path` reveal from the button, links stagger [35].

### A4. Custom cursor
Dot plus trailing ring [25]. Changes to a labelled state over works (`VIEW`), carousels
(`DRAG`) and external links (`OPEN`) [26]. Desktop fine-pointer only, off under reduced motion.

### A5. Footer
- **M** stacked · **T** 2 columns · **D** 4 columns: Brand · Services · Company · Connect.
- Above the columns, an oversized `DOTGREY` wordmark clipped by the section edge at 6% opacity.
- Bottom bar: copyright left, Privacy / Terms right.

---

## B. Homepage

### B1. Hero — `sections/Hero.tsx`
Full viewport, `min-height: 640px`.

- **D:** two columns. Left — eyebrow, `display-1` headline **"We create _stunning_ digital
  experiences"** with `stunning` in accent, lead paragraph, `GET STARTED` and `OUR SERVICES`
  buttons. Right — the 3D card stack.
- **M/T:** stacked, card stack below the copy at reduced scale.
- Headline reveals per word out of masks [3], sub and buttons follow [4].
- **Card stack** — v1's Embla carousel rebuilt as a scroll-scrubbed, pinned 3D stack [15]:
  seven service cards in perspective, the active one upright and forward, neighbours rotated
  ±12° and pushed back. Scrolling advances the stack; dragging still works; dots remain.
  Under reduced motion it degrades to a plain static grid of the first three cards.
- Scroll cue bottom-centre.

### B2. Feature rows — `sections/FeatureRows.tsx`
Three alternating rows, carried over from v1: the free email template, the free UI/UX screen,
the free web-dev task.

- Each row: **D** copy on one side, a large glowing icon tile on the other, sides alternating.
  **M** stacked, icon first.
- Eyebrow (`NEW` / `FREE` / `DEV`) in accent, `h1` headline with the payoff in accent, lead,
  three ticked bullets, one button.
- Motion: icon tile scales `1.15 → 1` on scrub, copy slides in from the opposite side [17];
  the orange bloom behind the tile brightens as the row centres [8].

### B3. Marquee band
Full-bleed strip: `UI/UX DESIGN ✦ WEB DEVELOPMENT ✦ EMAIL TEMPLATES ✦ BANNER ADS ✦ VEEVA ✦
MOTION`. Two rows in opposite directions, outlined type on the first [22, 23].

### B4. Works — `sections/Works.tsx`
Eyebrow `SELECTED WORK`, heading **"Our works"**, lead.

- **D:** 2-column grid, the second column offset down by 80px; cards rise with stagger [18].
- Card: `16:10` cover, title, description, tag chips. Hover tilts the card and shifts a glare
  across it [28]; the cover scales inside its mask.
- `SEE ALL WORKS` button → `/works`.

### B5. Services — `sections/Services.tsx`
Eyebrow `360° AWARD WINNING DIGITAL SERVICES`, heading **"We offer services that transform
businesses and help them grow"**, `SEE ALL SERVICES` button.

- **D:** the six cards become a **pinned horizontal scroll** — the section pins and vertical
  scroll drives the row sideways [16]. **T/M:** ordinary 1- or 2-column grid, no pinning.
- Card: icon tile, title, blurb, `LEARN MORE`. One card carries the accent fill, as in v1.
- Hover: border to accent, icon rotates 45°, tint washes in [32].

### B6. Innovative design — `sections/InnovativeDesign.tsx`
Statement band. Heading **"Innovative design is our tool to reshape business"** with the
supporting paragraphs on the right. The heading animates word-by-word from subtle to full
colour as it scrolls [13]. Below, a four-up stats strip with counters [20].

### B7. Testimonials — `sections/Testimonials.tsx`
Eyebrow `TESTIMONIALS`, heading **"What our clients say"**.
Embla carousel, drag enabled, 6s autoplay paused on hover, focus and reduced motion [40].
**D** shows 2 cards with a peek, **T** 1.5, **M** 1. Card: quote in `body-lg`, author,
role, location, avatar. Prev/next circular buttons plus a progress bar.

### B8. FAQ — `sections/Faq.tsx`
**D:** sticky left column (heading + `BOOK A CALL` card), accordion on the right [38].
**M/T:** stacked. First item open. Single-open behaviour, proper `aria-expanded`.

### B9. Project form — `sections/ProjectForm.tsx`
Full-bleed accent-tinted band. **D:** heading and contact details left, form right.
Fields: name*, email*, company, service*, budget*, timeline, message*.
v1 had no submit handling at all; v2 wires a Server Action with zod validation, inline field
errors, a pending state and a success message [41, 42].

---

## C. Inner pages

### C1. PageHero
Shared by every inner page. `--bg-elev` band, `160px` top padding, breadcrumb, `h1` split
reveal [5], optional lead and meta row.

### C2. `/about`
PageHero → Mission (2-col: statement + prose) → Stats strip (counters) → Values (6 cards) →
Approach (4 numbered steps on a connecting line that draws as it scrolls) → Team strip
(`limit={4}`) → Marquee → FAQ → ProjectForm.

### C3. `/services`
PageHero → Services list (6 detailed rows, accent fill on hover) → Expertise (industry chips
and a capability matrix) → Why partner (4 reasons + counters) → Pricing preview → ProjectForm.

### C4. `/services/[slug]`
PageHero (service name, lead) → Overview (2-col prose + sticky "What's included") →
Features (6-card grid, icons from lucide) → Benefits (alternating rows) → Industry expertise →
Related services (3) → ProjectForm.

### C5. `/works`
PageHero → Filter bar (`All · UI/UX · Web · Email · Branding`) with a sliding active pill [39],
state reflected in `?category=` → Grid, offset columns, stagger [18] → ProjectForm.

### C6. `/works/[slug]`
PageHero with client / year / services meta → full-bleed cover with parallax [19] →
Challenge / Solution 2-col → Results (3 counters) → Gallery (2-up + full-bleed mix, lightbox
[43]) → Client quote → Next project (full-bleed link, cover as background).

### C7. `/team`, `/team/[slug]`
`/team`: PageHero → grid of 6 → open-roles band → ProjectForm.
`/team/[slug]`: PageHero → portrait + bio → skill bars [21] → other members → ProjectForm.

### C8. `/pricing`
PageHero → Package cards (3, monthly/project toggle, middle highlighted) → Comparison table
(sticky header row, horizontal scroll inside its own container on M) → Pricing FAQ → ProjectForm.

### C9. `/faq`
PageHero → category tabs → accordion per category → "still have questions" card → ProjectForm.

### C10. `/careers`, `/careers/[slug]`
`/careers`: PageHero → why work here → benefits (4 cards) → culture strip → open roles rows →
ProjectForm.
`/careers/[slug]`: PageHero with chips → responsibilities / requirements / nice-to-have +
sticky benefits card → application form.

### C11. `/contact`
PageHero → offices, email, phone, socials + the project form → map placeholder band (styled
grid, not an embed) → FAQ (`limit={4}`).

### C12. `/privacy`, `/terms`
PageHero → prose blocks (`max-width: 72ch`) with a visible "needs legal review" banner.

### C13. `/docs`, `/docs/[slug]`
Index of cards for each markdown doc; reader with a sticky sidebar, in-page contents and
prev/next. `noindex`, and excluded from the sitemap.

### C14. `not-found`
Centred `404` in `display-1` over an accent bloom, heading, line, and two CTAs.

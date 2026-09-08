/**
 * Generates placeholder art as SVG — warm, brand-matched gradients rather than stock
 * photography, so nothing depends on an external host and everything sits inside the
 * design. Re-runnable: `node scripts/generate-placeholders.mjs`.
 * Replace the output in public/img with real work when it arrives.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const OUT = join(process.cwd(), "public", "img");
const ACCENT = "#ff5a3c";

/** Deterministic hash so a given slug always gets the same look. */
const hash = (s) => [...s].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 11);

function grain() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180">
  <filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter>
  <rect width="180" height="180" filter="url(#n)" opacity="0.5"/>
</svg>`;
}

/** Warm dark plate with drifting light, echoing the site's ambient gradient. */
function plate({ w, h, seed, label = "", initials = "", accent = false }) {
  const n = hash(seed);
  // Stay in the warm half of the wheel so plates always read as part of the brand.
  const hue = (n % 60) + 330;
  const x1 = 15 + (n % 40);
  const y1 = 10 + ((n >> 3) % 35);
  const x2 = 50 + ((n >> 6) % 40);
  const y2 = 55 + ((n >> 9) % 35);
  const rot = -30 + (n % 60);
  const id = seed.replace(/[^a-z0-9]/gi, "");

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-label="${label || seed}">
  <defs>
    <linearGradient id="b${id}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="hsl(${hue % 360} 16% 12%)"/>
      <stop offset="55%" stop-color="hsl(${(hue + 20) % 360} 14% 8%)"/>
      <stop offset="100%" stop-color="hsl(${(hue + 45) % 360} 18% 6%)"/>
    </linearGradient>
    <radialGradient id="g1${id}" cx="${x1}%" cy="${y1}%" r="58%">
      <stop offset="0%" stop-color="${accent ? ACCENT : `hsl(${(hue + 10) % 360} 70% 55%)`}" stop-opacity="0.34"/>
      <stop offset="100%" stop-color="${accent ? ACCENT : `hsl(${(hue + 10) % 360} 70% 55%)`}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="g2${id}" cx="${x2}%" cy="${y2}%" r="48%">
      <stop offset="0%" stop-color="hsl(${(hue + 300) % 360} 55% 45%)" stop-opacity="0.24"/>
      <stop offset="100%" stop-color="hsl(${(hue + 300) % 360} 55% 45%)" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="l${id}" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#fff" stop-opacity="0"/>
      <stop offset="50%" stop-color="#fff" stop-opacity="0.13"/>
      <stop offset="100%" stop-color="#fff" stop-opacity="0"/>
    </linearGradient>
    <filter id="bl${id}"><feGaussianBlur stdDeviation="${Math.round(w / 26)}"/></filter>
    <filter id="gr${id}"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter>
  </defs>

  <rect width="${w}" height="${h}" fill="url(#b${id})"/>
  <rect width="${w}" height="${h}" fill="url(#g1${id})"/>
  <rect width="${w}" height="${h}" fill="url(#g2${id})"/>

  <g filter="url(#bl${id})" opacity="0.85">
    <rect x="${-w * 0.2}" y="${h * 0.22}" width="${w * 1.4}" height="${h * 0.09}" fill="url(#l${id})" transform="rotate(${rot} ${w / 2} ${h / 2})"/>
    <rect x="${-w * 0.2}" y="${h * 0.66}" width="${w * 1.4}" height="${h * 0.05}" fill="url(#l${id})" transform="rotate(${rot} ${w / 2} ${h / 2})"/>
  </g>

  ${
    initials
      ? `<text x="50%" y="50%" text-anchor="middle" dominant-baseline="central" font-family="Kanit, system-ui, sans-serif" font-weight="700" font-size="${Math.round(
          Math.min(w, h) * 0.32,
        )}" fill="#ffffff" fill-opacity="0.08" letter-spacing="-0.03em">${initials}</text>`
      : ""
  }

  <rect width="${w}" height="${h}" filter="url(#gr${id})" opacity="0.05" style="mix-blend-mode:overlay"/>
  <rect width="${w}" height="${h}" fill="none" stroke="#ffffff" stroke-opacity="0.07"/>
</svg>`;
}

function portrait({ w, h, seed, name }) {
  const n = hash(seed);
  const hue = (n % 50) + 330;
  const id = seed.replace(/[^a-z0-9]/gi, "");
  const initials = name.split(" ").map((p) => p[0]).join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-label="${name}">
  <defs>
    <linearGradient id="p${id}" x1="0" y1="0" x2="0.6" y2="1">
      <stop offset="0%" stop-color="hsl(${hue % 360} 14% 17%)"/>
      <stop offset="100%" stop-color="hsl(${(hue + 30) % 360} 16% 8%)"/>
    </linearGradient>
    <radialGradient id="pg${id}" cx="50%" cy="32%" r="46%">
      <stop offset="0%" stop-color="${ACCENT}" stop-opacity="0.16"/>
      <stop offset="100%" stop-color="${ACCENT}" stop-opacity="0"/>
    </radialGradient>
    <filter id="pn${id}"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter>
  </defs>

  <rect width="${w}" height="${h}" fill="url(#p${id})"/>
  <rect width="${w}" height="${h}" fill="url(#pg${id})"/>

  <!-- Neutral silhouette: shoulders and head, no facial features. -->
  <g fill="#ffffff" fill-opacity="0.09">
    <circle cx="${w / 2}" cy="${h * 0.36}" r="${w * 0.155}"/>
    <path d="M ${w * 0.16} ${h} C ${w * 0.16} ${h * 0.66}, ${w * 0.34} ${h * 0.58}, ${w / 2} ${h * 0.58} C ${w * 0.66} ${h * 0.58}, ${w * 0.84} ${h * 0.66}, ${w * 0.84} ${h} Z"/>
  </g>

  <text x="50%" y="${h * 0.36}" text-anchor="middle" dominant-baseline="central" font-family="Kanit, system-ui, sans-serif" font-weight="700" font-size="${Math.round(
    w * 0.13,
  )}" fill="#ffffff" fill-opacity="0.5">${initials}</text>

  <rect width="${w}" height="${h}" filter="url(#pn${id})" opacity="0.05" style="mix-blend-mode:overlay"/>
</svg>`;
}

const works = [
  ["workday", "Workday", "WD"],
  ["hakkas-dine", "Hakka's Dine", "HD"],
  ["medicove-intl", "Medicove Intl", "MI"],
  ["fintech-pro", "Fintech Pro", "FP"],
  ["northline-logistics", "Northline Logistics", "NL"],
  ["aurora-health", "Aurora Health", "AH"],
];

const services = [
  "ui-ux-design",
  "web-development",
  "email-templates",
  "banner-ads",
  "veeva-services",
  "motion-video",
];

const team = [
  ["arif-hasan", "Arif Hasan"],
  ["nusrat-jahan", "Nusrat Jahan"],
  ["tanvir-ahmed", "Tanvir Ahmed"],
  ["mahdi-rahman", "Mahdi Rahman"],
  ["sadia-islam", "Sadia Islam"],
  ["rifat-khan", "Rifat Khan"],
];

mkdirSync(join(OUT, "works"), { recursive: true });
mkdirSync(join(OUT, "team"), { recursive: true });
mkdirSync(join(OUT, "services"), { recursive: true });

writeFileSync(join(OUT, "grain.svg"), grain());
writeFileSync(join(OUT, "page-backdrop.svg"), plate({ w: 1920, h: 600, seed: "dg-page", accent: true }));
writeFileSync(join(OUT, "about-story.svg"), plate({ w: 1200, h: 1400, seed: "dg-story", label: "Studio" }));
writeFileSync(join(OUT, "culture.svg"), plate({ w: 1600, h: 1100, seed: "dg-culture", label: "Studio" }));

for (const [slug, title, initials] of works) {
  writeFileSync(join(OUT, "works", `${slug}.svg`), plate({ w: 1600, h: 1000, seed: slug, label: title, initials }));
  for (let i = 1; i <= 3; i++) {
    writeFileSync(
      join(OUT, "works", `${slug}-${i}.svg`),
      plate({ w: 1600, h: 1000, seed: `${slug}-${i}`, label: `${title} — image ${i}` }),
    );
  }
}

for (const slug of services) {
  writeFileSync(join(OUT, "services", `${slug}.svg`), plate({ w: 1200, h: 1200, seed: `svc-${slug}`, accent: true }));
}

for (const [slug, name] of team) {
  writeFileSync(join(OUT, "team", `${slug}.svg`), portrait({ w: 800, h: 1000, seed: slug, name }));
}

console.log(`Generated ${works.length * 4 + services.length + team.length + 4} placeholder assets in public/img`);

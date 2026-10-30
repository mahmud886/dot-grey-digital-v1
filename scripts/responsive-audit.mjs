/**
 * Responsive audit: opens every route at many viewport widths (light and dark) and reports
 * layout problems. Exits non-zero when anything is found, so it can gate a release.
 *
 *   npm run build && npx next start -p 3230 &
 *   node scripts/responsive-audit.mjs                       # full sweep
 *   node scripts/responsive-audit.mjs --quick               # fewer widths, light only
 *   node scripts/responsive-audit.mjs --base http://localhost:3000 --routes /,/work --widths 320,390
 *   node scripts/responsive-audit.mjs --out audit.json      # also write the findings as JSON
 *   node scripts/responsive-audit.mjs --themes dark --widths 320,390   # shard a long run across processes
 *
 * Needs `playwright` (resolved from the repo, then from NODE_PATH / a global install) and a
 * Chrome/Chromium it can launch. Checks, per route and viewport:
 *   overflow     page or an element is wider than the viewport
 *   tiny-text    visible text under 11px
 *   tap-target   touch viewports only: interactive element under 40x40 CSS px
 *   collision    two visible text blocks (headings, labels, buttons) overlap each other
 *   fixed-cover  a fixed/sticky bar covers more than a third of the viewport height
 *   input-zoom   touch viewports only: form control with font-size under 16px (iOS zooms in)
 *   console      console errors or uncaught page errors
 */
import { createRequire } from "node:module";
import { writeFileSync } from "node:fs";

const require = createRequire(import.meta.url);
let playwright;
for (const id of ["playwright", "@playwright/test", "playwright-core", "/opt/node22/lib/node_modules/playwright"]) {
  try {
    playwright = require(id);
    break;
  } catch {}
}
if (!playwright) {
  console.error("playwright not found. Install it (npm i -D playwright) or set NODE_PATH.");
  process.exit(2);
}
const { chromium } = playwright;

const args = process.argv.slice(2);
const opt = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i > -1 ? args[i + 1] : fallback;
};
const flag = (name) => args.includes(`--${name}`);

const BASE = opt("base", "http://localhost:3230").replace(/\/$/, "");
const QUICK = flag("quick");
const WIDTHS = (opt("widths") ?? (QUICK ? "320,390,768,1280" : "320,360,375,390,414,430,540,600,768,820,900,1024,1180,1280,1366,1440,1536,1920,2560"))
  .split(",")
  .map(Number);
const THEMES = (opt("themes") ?? (QUICK ? "light" : "light,dark")).split(",");
const LANDSCAPE = opt("landscape") === "none" || QUICK ? [] : [[844, 390], [667, 375], [1024, 768], [1180, 820]];

async function routes() {
  const given = opt("routes");
  if (given) return given.split(",");
  const xml = await (await fetch(`${BASE}/sitemap.xml`)).text();
  const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname);
  return [...new Set(["/", ...urls, "/does-not-exist"])];
}

/** Runs in the page. Returns a list of {kind, detail}. */
function inPage({ touch }) {
  const out = [];
  const vw = document.documentElement.clientWidth;
  const vh = innerHeight;
  const label = (el) => {
    const t = (el.getAttribute("aria-label") || el.textContent || "").trim().replace(/\s+/g, " ").slice(0, 40);
    return `${el.tagName.toLowerCase()}${el.className && typeof el.className === "string" ? "." + el.className.split(" ")[0] : ""} "${t}"`;
  };
  const collapsed = (el) => {
    // closed <details> bodies and 0fr / height:0 accordion panels still have a laid-out box
    if (el.closest("details:not([open])") && !el.closest("summary")) return true;
    for (let p = el; p && p !== document.body; p = p.parentElement) {
      const cs = getComputedStyle(p);
      if (cs.overflowY !== "visible" && p.getBoundingClientRect().height < 2) return true;
      if (p.getAttribute("aria-hidden") === "true" && p.hasAttribute("inert")) return true;
    }
    return false;
  };
  const visible = (el) => {
    const cs = getComputedStyle(el);
    if (cs.display === "none" || cs.visibility === "hidden" || +cs.opacity === 0) return false;
    const r = el.getBoundingClientRect();
    return r.width > 0 && r.height > 0 && !collapsed(el);
  };
  const inClipped = (el) => {
    // inside a horizontally scrolling or clipping ancestor (tables, reels, canvases)
    for (let p = el.parentElement; p && p !== document.body; p = p.parentElement) {
      const cs = getComputedStyle(p);
      if (/(auto|scroll|hidden|clip)/.test(cs.overflowX)) {
        const r = p.getBoundingClientRect();
        if (r.right <= vw + 1 && r.left >= -1) return true;
      }
    }
    return false;
  };

  if (document.documentElement.scrollWidth > vw + 1) {
    out.push({ kind: "overflow", detail: `page scrollWidth ${document.documentElement.scrollWidth} > ${vw}` });
  }
  // elements poking past the right edge (that are not clipped by a scroll container)
  const wide = [];
  for (const el of document.body.querySelectorAll("*")) {
    if (!visible(el) || inClipped(el)) continue;
    const cs = getComputedStyle(el);
    if (cs.position === "fixed") continue;
    const r = el.getBoundingClientRect();
    if (r.right > vw + 2 && r.width < vw * 3) wide.push(`${label(el)} right=${Math.round(r.right)}`);
  }
  for (const w of wide.slice(0, 4)) out.push({ kind: "overflow", detail: w });

  // tiny text
  const seen = new Set();
  for (const el of document.body.querySelectorAll("p,li,a,span,button,label,td,th,h1,h2,h3,h4,small,div")) {
    if (!visible(el)) continue;
    const own = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim().length > 1);
    if (!own) continue;
    const fs = parseFloat(getComputedStyle(el).fontSize);
    if (fs < 11 && !seen.has(fs + el.className)) {
      seen.add(fs + el.className);
      out.push({ kind: "tiny-text", detail: `${label(el)} ${fs}px` });
    }
  }

  // tap targets and input zoom
  if (touch) {
    for (const el of document.querySelectorAll("a[href],button,input:not([type=hidden]),select,textarea,summary,[role=button],[role=tab],[role=radio]")) {
      if (!visible(el)) continue;
      const r = el.getBoundingClientRect();
      if (r.bottom < 0 || r.top > document.documentElement.scrollHeight) continue;
      const cs = getComputedStyle(el);
      // inline text links inside running copy are exempt (WCAG 2.5.8 inline exception)
      const inline = el.tagName === "A" && cs.display === "inline";
      // an invisible ::before/::after that extends past the box counts as hit area
      let hit = { w: r.width, h: r.height };
      for (const pseudo of ["::after", "::before"]) {
        const ps = getComputedStyle(el, pseudo);
        if (ps.content !== "none" && ps.position === "absolute") {
          const side = (k) => Math.max(0, -parseFloat(ps[k]) || 0);
          hit = { w: Math.max(hit.w, r.width + side("left") + side("right")), h: Math.max(hit.h, r.height + side("top") + side("bottom")) };
        }
      }
      if (!inline && (hit.w < 40 || hit.h < 40) && !/skip/i.test(el.textContent || "")) {
        // a sibling hit area (label wrapping, parent button) may enlarge it
        const par = el.closest("label,button,a");
        const pr = par && par !== el ? par.getBoundingClientRect() : r;
        if (pr.width < 40 || pr.height < 40) out.push({ kind: "tap-target", detail: `${label(el)} ${Math.round(r.width)}x${Math.round(r.height)}` });
      }
      if (/^(INPUT|SELECT|TEXTAREA)$/.test(el.tagName) && parseFloat(cs.fontSize) < 16 && !/checkbox|radio|submit|button/.test(el.type || "")) {
        out.push({ kind: "input-zoom", detail: `${label(el)} font-size ${cs.fontSize}` });
      }
    }
  }

  // overlapping text blocks
  const blocks = [];
  for (const el of document.body.querySelectorAll("h1,h2,h3,h4,button,a[href],label,p,li,small")) {
    if (!visible(el) || el.closest("[aria-hidden=true],canvas,svg")) continue;
    if (!(el.textContent || "").trim()) continue;
    // only leaf-ish blocks: skip containers that wrap other blocks of the same set
    if (el.querySelector("h1,h2,h3,h4,button,a[href],p,li")) continue;
    const cs = getComputedStyle(el);
    if (cs.position === "fixed" || cs.position === "sticky") continue;
    const r = el.getBoundingClientRect();
    if (r.width < 4 || r.height < 4) continue;
    blocks.push({ el, r: { l: r.left, t: r.top + scrollY, rr: r.right, b: r.bottom + scrollY } });
  }
  let n = 0;
  for (let i = 0; i < blocks.length && n < 4; i++) {
    for (let j = i + 1; j < blocks.length && n < 4; j++) {
      const a = blocks[i];
      const b = blocks[j];
      if (a.el.contains(b.el) || b.el.contains(a.el)) continue;
      const ox = Math.min(a.r.rr, b.r.rr) - Math.max(a.r.l, b.r.l);
      const oy = Math.min(a.r.b, b.r.b) - Math.max(a.r.t, b.r.t);
      if (ox > 6 && oy > 6) {
        const area = ox * oy;
        const small = Math.min((a.r.rr - a.r.l) * (a.r.b - a.r.t), (b.r.rr - b.r.l) * (b.r.b - b.r.t));
        if (area > small * 0.25) {
          // intentional overlays: stacked deck cards and tilted frames
          if (a.el.closest("[data-deck],[class*=deck],[class*=tilt],[class*=stack]") && b.el.closest("[data-deck],[class*=deck],[class*=tilt],[class*=stack]")) continue;
          out.push({ kind: "collision", detail: `${label(a.el)} overlaps ${label(b.el)} (${Math.round(ox)}x${Math.round(oy)})` });
          n++;
        }
      }
    }
  }

  // fixed/sticky bars covering too much
  for (const el of document.body.querySelectorAll("*")) {
    const cs = getComputedStyle(el);
    if ((cs.position !== "fixed" && cs.position !== "sticky") || !visible(el)) continue;
    const r = el.getBoundingClientRect();
    if (r.width >= vw * 0.6 && r.height > vh / 3 && r.top <= 1 && !el.matches("[class*=sheet]")) {
      out.push({ kind: "fixed-cover", detail: `${label(el)} is ${Math.round(r.height)}px tall of ${vh}` });
    }
  }
  return out;
}

const routeList = await routes();
const browser = await chromium.launch({ channel: process.env.PW_CHANNEL || "chrome", args: ["--no-sandbox"] }).catch(() => chromium.launch({ args: ["--no-sandbox"] }));

const viewports = [
  ...WIDTHS.map((w) => ({ w, h: w < 600 ? 800 : w < 1100 ? 1000 : 900, touch: w < 900, name: `${w}` })),
  ...LANDSCAPE.map(([w, h]) => ({ w, h, touch: true, name: `${w}x${h}` })),
];

const findings = [];
let checks = 0;
for (const theme of THEMES) {
  for (const vp of viewports) {
    const ctx = await browser.newContext({
      viewport: { width: vp.w, height: vp.h },
      hasTouch: vp.touch,
      isMobile: vp.touch && vp.w < 900,
      deviceScaleFactor: vp.touch ? 2 : 1,
      reducedMotion: "reduce",
    });
    await ctx.addCookies([{ name: "dg-theme", value: theme, url: BASE }, { name: "dg-consent", value: "denied", url: BASE }]);
    for (const route of routeList) {
      const page = await ctx.newPage();
      const errs = [];
      page.on("pageerror", (e) => errs.push(`pageerror: ${e.message}`));
      page.on("console", (m) => {
        if (m.type() === "error" && !/404 \(Not Found\)|Failed to load resource/.test(m.text())) errs.push(`console: ${m.text().slice(0, 120)}`);
      });
      try {
        await page.goto(BASE + route, { waitUntil: "load", timeout: 30000 });
        await page.waitForTimeout(200);
        // reveal lazy / scroll-linked content so layout is final
        await page.evaluate(async () => {
          const h = document.documentElement.scrollHeight;
          for (let y = 0; y < h; y += innerHeight * 0.9) {
            scrollTo(0, y);
            await new Promise((r) => setTimeout(r, 12));
          }
          scrollTo(0, 0);
        });
        await page.waitForTimeout(200);
        const found = await page.evaluate(inPage, { touch: vp.touch });
        for (const e of errs) found.push({ kind: "console", detail: e });
        for (const f of found) findings.push({ route, viewport: vp.name, theme, ...f });
        checks++;
      } catch (e) {
        findings.push({ route, viewport: vp.name, theme, kind: "load", detail: String(e).slice(0, 140) });
      }
      await page.close();
    }
    await ctx.close();
  }
}
await browser.close();

const byKind = {};
for (const f of findings) byKind[f.kind] = (byKind[f.kind] ?? 0) + 1;
const unique = new Map();
for (const f of findings) {
  const k = `${f.kind}|${f.route}|${f.detail}`;
  const u = unique.get(k) ?? { ...f, viewports: new Set() };
  u.viewports.add(`${f.viewport}${f.theme === "dark" ? "d" : ""}`);
  unique.set(k, u);
}
for (const u of unique.values()) {
  console.log(`[${u.kind}] ${u.route}  ${u.detail}  @ ${[...u.viewports].slice(0, 8).join(", ")}${u.viewports.size > 8 ? ` +${u.viewports.size - 8}` : ""}`);
}
console.log(`\n${checks} page checks, ${findings.length} findings (${unique.size} unique)`, byKind);
if (opt("out")) writeFileSync(opt("out"), JSON.stringify({ byKind, findings: [...unique.values()].map((u) => ({ ...u, viewports: [...u.viewports] })) }, null, 2));
process.exit(findings.length ? 1 : 0);

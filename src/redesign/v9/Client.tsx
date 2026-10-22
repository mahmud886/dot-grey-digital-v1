"use client";

import Link from "next/link";
import { useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { ProjectArt } from "@/redesign/shared/ProjectArt";
import { ThemeToggle } from "@/redesign/shared/ThemeToggle";
import type { Discipline, Post, Work } from "@/redesign/content";
import { artFor } from "./art";
import { G } from "./Glyphs";
import s from "./v9.module.css";

/* ------------------------------------------------------------------------------------------
 * Scramble: the real text is server-rendered (readable and indexable); on the client the
 * characters are briefly swapped for glyphs and resolve left to right. Visual only.
 * ---------------------------------------------------------------------------------------- */

const POOL = "◇✳●/+*—#%&01";

function scramble(el: HTMLElement, text: string, duration: number) {
  const start = performance.now();
  let raf = 0;
  const tick = (t: number) => {
    const p = Math.min(1, (t - start) / duration);
    const fixed = Math.floor(p * text.length);
    let out = text.slice(0, fixed);
    for (let i = fixed; i < text.length; i++) {
      out += text[i] === " " ? " " : POOL[(Math.random() * POOL.length) | 0];
    }
    el.textContent = out;
    if (p < 1) raf = requestAnimationFrame(tick);
    else el.textContent = text;
  };
  raf = requestAnimationFrame(tick);
  return () => {
    cancelAnimationFrame(raf);
    el.textContent = text;
  };
}

/** Time the intro so hero text starts decoding as the preloader lifts on a full load. */
const INTRO_MS = 1050;

export function Scramble({ text, delay = 0, duration = 700, className }: { text: string; delay?: number; duration?: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();
  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;
    // On a full page load wait for the preloader; after client navigation start at once.
    const wait = Math.max(0, INTRO_MS - performance.now()) + delay;
    let stop = () => {};
    const id = window.setTimeout(() => (stop = scramble(el, text, duration)), wait);
    return () => {
      clearTimeout(id);
      stop();
    };
  }, [text, delay, duration, reduced]);
  return (
    <span ref={ref} className={className}>
      {text}
    </span>
  );
}

/**
 * Full-screen intro on a full load of the homepage: a turning asterisk and two decoding
 * lines. Arriving by client navigation, it is removed before paint.
 */
export function Preloader() {
  const wrap = useRef<HTMLDivElement>(null);
  const a = useRef<HTMLSpanElement>(null);
  const b = useRef<HTMLSpanElement>(null);
  useLayoutEffect(() => {
    if (wrap.current && performance.now() > INTRO_MS) wrap.current.style.display = "none";
  }, []);
  useEffect(() => {
    if (!a.current || !b.current || performance.now() > INTRO_MS) return;
    const stopA = scramble(a.current, "Digital-first studio", 650);
    const stopB = scramble(b.current, "Dhaka ◇ Remote", 800);
    return () => {
      stopA();
      stopB();
    };
  }, []);
  return (
    <div ref={wrap} className={s.loader} aria-hidden="true">
      <G name="asterisk" className={s.loaderMark} />
      <span className={s.loaderLines}>
        <span ref={a}>Digital-first studio</span>
        <span ref={b}>Dhaka ◇ Remote</span>
      </span>
    </div>
  );
}

/* ------------------------------------------------------------------------------------------
 * Pixel mosaic: an SVG is rasterised once, then redrawn at 8, 16, 32 … blocks across with
 * smoothing off, so it resolves from coarse squares to full resolution in ~400 ms.
 * ---------------------------------------------------------------------------------------- */

const imageCache = new WeakMap<SVGSVGElement, Promise<HTMLImageElement>>();

function rasterise(svg: SVGSVGElement) {
  const hit = imageCache.get(svg);
  if (hit) return hit;
  const clone = svg.cloneNode(true) as SVGSVGElement;
  const [, , w, h] = (svg.getAttribute("viewBox") ?? "0 0 1600 1000").split(" ").map(Number);
  clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  clone.setAttribute("width", String(w));
  clone.setAttribute("height", String(h));
  clone.removeAttribute("style");
  const bg = svg.style.background;
  if (bg) clone.insertAdjacentHTML("afterbegin", `<rect width="${w}" height="${h}" fill="${bg}"/>`);
  const url = URL.createObjectURL(new Blob([new XMLSerializer().serializeToString(clone)], { type: "image/svg+xml" }));
  const p = new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
  imageCache.set(svg, p);
  return p;
}

const STEPS = [6, 12, 24, 48, 96, 0];

/** Plays the mosaic into `canvas`; returns a cancel function. `0` = full resolution. */
function mosaic(canvas: HTMLCanvasElement, img: HTMLImageElement, onDone?: () => void) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return () => {};
  const tmp = document.createElement("canvas");
  const tctx = tmp.getContext("2d");
  const cw = canvas.width;
  const ch = canvas.height;
  // Cover-fit the image into the canvas.
  const k = Math.max(cw / img.width, ch / img.height);
  const dw = img.width * k;
  const dh = img.height * k;
  const dx = (cw - dw) / 2;
  const dy = (ch - dh) / 2;
  let i = 0;
  let id = 0;
  const step = () => {
    const blocks = STEPS[i];
    ctx.imageSmoothingEnabled = blocks === 0;
    ctx.clearRect(0, 0, cw, ch);
    if (blocks === 0 || !tctx) {
      ctx.drawImage(img, dx, dy, dw, dh);
    } else {
      tmp.width = blocks;
      tmp.height = Math.max(1, Math.round((blocks * ch) / cw));
      tctx.imageSmoothingEnabled = true;
      tctx.drawImage(img, (dx / cw) * tmp.width, (dy / ch) * tmp.height, (dw / cw) * tmp.width, (dh / ch) * tmp.height);
      ctx.drawImage(tmp, 0, 0, tmp.width, tmp.height, 0, 0, cw, ch);
    }
    i += 1;
    if (i < STEPS.length) id = window.setTimeout(step, 70);
    else onDone?.();
  };
  step();
  return () => clearTimeout(id);
}

function sizeCanvas(canvas: HTMLCanvasElement) {
  const r = canvas.getBoundingClientRect();
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  canvas.width = Math.max(1, Math.round(r.width * dpr));
  canvas.height = Math.max(1, Math.round(r.height * dpr));
}

/**
 * Wraps a server-rendered <ProjectArt>. The art stays hidden until it scrolls into view,
 * then resolves through the mosaic. Without JS (see the <noscript> rule) or with reduced
 * motion it is simply shown.
 */
export function PixelReveal({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();
  useEffect(() => {
    const el = ref.current;
    const canvas = canvasRef.current;
    const svg = el?.querySelector("svg:not([data-glyph])") as SVGSVGElement | null;
    if (!el || !canvas || !svg) return;
    if (reduced) {
      el.dataset.state = "done";
      return;
    }
    let cancel = () => {};
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        el.dataset.state = "running";
        sizeCanvas(canvas);
        rasterise(svg)
          .then((img) => {
            cancel = mosaic(canvas, img, () => (el.dataset.state = "done"));
          })
          .catch(() => (el.dataset.state = "done"));
      },
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancel();
    };
  }, [reduced]);
  return (
    <div ref={ref} className={`${s.pix} ${className ?? ""}`} data-pix="">
      {children}
      <canvas ref={canvasRef} className={s.pixCanvas} aria-hidden="true" />
    </div>
  );
}

/* ------------------------------------------------------------------------------------------
 * Work index: giant type rows. Desktop: a preview follows the cursor and resolves through
 * the mosaic for each row. Touch: every row carries its own thumbnail instead.
 * ---------------------------------------------------------------------------------------- */

export function WorkIndex({ works, initial = 6, source }: { works: Work[]; initial?: number; source?: Work[] }) {
  const artList = source ?? works;
  const [all, setAll] = useState(false);
  const listRef = useRef<HTMLOListElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();
  const shown = all ? works : works.slice(0, initial);

  useEffect(() => {
    const list = listRef.current;
    const preview = previewRef.current;
    const canvas = canvasRef.current;
    if (!list || !preview || !canvas) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    let x = 0;
    let y = 0;
    let px = 0;
    let py = 0;
    let raf = 0;
    let current = -1;
    let cancel = () => {};
    sizeCanvas(canvas);

    const loop = () => {
      // Ease towards the pointer so the card trails a little behind it.
      px += (x - px) * (reduced ? 1 : 0.18);
      py += (y - py) * (reduced ? 1 : 0.18);
      // Sit beside the cursor rather than on top of the title; flip sides past the middle.
      const side = px > window.innerWidth * 0.55 ? "calc(-100% - 28px)" : "28px";
      preview.style.transform = `translate3d(${px}px, ${py}px, 0) translate(${side}, -50%)`;
      raf = requestAnimationFrame(loop);
    };

    const show = (row: HTMLElement) => {
      const i = Number(row.dataset.i);
      if (i === current) return;
      current = i;
      const svg = row.querySelector("svg:not([data-glyph])") as SVGSVGElement | null;
      if (!svg) return;
      cancel();
      rasterise(svg).then((img) => {
        if (current !== i) return;
        if (reduced) {
          const ctx = canvas.getContext("2d");
          ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
        } else cancel = mosaic(canvas, img);
      });
    };

    const onMove = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      const row = (e.target as HTMLElement).closest<HTMLElement>("[data-i]");
      if (row) {
        if (!preview.dataset.on) {
          px = x;
          py = y;
        }
        preview.dataset.on = "1";
        show(row);
      } else {
        delete preview.dataset.on;
        current = -1;
      }
    };
    const onLeave = () => {
      delete preview.dataset.on;
      current = -1;
    };

    raf = requestAnimationFrame(loop);
    list.addEventListener("pointermove", onMove);
    list.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      cancel();
      list.removeEventListener("pointermove", onMove);
      list.removeEventListener("pointerleave", onLeave);
    };
  }, [reduced]);

  return (
    <div className={s.work}>
      <ol ref={listRef} className={s.rows}>
        {shown.map((w, i) => (
          <li key={w.slug}>
            <Link href={`/v9/work/${w.slug}`} className={s.row} data-i={i}>
              <span className={s.rowMeta}>
                <span>{String(i + 1).padStart(2, "0")}</span>
                <span>{w.category}</span>
              </span>
              <span className={s.rowTitle}>{w.title}</span>
              <span className={`${s.rowMeta} ${s.rowMetaEnd}`}>
                <span>{w.stats[0].value}</span>
                <span>{w.year}</span>
              </span>
              <span className={s.rowThumb}>
                <ProjectArt slug={w.slug} label={w.client} variant={artFor(artList.indexOf(w))} ink="#f7f7f5" paper="#0b0b0b" ratio={4 / 3} />
              </span>
            </Link>
          </li>
        ))}
        {works.length > initial && (
        <li>
          <button type="button" className={`${s.row} ${s.rowAll}`} aria-expanded={all} onClick={() => setAll((v) => !v)}>
            <span className={s.rowMeta}>
              <span>{all ? "Less" : "More"}</span>
            </span>
            <span className={s.rowTitle}>
              {all ? (
                <>
                  Fewer ({initial}) <G name="arrow" className={s.flipArrow} />
                </>
              ) : (
                <>
                  All work ({works.length}) <G name="arrow" />
                </>
              )}
            </span>
            <span className={`${s.rowMeta} ${s.rowMetaEnd}`}>
              <span>2023—2025</span>
            </span>
          </button>
        </li>
        )}
      </ol>
      <div ref={previewRef} className={s.preview} aria-hidden="true">
        <canvas ref={canvasRef} />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------------------------------
 * Services: an index. Desktop shows the active discipline in a sticky panel on the right;
 * on mobile the same buttons work as an accordion.
 * ---------------------------------------------------------------------------------------- */

export function ServicesIndex({ items }: { items: Discipline[] }) {
  const [active, setActive] = useState(0);
  const a = items[active];
  return (
    <div className={s.services}>
      <ol className={s.svcList}>
        {items.map((d, i) => (
          <li key={d.id} className={s.svcItem} data-active={i === active || undefined}>
            <button
              type="button"
              className={s.svcBtn}
              aria-expanded={i === active}
              aria-controls={`v9-svc-${d.id}`}
              onClick={() => setActive(i)}
              onPointerEnter={(e) => e.pointerType === "mouse" && setActive(i)}
              onFocus={() => setActive(i)}
            >
              <span className={s.svcNum}>{d.number}</span>
              <span className={s.svcTitle}>{d.short}</span>
            </button>
            <div id={`v9-svc-${d.id}`} className={s.svcInline} hidden={i !== active}>
              <p>{d.line}</p>
              <ul>
                {d.capabilities.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ol>
      <div className={s.svcPanel} aria-hidden="true">
        <div className={s.svcPanelInner} key={a.id}>
          <span className={s.svcPanelNum}>
            {a.number} <G name="slash" /> 06
          </span>
          <p className={s.svcPanelTitle}>{a.title}</p>
          <p className={s.svcPanelLine}>{a.line}</p>
          <dl className={s.svcDl}>
            <dt>Capabilities</dt>
            <dd>
              {a.capabilities.map((c) => (
                <span key={c}>{c}</span>
              ))}
            </dd>
            <dt>Stack</dt>
            <dd>
              {a.stack.map((c) => (
                <span key={c}>{c}</span>
              ))}
            </dd>
          </dl>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------------------------------
 * Small client-only bits: local Dhaka time and the mobile menu.
 * ---------------------------------------------------------------------------------------- */

function subscribeMinute(cb: () => void) {
  const id = window.setInterval(cb, 15_000);
  return () => clearInterval(id);
}

const dhakaTime = () => new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Dhaka" });

export function DhakaTime() {
  const t = useSyncExternalStore(subscribeMinute, dhakaTime, () => "--:--");
  return <span suppressHydrationWarning>{t}</span>;
}

export function MobileMenu({ links }: { links: { href: string; label: string }[] }) {
  const [open, setOpen] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);
  return (
    <>
      <button type="button" className={s.menuBtn} aria-expanded={open} aria-controls="v9-menu" onClick={() => setOpen(true)}>
        Menu
      </button>
      <div id="v9-menu" className={s.menu} data-open={open || undefined} role="dialog" aria-modal="true" aria-label="Menu" hidden={!open}>
        <div className={s.menuTop}>
          <span>DotGrey ✳ Index</span>
          <button ref={closeRef} type="button" className={s.menuClose} onClick={() => setOpen(false)}>
            Close
          </button>
        </div>
        <nav aria-label="Mobile">
          <ul className={s.menuList}>
            {links.map((l, i) => (
              <li key={l.href} style={{ animationDelay: `${60 + i * 50}ms` }}>
                <Link href={l.href} onClick={() => setOpen(false)}>
                  {l.label}
                  <G name="arrow" />
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className={s.menuFoot}>
          <span>
            <G name="diamond" /> Dhaka <G name="arrow" /> Remote
          </span>
          <ThemeToggle className={s.themeBtn}>
            <G name="ring" className={s.themeGlyph} />
            <span className={s.toDark}>Dark mode</span>
            <span className={s.toLight}>Light mode</span>
          </ThemeToggle>
        </div>
      </div>
    </>
  );
}

/* ------------------------------------------------------------------------------------------
 * Filters: a row of small grotesk options with counts, as on an index card.
 * ---------------------------------------------------------------------------------------- */

function Filters({ options, value, onChange, label }: { options: { id: string; count: number }[]; value: string; onChange: (v: string) => void; label: string }) {
  return (
    <div className={s.filters} role="radiogroup" aria-label={label}>
      {options.map((o) => (
        <button key={o.id} type="button" role="radio" aria-checked={value === o.id} className={s.filter} onClick={() => onChange(o.id)}>
          {o.id} <sup>({String(o.count).padStart(2, "0")})</sup>
        </button>
      ))}
    </div>
  );
}

/** The full work index: category filter over the giant rows. */
export function WorkCatalogue({ works }: { works: Work[] }) {
  const [cat, setCat] = useState("All");
  const cats = ["All", ...Array.from(new Set(works.map((w) => w.category)))];
  const shown = cat === "All" ? works : works.filter((w) => w.category === cat);
  return (
    <>
      <div className={s.wrap}>
        <Filters label="Filter by discipline" value={cat} onChange={setCat} options={cats.map((c) => ({ id: c, count: c === "All" ? works.length : works.filter((w) => w.category === c).length }))} />
      </div>
      <WorkIndex key={cat} works={shown} initial={shown.length} source={works} />
    </>
  );
}

/** Insights as a typographic index: topic filter over numbered rows. */
export function PostIndex({ posts, authors, format }: { posts: Post[]; authors: Record<string, string>; format: Record<string, string> }) {
  const [cat, setCat] = useState("All");
  const cats = ["All", ...Array.from(new Set(posts.map((p) => p.category)))];
  const shown = cat === "All" ? posts : posts.filter((p) => p.category === cat);
  return (
    <div className={s.wrap}>
      <Filters label="Filter by topic" value={cat} onChange={setCat} options={cats.map((c) => ({ id: c, count: c === "All" ? posts.length : posts.filter((p) => p.category === c).length }))} />
      <ol className={s.postRows}>
        {shown.map((p, i) => (
          <li key={p.slug}>
            <Link href={`/v9/insights/${p.slug}`} className={s.postRow}>
              <span className={s.postNum}>{String(i + 1).padStart(2, "0")}</span>
              <span className={s.postMain}>
                <span className={s.postTitle}>{p.title}</span>
                <span className={s.postExcerpt}>{p.excerpt}</span>
              </span>
              <span className={s.postMeta}>
                <span>{p.category}</span>
                <span>{format[p.slug]}</span>
                <span>{authors[p.author] ?? ""}</span>
                <span>{p.readingMinutes} min</span>
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
}

/* ------------------------------------------------------------------------------------------
 * Contact brief. Nothing is stored: a valid brief opens the visitor's email app, and the
 * page says so.
 * ---------------------------------------------------------------------------------------- */

type Errors = Partial<Record<"name" | "email" | "needs" | "message", string>>;

export function BriefForm({ email, needs, budgets, timelines }: { email: string; needs: string[]; budgets: string[]; timelines: string[] }) {
  const [picked, setPicked] = useState<string[]>([]);
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const v = (k: string) => String(f.get(k) ?? "").trim();
    const next: Errors = {};
    if (!v("name")) next.name = "Your name, please.";
    if (!/^\S+@\S+\.\S+$/.test(v("email"))) next.email = "An email we can reply to.";
    if (!picked.length) next.needs = "Pick at least one.";
    if (v("message").length < 10) next.message = "A sentence or two about the project.";
    setErrors(next);
    const first = Object.keys(next)[0];
    if (first) {
      formRef.current?.querySelector<HTMLElement>(`[data-field="${first}"]`)?.focus();
      return;
    }
    const body = [
      `Name: ${v("name")}`,
      `Email: ${v("email")}`,
      v("company") && `Company: ${v("company")}`,
      `Needs: ${picked.join(", ")}`,
      v("budget") && `Budget: ${v("budget")}`,
      v("timeline") && `Timeline: ${v("timeline")}`,
      "",
      v("message"),
    ]
      .filter((x) => x !== "")
      .join("\n");
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(`Project brief — ${v("name")}`)}&body=${encodeURIComponent(body)}`;
    setSent(true);
  };

  if (sent) {
    return (
      <div className={s.sent} role="status">
        <p className={s.sentTitle}>
          Brief ready <G name="arrow" />
        </p>
        <p>
          Your email app should have opened with the brief filled in — press send there and we reply within a working day.
          Nothing was stored on this site. If no window opened, write to <a href={`mailto:${email}`}>{email}</a>.
        </p>
        <button type="button" className={s.textBtn} onClick={() => setSent(false)}>
          Edit the brief
        </button>
      </div>
    );
  }

  const err = (k: keyof Errors) =>
    errors[k] ? (
      <span className={s.err} id={`v9-err-${k}`}>
        <G name="plus" /> {errors[k]}
      </span>
    ) : null;

  return (
    <form ref={formRef} className={s.form} onSubmit={submit} noValidate>
      <label className={s.field}>
        <span className={s.label}>(01) Name</span>
        <input name="name" data-field="name" autoComplete="name" aria-invalid={!!errors.name} aria-describedby={errors.name ? "v9-err-name" : undefined} />
        {err("name")}
      </label>
      <label className={s.field}>
        <span className={s.label}>(02) Email</span>
        <input name="email" type="email" data-field="email" autoComplete="email" aria-invalid={!!errors.email} aria-describedby={errors.email ? "v9-err-email" : undefined} />
        {err("email")}
      </label>
      <label className={s.field}>
        <span className={s.label}>(03) Company — optional</span>
        <input name="company" autoComplete="organization" />
      </label>
      <fieldset className={`${s.field} ${s.fieldWide}`}>
        <legend className={s.label}>(04) What you need</legend>
        <div className={s.chips} data-field="needs" tabIndex={-1} aria-describedby={errors.needs ? "v9-err-needs" : undefined}>
          {needs.map((n) => (
            <button
              key={n}
              type="button"
              className={s.filter}
              aria-pressed={picked.includes(n)}
              onClick={() => setPicked((p) => (p.includes(n) ? p.filter((x) => x !== n) : [...p, n]))}
            >
              {n}
            </button>
          ))}
        </div>
        {err("needs")}
      </fieldset>
      <label className={s.field}>
        <span className={s.label}>(05) Budget — optional</span>
        <select name="budget" defaultValue="">
          <option value="">Not sure yet</option>
          {budgets.map((b) => (
            <option key={b}>{b}</option>
          ))}
        </select>
      </label>
      <label className={s.field}>
        <span className={s.label}>(06) Timeline — optional</span>
        <select name="timeline" defaultValue="">
          <option value="">Flexible</option>
          {timelines.map((b) => (
            <option key={b}>{b}</option>
          ))}
        </select>
      </label>
      <label className={`${s.field} ${s.fieldWide}`}>
        <span className={s.label}>(07) The project</span>
        <textarea name="message" rows={5} data-field="message" aria-invalid={!!errors.message} aria-describedby={errors.message ? "v9-err-message" : undefined} />
        {err("message")}
      </label>
      <div className={`${s.fieldWide} ${s.formFoot}`}>
        <button type="submit" className={s.cta}>
          Send the brief <G name="arrow" />
        </button>
        <span className={s.formNote}>Opens your email app with the brief filled in. Nothing is stored here.</span>
      </div>
    </form>
  );
}

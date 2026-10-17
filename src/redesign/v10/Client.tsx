"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore, type FormEvent, type ReactNode } from "react";
import { Pause, Play } from "lucide-react";
import { useMotion } from "@/redesign/shared/useMotion";
import { ProjectArt } from "@/redesign/shared/ProjectArt";
import type { Discipline, Work } from "@/redesign/content";
import { buildFormations, buildRandoms } from "./formations";
import s from "./v10.module.css";

const VERT = `
attribute vec3 aFrom; attribute vec3 aTo; attribute vec3 aRnd;
uniform float uMix; uniform float uTime; uniform float uBloom; uniform float uAspect; uniform float uScale;
uniform float uDim; uniform float uDpr; uniform float uSize; uniform float uMotion;
uniform vec2 uOff; uniform vec2 uMouse; uniform vec2 uRot;
varying float vA;
void main(){
  float m = smoothstep(aRnd.y * 0.35, aRnd.y * 0.35 + 0.65, uMix);
  vec3 p = mix(aFrom, aTo, m);
  p += (aRnd - 0.5) * sin(3.14159 * m) * 0.9;
  p += uMotion * 0.012 * vec3(sin(uTime * 0.7 + aRnd.x * 30.0), cos(uTime * 0.6 + aRnd.y * 30.0), sin(uTime * 0.5 + aRnd.z * 30.0));
  float b = smoothstep(aRnd.x * 0.6, aRnd.x * 0.6 + 0.4, uBloom);
  p *= mix(0.04, 1.0, b) * uScale;
  float cy = cos(uRot.x); float sy = sin(uRot.x);
  p = vec3(p.x * cy + p.z * sy, p.y, -p.x * sy + p.z * cy);
  float cx = cos(uRot.y); float sx = sin(uRot.y);
  p = vec3(p.x, p.y * cx - p.z * sx, p.y * sx + p.z * cx);
  float w = 3.6 - p.z;
  vec2 ndc = vec2(p.x * 2.14 / uAspect, p.y * 2.14) / w + uOff;
  vec2 d = (ndc - uMouse) * vec2(uAspect, 1.0);
  float fall = exp(-dot(d, d) / 0.025) * uMotion;
  ndc += normalize(d + 1e-5) / vec2(uAspect, 1.0) * 0.08 * fall;
  gl_Position = vec4(ndc, 0.0, 1.0);
  float depth = clamp((p.z + 1.5) / 3.0, 0.0, 1.0);
  gl_PointSize = uSize * uDpr * (0.55 + aRnd.z * 0.9) * (3.6 / w);
  vA = (0.3 + 0.7 * depth) * uDim * (0.82 + 0.18 * sin(uTime * 1.7 + aRnd.x * 50.0) * uMotion) * b;
}`;

const FRAG = `
precision mediump float;
varying float vA;
void main(){
  float r = length(gl_PointCoord - 0.5);
  gl_FragColor = vec4(vec3(1.0), smoothstep(0.5, 0.18, r) * vA);
}`;

// Where each formation sits on screen and how bright it is: hero, six disciplines, dust.
const OFF_WIDE: [number, number][] = [[0.38, 0.02], ...Array(6).fill([0.47, 0]), [0, 0]];
const OFF_TALL: [number, number][] = [[0, 0.36], ...Array(6).fill([0, 0.42]), [0, 0]];
const DIM = [1, 1, 1, 1, 1, 1, 1, 0.5];

let glSupport: boolean | null = null;
function detectGL() {
  if (glSupport === null) {
    try {
      glSupport = !!document.createElement("canvas").getContext("webgl");
    } catch {
      glSupport = false;
    }
  }
  return glSupport;
}
const noSubscribe = () => () => {};

const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

type Chapter = { id: string; label: string };

/**
 * The world: a fixed WebGL point field behind the page. Scrolling through the sections
 * marked `data-ch` morphs the points from one formation to the next; the HUD (discipline
 * filter, chapter counter, Pause) tracks the same position. Text stays in the DOM.
 */
export function World({ chapters, children }: { chapters: Chapter[]; children: ReactNode }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const { paused, reduced, toggle } = useMotion();
  const hasGL = useSyncExternalStore(noSubscribe, detectGL, () => true);
  const [active, setActive] = useState(0);
  const motionRef = useRef({ paused, reduced, kick: true });
  useEffect(() => {
    motionRef.current = { paused, reduced, kick: true };
  }, [paused, reduced]);

  useEffect(() => {
    const root = rootRef.current;
    const canvas = canvasRef.current;
    if (!root) return;

    // Scroll position → chapter index + morph amount, shared with the renderer.
    const pos = { k: 0, mix: 0 };
    let anchors: number[] = [];
    const measure = () => {
      anchors = [...root.querySelectorAll<HTMLElement>("[data-ch]")].map((el) => el.getBoundingClientRect().top + scrollY);
    };
    const onScroll = () => {
      if (!anchors.length) return;
      const y = scrollY + innerHeight * 0.5;
      let k = 0;
      while (k < anchors.length - 1 && anchors[k + 1] <= y) k++;
      const span = k < anchors.length - 1 ? anchors[k + 1] - anchors[k] : 1;
      const frac = k < anchors.length - 1 ? Math.max(0, (y - anchors[k]) / span) : 0;
      pos.k = k;
      pos.mix = motionRef.current.reduced ? (frac > 0.85 ? 1 : 0) : smooth(0.55, 1, frac);
      setActive(k);
      if (barRef.current) {
        const p = Math.min(1, Math.max(0, (k - 1 + frac) / 6));
        barRef.current.style.transform = `scaleX(${k === 0 ? 0 : p})`;
      }
      dirty = true;
    };
    let dirty = true;
    measure();
    onScroll();
    const ro = new ResizeObserver(() => {
      measure();
      onScroll();
    });
    ro.observe(root);
    addEventListener("scroll", onScroll, { passive: true });

    const cleanups: (() => void)[] = [() => ro.disconnect(), () => removeEventListener("scroll", onScroll)];

    const gl = canvas?.getContext("webgl", { antialias: false, alpha: false, powerPreference: "high-performance" });
    if (canvas && gl) {
      const compile = (type: number, src: string) => {
        const sh = gl.createShader(type)!;
        gl.shaderSource(sh, src);
        gl.compileShader(sh);
        return sh;
      };
      const prog = gl.createProgram()!;
      gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
      gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
      gl.linkProgram(prog);
      if (gl.getProgramParameter(prog, gl.LINK_STATUS)) {
        gl.useProgram(prog);
        const count = innerWidth < 760 ? 4200 : 9000;
        const formations = buildFormations(count).map((data) => {
          const b = gl.createBuffer();
          gl.bindBuffer(gl.ARRAY_BUFFER, b);
          gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
          return b;
        });
        const rndBuf = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, rndBuf);
        gl.bufferData(gl.ARRAY_BUFFER, buildRandoms(count), gl.STATIC_DRAW);
        const aFrom = gl.getAttribLocation(prog, "aFrom");
        const aTo = gl.getAttribLocation(prog, "aTo");
        const aRnd = gl.getAttribLocation(prog, "aRnd");
        const attach = (loc: number, buf: WebGLBuffer | null) => {
          gl.bindBuffer(gl.ARRAY_BUFFER, buf);
          gl.enableVertexAttribArray(loc);
          gl.vertexAttribPointer(loc, 3, gl.FLOAT, false, 0, 0);
        };
        attach(aRnd, rndBuf);
        const u = (n: string) => gl.getUniformLocation(prog, n);
        const U = {
          mix: u("uMix"),
          time: u("uTime"),
          bloom: u("uBloom"),
          aspect: u("uAspect"),
          scale: u("uScale"),
          dim: u("uDim"),
          dpr: u("uDpr"),
          size: u("uSize"),
          motion: u("uMotion"),
          off: u("uOff"),
          mouse: u("uMouse"),
          rot: u("uRot"),
        };
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
        gl.clearColor(0, 0, 0, 1);

        let w = 0;
        let h = 0;
        let dpr = 1;
        const resize = () => {
          dpr = Math.min(devicePixelRatio || 1, 2);
          w = canvas.width = Math.round(canvas.clientWidth * dpr);
          h = canvas.height = Math.round(canvas.clientHeight * dpr);
          gl.viewport(0, 0, w, h);
          dirty = true;
        };
        resize();
        const cro = new ResizeObserver(resize);
        cro.observe(canvas);

        const mouse = { x: 9, y: 9, tx: 9, ty: 9, rx: 0, ry: 0 };
        const onMove = (e: PointerEvent) => {
          if (e.pointerType !== "mouse") return;
          mouse.tx = (e.clientX / innerWidth) * 2 - 1;
          mouse.ty = 1 - (e.clientY / innerHeight) * 2;
          if (mouse.x === 9) {
            mouse.x = mouse.tx;
            mouse.y = mouse.ty;
          }
        };
        const onLeave = () => {
          mouse.tx = mouse.ty = mouse.x = mouse.y = 9;
        };
        addEventListener("pointermove", onMove, { passive: true });
        document.documentElement.addEventListener("pointerleave", onLeave);

        let bound = -1;
        let time = 0;
        let last = performance.now();
        const start = last;
        let raf = 0;
        const frame = (now: number) => {
          raf = requestAnimationFrame(frame);
          const { paused: still, reduced: calm } = motionRef.current;
          const dt = Math.min(0.05, (now - last) / 1000);
          last = now;
          const bloom = calm ? 1 : smooth(700, 2300, now - start);
          const tracking = mouse.x !== 9;
          if (!still) time += dt;
          const ease = 0.08;
          const settle = Math.abs(mouse.tx - mouse.x) + Math.abs(mouse.ty - mouse.y);
          if (tracking) {
            mouse.x += (mouse.tx - mouse.x) * ease;
            mouse.y += (mouse.ty - mouse.y) * ease;
          }
          const tx = tracking && !still ? mouse.x : 0;
          const ty = tracking && !still ? mouse.y : 0;
          mouse.rx += (tx - mouse.rx) * 0.05;
          mouse.ry += (ty - mouse.ry) * 0.05;
          if (motionRef.current.kick) {
            motionRef.current.kick = false;
            dirty = true;
          }
          if (still && !dirty && bloom >= 1 && settle < 1e-3 && Math.abs(mouse.rx) + Math.abs(mouse.ry) < 1e-3) return;
          dirty = false;

          const k = pos.k;
          const next = Math.min(k + 1, formations.length - 1);
          if (bound !== k) {
            attach(aFrom, formations[k]);
            attach(aTo, formations[next]);
            bound = k;
          }
          const tall = h > w;
          const offs = tall ? OFF_TALL : OFF_WIDE;
          const m = pos.mix;
          const aspect = w / h;
          gl.clear(gl.COLOR_BUFFER_BIT);
          gl.uniform1f(U.mix, m);
          gl.uniform1f(U.time, time);
          gl.uniform1f(U.bloom, bloom);
          gl.uniform1f(U.aspect, aspect);
          gl.uniform1f(U.scale, tall ? Math.min(1, aspect * 1.3) : 1);
          gl.uniform1f(U.dim, DIM[k] + (DIM[next] - DIM[k]) * m);
          gl.uniform1f(U.dpr, dpr);
          gl.uniform1f(U.size, tall ? 2.2 : 2.6);
          gl.uniform1f(U.motion, still ? 0 : 1);
          gl.uniform2f(U.off, offs[k][0] + (offs[next][0] - offs[k][0]) * m, offs[k][1] + (offs[next][1] - offs[k][1]) * m);
          gl.uniform2f(U.mouse, tracking && !still ? mouse.x : 9, tracking && !still ? mouse.y : 9);
          gl.uniform2f(U.rot, (still ? 0 : time * 0.06) + mouse.rx * 0.35, -mouse.ry * 0.2);
          gl.drawArrays(gl.POINTS, 0, count);
        };
        raf = requestAnimationFrame(frame);
        const onVis = () => {
          cancelAnimationFrame(raf);
          if (!document.hidden) {
            last = performance.now();
            dirty = true;
            raf = requestAnimationFrame(frame);
          }
        };
        document.addEventListener("visibilitychange", onVis);
        cleanups.push(
          () => cancelAnimationFrame(raf),
          () => cro.disconnect(),
          () => removeEventListener("pointermove", onMove),
          () => document.documentElement.removeEventListener("pointerleave", onLeave),
          () => document.removeEventListener("visibilitychange", onVis),
        );
      }
    }
    return () => cleanups.forEach((f) => f());
  }, [hasGL]);

  const go = (id: string) => (e: React.MouseEvent) => {
    const el = document.getElementById(id);
    if (!el) return;
    e.preventDefault();
    el.scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
    history.replaceState(null, "", `#${id}`);
  };

  const chapter = active >= 1 && active <= 6 ? active : 0;

  return (
    <div ref={rootRef} className={s.world} data-zone={active >= 7 ? "index" : undefined}>
      {hasGL ? (
        <canvas ref={canvasRef} className={s.canvas} aria-hidden="true" />
      ) : (
        <div className={s.fallback} aria-hidden="true">
          <ProjectArt slug="dotgrey" variant="halftone" ratio={1} style={{ height: "100%" }} />
        </div>
      )}

      <nav className={s.filter} aria-label="What are you looking for?" data-hidden={active >= 7 || undefined}>
        <p className={s.filterLabel}>What are you looking for?</p>
        <ul>
          {chapters.map((c, i) => (
            <li key={c.id}>
              <a href={`#${c.id}`} onClick={go(c.id)} aria-current={chapter === i + 1 ? "true" : undefined}>
                <span className={s.filterDot} aria-hidden="true" />
                {c.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className={s.counter}>
        <button type="button" className={s.pause} onClick={toggle} aria-pressed={paused} aria-label={paused ? "Play motion" : "Pause motion"}>
          {paused ? <Play size={14} aria-hidden="true" /> : <Pause size={14} aria-hidden="true" />}
        </button>
        <span className={s.counterNum} aria-hidden="true" hidden={active >= 7}>
          {String(chapter).padStart(2, "0")}
          <span> / 06</span>
        </span>
        <span className={s.counterBar} aria-hidden="true" hidden={active >= 7}>
          <span ref={barRef} />
        </span>
        <span className={s.counterLabel} aria-hidden="true">
          {chapter ? chapters[chapter - 1].label : active >= 7 ? "Index" : "Intro"}
        </span>
      </div>

      {children}
    </div>
  );
}

/** Fast dot-matrix counter, 000 → 100, then the field blooms. Pure CSS fade as a backstop. */
export function Loader() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    const num = el?.querySelector("[data-num]");
    if (!el || !num || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t0 = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / 800);
      num.textContent = String(Math.round(100 * (1 - Math.pow(1 - p, 2)))).padStart(3, "0");
      if (p < 1) raf = requestAnimationFrame(tick);
      else el.dataset.done = "true";
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);
  return (
    <div ref={ref} className={s.loader} aria-hidden="true">
      <span data-num>000</span>
      <small>Loading the engine</small>
    </div>
  );
}

const KEYWORDS: Record<string, string[]> = {
  design: ["design", "brand", "logo", "ui", "ux", "figma", "prototype", "identity", "look", "redesign", "research", "interface"],
  development: ["website", "site", "web", "app", "mobile", "ios", "android", "shop", "store", "ecommerce", "cms", "landing", "next"],
  software: ["saas", "platform", "tool", "internal", "api", "backend", "portal", "system", "cloud", "legacy", "erp", "software"],
  automation: ["automate", "automation", "workflow", "invoice", "invoices", "zapier", "n8n", "crm", "integrate", "integration", "manual", "repetitive", "email", "agent", "agents", "sync"],
  data: ["dashboard", "data", "analytics", "report", "reports", "reporting", "bi", "forecast", "metrics", "kpi", "sql", "pipeline", "warehouse"],
  ml: ["ai", "ml", "model", "chatbot", "bot", "llm", "gpt", "predict", "prediction", "rag", "vision", "recommend", "recommendation", "classify", "machine", "learning", "assistant"],
};

/**
 * "Ask DotGrey" — a guided search, not an AI: it matches words in the question to a
 * discipline, answers from the services content and jumps to that chapter.
 */
export function Ask({ disciplines, email }: { disciplines: Discipline[]; email: string }) {
  const [q, setQ] = useState("");
  const [answer, setAnswer] = useState<{ text: string; id?: string } | null>(null);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const words = q.toLowerCase().match(/[a-z0-9]+/g) ?? [];
    if (!words.length) return;
    let best: Discipline | null = null;
    let score = 0;
    for (const d of disciplines) {
      const n = words.filter((w) => KEYWORDS[d.id]?.includes(w)).length;
      if (n > score) {
        score = n;
        best = d;
      }
    }
    if (!best) {
      setAnswer({ text: `No match yet. Try words like "dashboard", "chatbot" or "invoices" — or write to ${email}.` });
      return;
    }
    setAnswer({ text: `That's ${best.title}. ${best.line} Where we usually start: ${best.capabilities[0]}, ${best.capabilities[1]}.`, id: best.id });
    const el = document.getElementById(best.id);
    el?.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  };

  return (
    <form className={s.ask} onSubmit={submit} role="search">
      <label htmlFor="v10-ask" className={s.askLabel}>
        Ask DotGrey <span>Guided search · matches your words to what we do</span>
      </label>
      <div className={s.askRow}>
        <input id="v10-ask" value={q} onChange={(e) => setQ(e.target.value)} placeholder="e.g. automate our invoices" autoComplete="off" />
        <button type="submit" aria-label="Search">
          →
        </button>
      </div>
      <p className={s.askOut} aria-live="polite">
        {answer?.text}
      </p>
    </form>
  );
}

/** Work index: dot-matrix rows; the preview panel follows hover and keyboard focus. */
export function WorkIndex({ works }: { works: Work[] }) {
  const [i, setI] = useState(0);
  const w = works[i];
  return (
    <div className={s.index}>
      <ol className={s.rows}>
        {works.map((x, n) => (
          <li key={x.slug}>
            <Link href={`/v10/work/${x.slug}`} className={s.row} data-on={n === i || undefined} onPointerEnter={() => setI(n)} onFocus={() => setI(n)}>
              <span className={s.rowNum}>{String(n + 1).padStart(2, "0")}</span>
              <span className={s.rowTitle}>{x.title}</span>
              <span className={s.rowMeta}>
                {x.category} · {x.year}
              </span>
              <span className={s.rowStat}>{x.stats[0].value}</span>
              <span className={s.rowArt} aria-hidden="true">
                <ProjectArt slug={x.slug} label={x.client} variant="matrix" ratio={2.2} />
              </span>
            </Link>
          </li>
        ))}
      </ol>
      <aside className={s.preview} aria-hidden="true">
        <div className={s.previewArt}>
          <ProjectArt key={w.slug} slug={w.slug} label={w.client} variant="matrix" ratio={1.25} />
        </div>
        <p className={s.previewSum}>{w.summary}</p>
        <p className={s.previewStat}>
          <b>{w.stats[0].value}</b> {w.stats[0].label}
        </p>
      </aside>
    </div>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Pause, Play } from "lucide-react";
import { useMotion } from "@/redesign/shared/useMotion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import type { Discipline, Work } from "@/redesign/content";
import s from "./v6.module.css";

const VERT = `attribute vec2 p; void main(){ gl_Position = vec4(p, 0.0, 1.0); }`;

// A wobbling glass orb with thin-film iridescence, lit from the top left. The pointer
// nudges it; `off` moves it right on landscape screens and up on portrait ones.
const FRAG = `
precision highp float;
uniform vec2 r; uniform float t; uniform vec2 m; uniform vec2 off;
float h(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float n(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(h(i), h(i + vec2(1, 0)), f.x), mix(h(i + vec2(0, 1)), h(i + vec2(1, 1)), f.x), f.y); }
void main(){
  vec2 uv = (gl_FragCoord.xy - 0.5 * r) / r.y;
  vec2 mm = (m - 0.5 * r) / r.y;
  vec2 c = off + mm * 0.05;
  vec2 q = uv - c;
  float a = atan(q.y, q.x);
  float wob = 0.03 * sin(a * 3.0 + t * 0.9) + 0.025 * sin(a * 5.0 - t * 1.3) + 0.05 * (n(q * 3.0 + t * 0.2) - 0.5);
  float R = 0.34 + wob;
  float d = length(q) - R;
  vec3 bg = mix(vec3(0.953, 0.949, 1.0), vec3(0.984, 0.961, 0.949), uv.y * 0.5 + 0.5);
  float z = sqrt(max(0.0, R * R - dot(q, q)));
  vec3 N = normalize(vec3(q, z + 1e-3));
  vec3 L = normalize(vec3(-0.5, 0.6, 0.7));
  float diff = clamp(dot(N, L), 0.0, 1.0);
  float fres = pow(1.0 - N.z, 2.4);
  float k = fres * 2.6 + n(q * 4.0 + t * 0.15) * 1.1 + t * 0.04;
  vec3 iri = 0.5 + 0.5 * cos(6.2831 * (vec3(0.0, 0.33, 0.67) + k));
  vec3 base = mix(vec3(0.42, 0.30, 1.0), vec3(1.0, 0.48, 0.78), clamp(q.y * 1.3 + 0.5, 0.0, 1.0));
  vec3 col = mix(base * (0.55 + 0.6 * diff), iri, 0.45 * fres + 0.12);
  float spec = pow(clamp(dot(reflect(-L, N), vec3(0, 0, 1)), 0.0, 1.0), 28.0);
  col += spec * 0.85;
  float inside = smoothstep(0.004, -0.004, d);
  float glow = exp(-max(d, 0.0) * 8.0) * 0.35;
  vec3 outside = bg + glow * vec3(0.55, 0.45, 1.0) * 0.45;
  gl_FragColor = vec4(mix(outside, col, inside), 1.0);
}`;

/**
 * Hero with a live WebGL orb. Falls back to a CSS orb when WebGL is unavailable; renders a
 * single still frame when paused or under reduced motion.
 */
export function OrbHero({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const { paused, toggle } = useMotion();
  const [gl, setGl] = useState<boolean | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("webgl", { antialias: true, premultipliedAlpha: false });
    if (!ctx) {
      setGl(false);
      return;
    }
    const compile = (type: number, src: string) => {
      const sh = ctx.createShader(type)!;
      ctx.shaderSource(sh, src);
      ctx.compileShader(sh);
      return sh;
    };
    const prog = ctx.createProgram()!;
    ctx.attachShader(prog, compile(ctx.VERTEX_SHADER, VERT));
    ctx.attachShader(prog, compile(ctx.FRAGMENT_SHADER, FRAG));
    ctx.linkProgram(prog);
    if (!ctx.getProgramParameter(prog, ctx.LINK_STATUS)) {
      setGl(false);
      return;
    }
    ctx.useProgram(prog);
    const buf = ctx.createBuffer();
    ctx.bindBuffer(ctx.ARRAY_BUFFER, buf);
    ctx.bufferData(ctx.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), ctx.STATIC_DRAW);
    const loc = ctx.getAttribLocation(prog, "p");
    ctx.enableVertexAttribArray(loc);
    ctx.vertexAttribPointer(loc, 2, ctx.FLOAT, false, 0, 0);
    const uR = ctx.getUniformLocation(prog, "r");
    const uT = ctx.getUniformLocation(prog, "t");
    const uM = ctx.getUniformLocation(prog, "m");
    const uOff = ctx.getUniformLocation(prog, "off");
    setGl(true);

    let w = 0;
    let h = 0;
    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      w = canvas.width = Math.round(canvas.clientWidth * dpr);
      h = canvas.height = Math.round(canvas.clientHeight * dpr);
      ctx.viewport(0, 0, w, h);
      mouse.x = mouse.tx = w / 2;
      mouse.y = mouse.ty = h / 2;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const onMove = (e: PointerEvent) => {
      const rc = canvas.getBoundingClientRect();
      const dpr = w / rc.width;
      mouse.tx = (e.clientX - rc.left) * dpr;
      mouse.ty = (rc.height - (e.clientY - rc.top)) * dpr;
    };
    addEventListener("pointermove", onMove, { passive: true });

    let raf = 0;
    const t0 = performance.now();
    const draw = (now: number) => {
      mouse.x += (mouse.tx - mouse.x) * 0.05;
      mouse.y += (mouse.ty - mouse.y) * 0.05;
      const portrait = h > w;
      ctx.uniform2f(uR, w, h);
      ctx.uniform1f(uT, (now - t0) / 1000);
      ctx.uniform2f(uM, mouse.x, mouse.y);
      ctx.uniform2f(uOff, portrait ? 0 : 0.42 * (w / h) * 0.55, portrait ? 0.3 : 0);
      ctx.drawArrays(ctx.TRIANGLE_STRIP, 0, 4);
    };
    const loop = (now: number) => {
      draw(now);
      raf = requestAnimationFrame(loop);
    };
    let visible = true;
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      cancelAnimationFrame(raf);
      if (visible && !paused) raf = requestAnimationFrame(loop);
    });
    io.observe(canvas);
    if (paused) draw(t0 + 4000);
    else raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      removeEventListener("pointermove", onMove);
    };
  }, [paused]);

  return (
    <section className={s.hero} aria-label="Introduction">
      {gl !== true && <div className={s.orbFallback} aria-hidden="true" />}
      <canvas ref={ref} className={s.canvas} aria-hidden="true" style={{ opacity: gl ? 1 : 0 }} />
      <div className={`${s.wrap} ${s.heroInner}`}>{children}</div>
      {gl && (
        <button type="button" className={`${s.pause} ${s.glass}`} onClick={toggle} aria-pressed={paused}>
          {paused ? <Play size={14} /> : <Pause size={14} />}
          {paused ? "Play motion" : "Pause motion"}
        </button>
      )}
    </section>
  );
}

/**
 * Services as a depth stack: scrolling through the section flies each glass card from the
 * back of the scene to the front. Plain grid under reduced motion.
 */
export function DepthStack({ items }: { items: Discipline[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (reduced) return;
    const onScroll = () => {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const total = r.height - innerHeight;
      const p = Math.min(1, Math.max(0, -r.top / total));
      setProgress(p * (items.length - 1));
    };
    onScroll();
    addEventListener("scroll", onScroll, { passive: true });
    return () => removeEventListener("scroll", onScroll);
  }, [reduced, items.length]);

  const card = (d: Discipline, style?: React.CSSProperties) => (
    <article key={d.id} className={`${s.depthCard} ${s.glass}`} style={style}>
      <span className={s.num}>{d.number}</span>
      <h3>{d.title}</h3>
      <p>{d.line}</p>
      <div className={s.caps}>
        {d.capabilities.map((c) => (
          <span key={c} className={s.cap}>
            {c}
          </span>
        ))}
      </div>
    </article>
  );

  if (reduced) return <div className={`${s.wrap} ${s.depthGrid}`}>{items.map((d) => card(d))}</div>;

  return (
    <div ref={ref} className={s.depth} style={{ height: `${items.length * 70 + 30}vh` }}>
      <div className={s.depthSticky}>
        {items.map((d, i) => {
          const k = i - progress; // >0: still behind, 0: front, <0: passed
          const z = k * -520;
          const y = k * -26;
          const x = (i % 2 ? 1 : -1) * Math.min(Math.abs(k), 2) * 40;
          const opacity = k < -0.6 ? 0 : k > 2.5 ? 0 : k > 0.15 ? Math.max(0, 0.55 - k * 0.2) : 1;
          return card(d, {
            transform: `translate3d(${x}px, ${y}px, ${k < 0 ? -k * 600 : z}px) rotateX(${k * 4}deg)`,
            opacity,
            zIndex: 100 - i,
            pointerEvents: Math.abs(k) < 0.5 ? "auto" : "none",
          });
        })}
        <div className={s.depthHud} aria-hidden="true">
          {items.map((d, i) => (
            <i key={d.id} data-on={Math.round(progress) === i} />
          ))}
        </div>
      </div>
    </div>
  );
}

/** Work card that tilts towards the pointer, with a moving glare. */
export function TiltCard({ work }: { work: Work }) {
  return (
    <Link
      href={`/v6/work/${work.slug}`}
      className={`${s.tilt} ${s.glass}`}
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse") return;
        const r = e.currentTarget.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        e.currentTarget.style.setProperty("--ry", `${(px - 0.5) * 8}deg`);
        e.currentTarget.style.setProperty("--rx", `${(0.5 - py) * 8}deg`);
        e.currentTarget.style.setProperty("--gx", `${px * 100}%`);
        e.currentTarget.style.setProperty("--gy", `${py * 100}%`);
      }}
      onPointerLeave={(e) => {
        e.currentTarget.style.setProperty("--rx", "0deg");
        e.currentTarget.style.setProperty("--ry", "0deg");
      }}
    >
      <div className={s.tiltImg}>
        <Image src={work.cover} alt={`${work.title} cover`} width={1600} height={1000} />
        <span className={s.glare} />
      </div>
      <div className={s.tiltMeta}>
        <div>
          <small>
            {work.category} · {work.year}
          </small>
          <h3>{work.title}</h3>
        </div>
        <div className={`${s.statChip} ${s.glass}`}>
          <b>{work.stats[0].value}</b>
          <span>{work.stats[0].label}</span>
        </div>
      </div>
    </Link>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useTheme } from "@/site/shared/useTheme";
import s from "./site.module.css";

type Dot = { hx: number; hy: number; sx: number; sy: number; r: number; grey: boolean; delay: number; ox: number; oy: number; k: number };

const ASSEMBLE_MS = 1400;
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

/**
 * The footer's "dotgrey", set in dots. The real letterforms are drawn to an offscreen
 * canvas, sampled on a grid and redrawn as circles: "dot" in solid ink, "grey" in smaller,
 * lighter dots, led by one solid accent dot, so the name reads DOT·GREY. The dots gather
 * from a scatter the first time the footer comes into view and lean away from the pointer.
 * The plain word stays underneath for no-JS and screen readers never see either.
 */
export function DotWordmark() {
  const boxRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();
  const theme = useTheme();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const box = boxRef.current;
    const canvas = canvasRef.current;
    if (!box || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let dots: Dot[] = [];
    let lead = { x: 0, y: 0, r: 0 };
    let W = 0;
    let H = 0;
    let step = 0;
    let colours = { ink: "#111", grey: "#888", accent: "#111" };
    let raf = 0;
    let visible = false;
    let started: number | null = reduced ? -Infinity : null;
    const pointer = { x: -1e4, y: -1e4, active: false };
    let disposed = false;

    const readColours = () => {
      const cs = getComputedStyle(box);
      colours = {
        ink: cs.getPropertyValue("--fg").trim() || cs.color,
        grey: cs.getPropertyValue("--muted").trim() || cs.color,
        accent: cs.getPropertyValue("--accent").trim() || cs.color,
      };
    };

    const sample = () => {
      const rect = box.getBoundingClientRect();
      W = Math.round(rect.width);
      H = Math.round(rect.height);
      if (!W || !H) return;
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const family = getComputedStyle(box).fontFamily;
      const off = document.createElement("canvas");
      off.width = W;
      off.height = H;
      const o = off.getContext("2d", { willReadFrequently: true });
      if (!o) return;

      // Fit "● dotgrey" to the width: measure at a reference size, then scale.
      const ref = 100;
      o.font = `800 ${ref}px ${family}`;
      const track = -0.055;
      const wordW = (t: string) => o.measureText(t).width + track * ref * (t.length - 1);
      const leadD = 0.4 * ref;
      const gap = 0.12 * ref;
      const total = leadD + gap + wordW("dotgrey");
      const fs = Math.min((W * 0.985) / (total / ref), H / 0.86);
      const k = fs / ref;
      o.font = `800 ${fs}px ${family}`;
      const letter = (t: string, x: number, y: number) => {
        let cx = x;
        for (const ch of t) {
          o.fillText(ch, cx, y);
          cx += o.measureText(ch).width + track * fs;
        }
        return cx - track * fs;
      };
      const baseline = H * 0.8;
      const x0 = (W - total * k) / 2;
      const xDot = x0 + (leadD + gap) * k;
      o.clearRect(0, 0, W, H);
      o.fillStyle = "#f00";
      const xGrey = letter("dot", xDot, baseline) + track * fs;
      o.fillStyle = "#0f0";
      letter("grey", xGrey, baseline);

      // x-height of the face, so the lead dot sits on the lowercase like a full stop turned up.
      const xh = o.measureText("x").actualBoundingBoxAscent || fs * 0.53;
      lead = { x: x0 + (leadD * k) / 2, y: baseline - xh / 2, r: (leadD * k) / 2 };

      step = Math.max(5, fs / (W < 700 ? 17 : 28));
      const img = o.getImageData(0, 0, W, H).data;
      const at = (x: number, y: number, c: number) => {
        const xi = Math.min(W - 1, Math.max(0, Math.round(x)));
        const yi = Math.min(H - 1, Math.max(0, Math.round(y)));
        return img[(yi * W + xi) * 4 + c];
      };
      const next: Dot[] = [];
      const q = step / 3;
      for (let y = step / 2; y < H; y += step) {
        for (let x = step / 2; x < W; x += step) {
          // 3×3 sub-samples give a coverage value, so edge dots shrink like a halftone.
          let red = 0;
          let green = 0;
          for (let j = -1; j <= 1; j++)
            for (let i = -1; i <= 1; i++) {
              red += at(x + i * q, y + j * q, 0) > 127 ? 1 : 0;
              green += at(x + i * q, y + j * q, 1) > 127 ? 1 : 0;
            }
          const cov = Math.max(red, green) / 9;
          if (cov < 0.2) continue;
          const grey = green > red;
          const r = (step / 2) * (grey ? 0.72 : 0.9) * Math.sqrt(cov);
          const ang = Math.random() * Math.PI * 2;
          const dist = (0.25 + Math.random() * 0.55) * W * 0.5;
          next.push({
            hx: x,
            hy: y,
            sx: x + Math.cos(ang) * dist,
            sy: y + Math.sin(ang) * dist * 0.4,
            r,
            grey,
            delay: (x / W) * 450 + Math.random() * 250,
            ox: 0,
            oy: 0,
            k: 1,
          });
        }
      }
      dots = next;
    };

    const draw = (now: number) => {
      ctx.clearRect(0, 0, W, H);
      const t0 = started ?? null;
      const reach = step * 7;
      let moving = false;

      // Lead dot: grows in with the assembly.
      const leadP = t0 === null ? 0 : reduced ? 1 : easeOut(Math.min(1, (now - t0) / 700));
      if (leadP > 0) {
        ctx.fillStyle = colours.accent;
        ctx.beginPath();
        ctx.arc(lead.x, lead.y, lead.r * leadP, 0, Math.PI * 2);
        ctx.fill();
      }
      if (leadP < 1 && t0 !== null) moving = true;

      for (const pass of [false, true]) {
        ctx.fillStyle = pass ? colours.grey : colours.ink;
        ctx.beginPath();
        for (const d of dots) {
          if (d.grey !== pass) continue;
          let p = 1;
          if (t0 === null) p = 0;
          else if (!reduced) {
            p = Math.min(1, Math.max(0, (now - t0 - d.delay) / ASSEMBLE_MS));
            if (p < 1) moving = true;
          }
          if (p <= 0) continue;
          const e = easeOut(p);
          let tx = 0;
          let ty = 0;
          let tk = 1;
          if (!reduced && pointer.active) {
            const dx = d.hx - pointer.x;
            const dy = d.hy - pointer.y;
            const dd = Math.hypot(dx, dy);
            if (dd < reach) {
              const f = 1 - dd / reach;
              const push = f * f * step * 1.1;
              tx = (dx / (dd || 1)) * push;
              ty = (dy / (dd || 1)) * push;
              tk = 1 + f * 0.7;
            }
          }
          d.ox += (tx - d.ox) * 0.18;
          d.oy += (ty - d.oy) * 0.18;
          d.k += (tk - d.k) * 0.18;
          if (Math.abs(tx - d.ox) > 0.05 || Math.abs(ty - d.oy) > 0.05 || Math.abs(tk - d.k) > 0.005) moving = true;
          const x = d.sx + (d.hx - d.sx) * e + d.ox;
          const y = d.sy + (d.hy - d.sy) * e + d.oy;
          const r = d.r * d.k * (0.4 + 0.6 * e);
          ctx.moveTo(x + r, y);
          ctx.arc(x, y, r, 0, Math.PI * 2);
        }
        ctx.fill();
      }
      return moving;
    };

    const loop = (now: number) => {
      raf = 0;
      if (disposed) return;
      const moving = draw(now);
      if (moving && visible) raf = requestAnimationFrame(loop);
    };
    const kick = () => {
      if (!raf && visible) raf = requestAnimationFrame(loop);
    };

    let cancelled = false;
    const setup = async () => {
      try {
        await document.fonts?.ready;
      } catch {}
      if (cancelled) return;
      readColours();
      sample();
      setReady(true);
      draw(performance.now());
    };
    void setup();

    const io = new IntersectionObserver(
      ([e]) => {
        visible = e.isIntersecting;
        if (visible && started === null && e.intersectionRatio > 0.15) started = performance.now();
        if (visible) kick();
      },
      { threshold: [0, 0.15, 0.5] },
    );
    io.observe(box);

    const ro = new ResizeObserver(() => {
      const r = box.getBoundingClientRect();
      if (Math.round(r.width) === W && Math.round(r.height) === H) return;
      sample();
      draw(performance.now());
    });
    ro.observe(box);

    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const onMove = (ev: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      pointer.x = ev.clientX - r.left;
      pointer.y = ev.clientY - r.top;
      pointer.active = true;
      kick();
    };
    const onLeave = () => {
      pointer.active = false;
      kick();
    };
    if (fine && !reduced) {
      box.addEventListener("pointermove", onMove);
      box.addEventListener("pointerleave", onLeave);
    }

    const onTheme = () => {
      readColours();
      draw(performance.now());
    };
    box.addEventListener("dg-redraw", onTheme);

    return () => {
      disposed = true;
      cancelled = true;
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      box.removeEventListener("pointermove", onMove);
      box.removeEventListener("pointerleave", onLeave);
      box.removeEventListener("dg-redraw", onTheme);
    };
  }, [reduced]);

  // Theme flips change the CSS colours; ask the running effect to re-read them.
  useEffect(() => {
    const box = boxRef.current;
    if (!box || !theme) return;
    const id = requestAnimationFrame(() => box.dispatchEvent(new Event("dg-redraw")));
    return () => cancelAnimationFrame(id);
  }, [theme]);

  return (
    <div ref={boxRef} className={s.dotMark} data-ready={ready || undefined}>
      <span className={s.srOnly}>DotGrey</span>
      <span className={s.dotMarkText} aria-hidden="true">
        dotgrey
      </span>
      <canvas ref={canvasRef} className={s.dotMarkCanvas} aria-hidden="true" />
    </div>
  );
}

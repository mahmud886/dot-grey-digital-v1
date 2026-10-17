"use client";

import { useEffect, useRef, useState } from "react";
import type { Discipline, Step } from "@/redesign/content";
import s from "./v3.module.css";

/** Drafting crosshair with a live coordinate readout. Pointer devices only (CSS hides it on touch). */
export function Crosshair() {
  const ref = useRef<HTMLDivElement>(null);
  const [xy, setXy] = useState<[number, number] | null>(null);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      ref.current?.style.setProperty("--cx", `${e.clientX}px`);
      ref.current?.style.setProperty("--cy", `${e.clientY}px`);
      setXy([Math.round(e.clientX), Math.round(e.clientY + scrollY)]);
    };
    const onLeave = () => setXy(null);
    addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    return () => {
      removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div ref={ref} className={s.cross} aria-hidden="true" style={{ opacity: xy ? 1 : 0 }}>
      <div className={s.crossH} />
      <div className={s.crossV} />
      {xy && (
        <span className={`${s.crossRead} ${s.mono}`}>
          X {String(xy[0]).padStart(4, "0")} · Y {String(xy[1]).padStart(5, "0")}
        </span>
      )}
    </div>
  );
}

/**
 * Exploded view of the stack we build: six plates, one per discipline. Hover, focus or tap
 * a plate to read its spec in the callout. Leader and dimension lines draw themselves once.
 */
export function SystemDiagram({ items }: { items: Discipline[] }) {
  const [active, setActive] = useState(0);
  const d = items[active];
  const top = 70;
  const gap = 62;

  return (
    <div className={s.diagram}>
      <svg viewBox="0 0 760 520" role="group" aria-label="Exploded system diagram — six disciplines">
        {/* dimension line */}
        <path className={`${s.draw} ${s.dim}`} d={`M60 ${top} V${top + gap * 5} M50 ${top} H70 M50 ${top + gap * 5} H70`} />
        <text className={s.dimText} x="40" y={top + gap * 2.5 + 4} transform={`rotate(-90 40 ${top + gap * 2.5})`} textAnchor="middle">
          6 LAYERS · ONE TEAM
        </text>
        {[...items].reverse().map((it) => {
          const i = items.indexOf(it);
          const y = top + i * gap;
          const on = i === active;
          return (
            <g
              key={it.id}
              className={`${s.layer} ${on ? s.layerOn : ""}`}
              style={{ transform: on ? "translateX(-14px)" : undefined }}
              tabIndex={0}
              role="button"
              aria-pressed={on}
              aria-label={`${it.number} ${it.title}`}
              onPointerEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              onClick={() => setActive(i)}
            >
              <polygon points={`130,${y} 330,${y - 52} 530,${y} 330,${y + 52}`} />
              <text x="330" y={y + 5} textAnchor="middle">
                {it.short.toUpperCase()}
              </text>
            </g>
          );
        })}
        {items.map((it, i) => {
          const y = top + i * gap;
          return (
            <g key={`lead-${it.id}`}>
              <path className={`${s.draw} ${s.dim}`} style={{ animationDelay: `${0.3 + i * 0.12}s` }} d={`M530 ${y} H600 L620 ${y - 16} H660`} />
              <circle cx="676" cy={y - 16} r="14" className={s.dim} style={{ stroke: i === active ? "#ffd23f" : undefined }} />
              <text className={s.dimText} x="676" y={y - 12} textAnchor="middle" style={{ fill: i === active ? "#ffd23f" : undefined }}>
                {it.number}
              </text>
            </g>
          );
        })}
      </svg>
      <div className={s.callout} aria-live="polite">
        <span className={`${s.mono} ${s.y}`}>
          Detail {d.number} — {d.stack.join(" / ")}
        </span>
        <h3>{d.title}</h3>
        <p>{d.line}</p>
      </div>
    </div>
  );
}

/** Process as a Gantt chart; bars extend when the chart scrolls into view. */
export function Gantt({ steps }: { steps: Step[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);
  // [start week, length] on a 12-week plan
  const plan: [number, number][] = [
    [0, 2],
    [1, 3],
    [3, 6],
    [6, 4],
    [8, 4],
  ];

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setOn(true);
        io.disconnect();
      }
    }, { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={s.gantt} role="table" aria-label="Typical twelve-week project plan">
      <div className={`${s.ganttHead} ${s.mono}`} role="row">
        <span style={{ padding: "0.5rem 1rem" }} role="columnheader">
          Stage
        </span>
        <div className={s.weeks} role="columnheader">
          {Array.from({ length: 12 }, (_, i) => (
            <span key={i}>W{i + 1}</span>
          ))}
        </div>
      </div>
      {steps.map((st, i) => (
        <div key={st.title} className={s.ganttRow} role="row">
          <div className={s.ganttLabel} role="cell">
            <b>
              {String(i + 1).padStart(2, "0")} {st.title}
            </b>
            <span>{st.body}</span>
          </div>
          <div className={s.track} role="cell" aria-label={`Weeks ${plan[i][0] + 1} to ${plan[i][0] + plan[i][1]}`}>
            <span
              className={`${s.bar} ${on ? s.barOn : ""}`}
              style={{
                left: `${(plan[i][0] / 12) * 100}%`,
                width: `${(plan[i][1] / 12) * 100}%`,
                transitionDelay: `${i * 0.15}s`,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

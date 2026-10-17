/**
 * Black-and-white generative "covers" for the monochrome prototypes (/v8 – /v12).
 *
 * The existing case-study images are blurred placeholders, so instead of showing them the
 * mono versions draw a deterministic composition per project: the same slug always gives
 * the same picture, and each project looks different. Pure SVG, no client JS.
 */
import type { CSSProperties, ReactElement } from "react";

export type ArtVariant = "halftone" | "contour" | "matrix" | "poster" | "rings";

type Props = {
  slug: string;
  /** Text used by the matrix and poster variants, e.g. the client name. */
  label?: string;
  variant?: ArtVariant;
  /** Foreground and background colours; defaults to white ink on black. */
  ink?: string;
  paper?: string;
  /** viewBox aspect, width / height. */
  ratio?: number;
  /** Changes the composition while keeping the same project seed (for gallery frames). */
  frame?: number;
  className?: string;
  style?: CSSProperties;
  title?: string;
};

function hash(str: string) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function rng(seed: number) {
  let a = seed || 1;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const r2 = (n: number) => Math.round(n * 100) / 100;

/** 5×7 bitmap glyphs for the matrix variant. Each string is 7 rows of 5 bits. */
const GLYPHS: Record<string, string> = {
  A: "01110100011000111111100011000110001",
  B: "11110100011000111110100011000111110",
  C: "01110100011000010000100001000101110",
  D: "11110100011000110001100011000111110",
  E: "11111100001000011110100001000011111",
  F: "11111100001000011110100001000010000",
  G: "01110100011000010111100011000101111",
  H: "10001100011000111111100011000110001",
  I: "01110001000010000100001000010001110",
  J: "00111000100001000010000101001001100",
  K: "10001100101010011000101001001010001",
  L: "10000100001000010000100001000011111",
  M: "10001110111010110101100011000110001",
  N: "10001100011100110101100111000110001",
  O: "01110100011000110001100011000101110",
  P: "11110100011000111110100001000010000",
  Q: "01110100011000110001101011001001101",
  R: "11110100011000111110101001001010001",
  S: "01111100001000001110000010000111110",
  T: "11111001000010000100001000010000100",
  U: "10001100011000110001100011000101110",
  V: "10001100011000110001100010101000100",
  W: "10001100011000110101101011010101010",
  X: "10001100010101000100010101000110001",
  Y: "10001100010101000100001000010000100",
  Z: "11111000010001000100010001000011111",
  "0": "01110100011001110101110011000101110",
  "1": "00100011000010000100001000010001110",
  "2": "01110100010000100010001000100011111",
  "3": "11111000100010000010000011000101110",
  "4": "00010001100101010010111110001000010",
  "5": "11111100001111000001000011000101110",
  "6": "00110010001000011110100011000101110",
  "7": "11111000010001000100010000100001000",
  "8": "01110100011000101110100011000101110",
  "9": "01110100011000101111000010001001100",
  "'": "00100001000100000000000000000000000",
  "&": "01100100101010001000101011001001101",
  "-": "00000000000000011111000000000000000",
  ".": "00000000000000000000000000110001100",
  " ": "00000000000000000000000000000000000",
};

function Halftone({ seed, w, h, ink }: { seed: number; w: number; h: number; ink: string }) {
  const rand = rng(seed);
  const cols = 44;
  const step = w / cols;
  const rows = Math.ceil(h / step);
  // Two soft "lights" and a directional wave give each project its own field.
  const lights = [0, 1].map(() => ({ x: rand() * w, y: rand() * h, s: 0.18 + rand() * 0.3 }));
  const angle = rand() * Math.PI;
  const freq = 2 + rand() * 4;
  const dots = [];
  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      const x = (i + 0.5) * step;
      const y = (j + 0.5) * step;
      let v = 0;
      for (const l of lights) {
        const d = Math.hypot(x - l.x, y - l.y) / (w * l.s);
        v += Math.exp(-d * d);
      }
      v += 0.22 * Math.sin(((x * Math.cos(angle) + y * Math.sin(angle)) / w) * Math.PI * freq);
      const r = Math.max(0, Math.min(1, v)) * step * 0.48;
      if (r > 0.6) dots.push(<circle key={`${i}-${j}`} cx={r2(x)} cy={r2(y)} r={r2(r)} />);
    }
  }
  return <g fill={ink}>{dots}</g>;
}

function Contour({ seed, w, h, ink }: { seed: number; w: number; h: number; ink: string }) {
  const rand = rng(seed);
  const lines = 26;
  const a1 = 70 + rand() * 110;
  const a2 = 30 + rand() * 70;
  const f1 = 1 + rand() * 2.5;
  const f2 = 3 + rand() * 4;
  const p1 = rand() * Math.PI * 2;
  const p2 = rand() * Math.PI * 2;
  const paths = [];
  for (let k = 0; k < lines; k++) {
    const base = ((k + 0.5) / lines) * h;
    const t = k / lines;
    let d = "";
    for (let x = 0; x <= w; x += 20) {
      const u = x / w;
      const bump = Math.exp(-(((u - 0.5) * 2.6) ** 2)) * Math.sin(t * Math.PI);
      const y = base + bump * (a1 * Math.sin(u * Math.PI * f1 + p1 + t * 3) + a2 * Math.sin(u * Math.PI * f2 + p2 - t * 5));
      d += `${x === 0 ? "M" : "L"}${x} ${r2(y)}`;
    }
    paths.push(<path key={k} d={d} />);
  }
  return (
    <g fill="none" stroke={ink} strokeWidth={4} strokeLinejoin="round">
      {paths}
    </g>
  );
}

function Rings({ seed, w, h, ink }: { seed: number; w: number; h: number; ink: string }) {
  const rand = rng(seed);
  const cx = w * (0.3 + rand() * 0.4);
  const cy = h * (0.3 + rand() * 0.4);
  const n = 26;
  const max = Math.hypot(w, h) * 0.55;
  const sx = 0.6 + rand() * 0.8;
  const rot = rand() * 180;
  const rings = [];
  for (let k = 1; k <= n; k++) {
    const r = (k / n) ** 1.35 * max;
    rings.push(<ellipse key={k} cx={r2(cx)} cy={r2(cy)} rx={r2(r * sx)} ry={r2(r)} transform={`rotate(${r2(rot)} ${r2(cx)} ${r2(cy)})`} strokeWidth={k % 5 === 0 ? 5 : 1.6} />);
  }
  return (
    <g fill="none" stroke={ink}>
      {rings}
    </g>
  );
}

function Matrix({ seed, w, h, ink, label }: { seed: number; w: number; h: number; ink: string; label: string }) {
  const rand = rng(seed);
  const text = label.toUpperCase().slice(0, 8);
  const chars = [...text].map((c) => GLYPHS[c] ?? GLYPHS[" "]);
  // Glyphs are 5 wide + 1 gap. Fit the word across ~86% of the width.
  const cellsW = chars.length * 6 - 1;
  const cell = Math.min((w * 0.86) / cellsW, (h * 0.5) / 7);
  const ox = (w - cellsW * cell) / 2;
  const oy = (h - 7 * cell) / 2;
  const bg = [];
  const fg: ReactElement[] = [];
  const cols = Math.floor(w / cell);
  const rows = Math.floor(h / cell);
  const gx = (w - cols * cell) / 2;
  const gy = (h - rows * cell) / 2;
  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      const x = gx + (i + 0.5) * cell;
      const y = gy + (j + 0.5) * cell;
      bg.push(<circle key={`b${i}-${j}`} cx={r2(x)} cy={r2(y)} r={r2(cell * (0.08 + rand() * 0.05))} />);
    }
  }
  chars.forEach((g, ci) => {
    for (let k = 0; k < 35; k++) {
      if (g[k] !== "1") continue;
      const x = ox + (ci * 6 + (k % 5) + 0.5) * cell;
      const y = oy + (Math.floor(k / 5) + 0.5) * cell;
      fg.push(<circle key={`f${ci}-${k}`} cx={r2(x)} cy={r2(y)} r={r2(cell * 0.42)} />);
    }
  });
  return (
    <g fill={ink}>
      <g opacity={0.35}>{bg}</g>
      {fg}
    </g>
  );
}

function Poster({ seed, w, h, ink, label }: { seed: number; w: number; h: number; ink: string; label: string }) {
  const rand = rng(seed);
  const word = label.toUpperCase();
  const size = Math.min(h * 0.9, (w / Math.max(3, word.length)) * 1.9);
  const y = h * (0.62 + rand() * 0.25);
  const lines = [];
  const n = 9 + Math.floor(rand() * 6);
  for (let k = 0; k < n; k++) {
    const yy = (k / n) * h;
    lines.push(<line key={k} x1={0} x2={w} y1={r2(yy)} y2={r2(yy)} />);
  }
  return (
    <>
      <g stroke={ink} strokeOpacity={0.18} strokeWidth={1.5}>
        {lines}
      </g>
      <circle cx={r2(w * (0.55 + rand() * 0.3))} cy={r2(h * (0.2 + rand() * 0.25))} r={r2(h * (0.12 + rand() * 0.1))} fill={ink} />
      <text
        x={r2(-size * 0.04)}
        y={r2(y)}
        fill={ink}
        fontFamily="Arial Black, Helvetica Neue, Arial, sans-serif"
        fontWeight={900}
        fontSize={r2(size)}
        letterSpacing={r2(-size * 0.06)}
      >
        {word}
      </text>
    </>
  );
}

const VARIANTS: ArtVariant[] = ["halftone", "contour", "matrix", "poster", "rings"];

export function ProjectArt({ slug, label, variant, ink = "#ffffff", paper = "#0a0a0a", ratio = 1.6, frame = 0, className, style, title }: Props) {
  const seed = hash(`${slug}:${frame}`);
  const v = variant ?? VARIANTS[hash(slug) % VARIANTS.length];
  const w = 1600;
  const h = Math.round(w / ratio);
  const text = label ?? slug.split("-")[0];
  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      preserveAspectRatio="xMidYMid slice"
      className={className}
      style={{ display: "block", width: "100%", height: "auto", background: paper, ...style }}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      {v === "halftone" && <Halftone seed={seed} w={w} h={h} ink={ink} />}
      {v === "contour" && <Contour seed={seed} w={w} h={h} ink={ink} />}
      {v === "rings" && <Rings seed={seed} w={w} h={h} ink={ink} />}
      {v === "matrix" && <Matrix seed={seed} w={w} h={h} ink={ink} label={text} />}
      {v === "poster" && <Poster seed={seed} w={w} h={h} ink={ink} label={text} />}
    </svg>
  );
}

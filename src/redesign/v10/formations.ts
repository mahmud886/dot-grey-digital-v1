/**
 * Point formations for the v10 particle engine. Each returns `count` xyz positions
 * (roughly within a unit sphere) for one chapter: the hero dot, then one shape per
 * discipline, then a loose dust field behind the work and contact sections.
 */

type Vec3 = [number, number, number];

function rng(seed: number) {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function rotate([x, y, z]: Vec3, rx: number, ry: number): Vec3 {
  const cy = Math.cos(ry);
  const sy = Math.sin(ry);
  const x1 = x * cy + z * sy;
  const z1 = -x * sy + z * cy;
  const cx = Math.cos(rx);
  const sx = Math.sin(rx);
  return [x1, y * cx - z1 * sx, y * sx + z1 * cx];
}

function fill(count: number, seed: number, pick: (r: () => number, i: number) => Vec3, rx = 0, ry = 0) {
  const out = new Float32Array(count * 3);
  const r = rng(seed);
  for (let i = 0; i < count; i++) {
    const p = rotate(pick(r, i), rx, ry);
    out[i * 3] = p[0];
    out[i * 3 + 1] = p[1];
    out[i * 3 + 2] = p[2];
  }
  return out;
}

/** Hero: the dot — a sphere with a thin tilted orbit. */
function dot(count: number) {
  const ring = Math.floor(count * 0.16);
  const sphere = count - ring;
  const golden = Math.PI * (3 - Math.sqrt(5));
  return fill(
    count,
    11,
    (r, i) => {
      if (i < sphere) {
        const y = 1 - (i / (sphere - 1)) * 2;
        const rad = Math.sqrt(1 - y * y);
        const th = golden * i;
        return [Math.cos(th) * rad * 0.95, y * 0.95, Math.sin(th) * rad * 0.95];
      }
      const a = r() * Math.PI * 2;
      const d = 1.35 + r() * 0.22;
      return [Math.cos(a) * d, (r() - 0.5) * 0.02, Math.sin(a) * d];
    },
    0.42,
    0.3,
  );
}

/** Design: circle, square and triangle set as halftone grids on a tilted sheet. */
function design(count: number) {
  const step = 0.052;
  const cells: Vec3[] = [];
  for (let gx = -1.5; gx <= 1.5; gx += step) {
    for (let gy = -1.1; gy <= 1.1; gy += step) {
      const inCircle = Math.hypot(gx + 0.62, gy - 0.28) < 0.6;
      const sq = Math.max(Math.abs(gx - 0.62), Math.abs(gy - 0.36));
      const inSquare = sq < 0.5 && sq > 0.38;
      const tx = gx - 0.05;
      const ty = gy + 0.55;
      const inTri = ty > -0.42 && ty < 0.42 && Math.abs(tx) < (0.42 - ty) * 0.62;
      if (inCircle || inSquare || inTri) cells.push([gx, gy, 0]);
    }
  }
  return fill(
    count,
    23,
    (r, i) => {
      const c = cells[i % cells.length];
      const layer = Math.floor(i / cells.length);
      return [c[0], c[1], layer * 0.035 + (r() - 0.5) * 0.01];
    },
    -0.5,
    0.45,
  );
}

/** Development: a cube lattice drawn as dotted grid lines. */
function development(count: number) {
  const n = 6;
  const size = 1.02;
  const lerp = (k: number) => (k / n - 0.5) * size * 2 * 0.8;
  return fill(
    count,
    37,
    (r) => {
      const axis = Math.floor(r() * 3);
      const a = lerp(Math.floor(r() * (n + 1)));
      const b = lerp(Math.floor(r() * (n + 1)));
      const t = (r() - 0.5) * size * 2 * 0.8;
      return axis === 0 ? [t, a, b] : axis === 1 ? [a, t, b] : [a, b, t];
    },
    0.55,
    0.65,
  );
}

/** Software: five stacked layers, like an architecture diagram. */
function software(count: number) {
  const layers = 5;
  return fill(
    count,
    41,
    (r, i) => {
      const L = i % layers;
      const y = (L / (layers - 1) - 0.5) * 1.5;
      const w = L === layers - 1 ? 0.75 : 1;
      if (r() < 0.32) {
        // Outline of the sheet.
        const t = r() * 4;
        const s = (t % 1) * 2 - 1;
        const side = Math.floor(t);
        const [x, z] = side === 0 ? [s, -1] : side === 1 ? [1, s] : side === 2 ? [-s, 1] : [-1, -s];
        return [x * w, y, z * w];
      }
      // A coarse grid on the sheet with a few "modules" cut out.
      const gx = Math.round((r() * 2 - 1) * 10) / 10;
      const gz = Math.round((r() * 2 - 1) * 10) / 10;
      const hole = (L + Math.floor((gx + 1) * 2.5) + Math.floor((gz + 1) * 2.5)) % 4 === 0;
      return hole ? [gx * w * 0.2, y, gz * w * 0.2] : [gx * w, y, gz * w];
    },
    0.62,
    0.78,
  );
}

/** Automation: a (2,3) torus knot — one loop that never stops. */
function automation(count: number) {
  return fill(
    count,
    53,
    (r) => {
      const u = r() * Math.PI * 2;
      const v = r() * Math.PI * 2;
      const p = 2;
      const q = 3;
      const R = 0.62 + 0.28 * Math.cos(q * u);
      const c: Vec3 = [R * Math.cos(p * u), 0.28 * Math.sin(q * u), R * Math.sin(p * u)];
      const tube = 0.075 + r() * 0.01;
      return [c[0] + Math.cos(v) * tube * Math.cos(p * u), c[1] + Math.sin(v) * tube, c[2] + Math.cos(v) * tube * Math.sin(p * u)];
    },
    0.75,
    0,
  );
}

/** Data: a field of bars whose heights follow a smooth surface. */
function data(count: number) {
  const n = 9;
  const bars: { x: number; z: number; h: number }[] = [];
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      const x = (i / (n - 1) - 0.5) * 2;
      const z = (j / (n - 1) - 0.5) * 2;
      const h = 0.15 + 1.3 * Math.exp(-((x - 0.3) ** 2 + (z + 0.2) ** 2) * 1.4) + 0.25 * Math.sin(x * 3 + z * 2) ** 2;
      bars.push({ x, z, h });
    }
  }
  const total = bars.reduce((a, b) => a + b.h, 0);
  return fill(
    count,
    67,
    (r) => {
      let pick = r() * total;
      let bar = bars[0];
      for (const b of bars) {
        pick -= b.h;
        if (pick <= 0) {
          bar = b;
          break;
        }
      }
      const w = 0.075;
      const y = -0.75 + r() * bar.h;
      const s = (r() * 2 - 1) * w;
      const face = Math.floor(r() * 4);
      const [dx, dz] = face === 0 ? [s, -w] : face === 1 ? [w, s] : face === 2 ? [-s, w] : [-w, s];
      const top = r() < 0.12;
      return [bar.x * 0.85 + (top ? s : dx), top ? -0.75 + bar.h : y, bar.z * 0.85 + (top ? (r() * 2 - 1) * w : dz)];
    },
    0.5,
    0.7,
  );
}

/** ML: a layered neural network — node clusters joined by dotted connections. */
function ml(count: number) {
  const shape = [4, 6, 6, 3];
  const r0 = rng(79);
  const nodes: Vec3[][] = shape.map((k, L) =>
    Array.from({ length: k }, (_, i) => [(L / (shape.length - 1) - 0.5) * 2.3, (i / (k - 1 || 1) - 0.5) * (k / 6) * 1.7, (r0() - 0.5) * 0.6] as Vec3),
  );
  const links: [Vec3, Vec3][] = [];
  for (let L = 0; L < nodes.length - 1; L++) for (const a of nodes[L]) for (const b of nodes[L + 1]) links.push([a, b]);
  const flat = nodes.flat();
  return fill(
    count,
    83,
    (r) => {
      if (r() < 0.45) {
        const c = flat[Math.floor(r() * flat.length)];
        const u = r() * 2 - 1;
        const th = r() * Math.PI * 2;
        const rad = 0.085 * Math.cbrt(r());
        const s = Math.sqrt(1 - u * u);
        return [c[0] + s * Math.cos(th) * rad, c[1] + u * rad, c[2] + s * Math.sin(th) * rad];
      }
      const [a, b] = links[Math.floor(r() * links.length)];
      const t = r();
      return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
    },
    0.12,
    -0.35,
  );
}

/** Dust: a wide, flat drift of points that sits behind the reading sections. */
function dust(count: number) {
  return fill(
    count,
    97,
    (r) => {
      const a = r() * Math.PI * 2;
      const d = 0.4 + Math.pow(r(), 0.7) * 2.6;
      return [Math.cos(a) * d * 1.3, (r() - 0.5) * 2.2, Math.sin(a) * d * 0.6 - 0.6];
    },
    0.1,
    0,
  );
}

const BUILDERS = [dot, design, development, software, automation, data, ml, dust];

/** Formation order: 0 hero sphere, 1–6 the disciplines, 7 dust. */
export const FORMATION = { hero: 0, design: 1, development: 2, software: 3, automation: 4, data: 5, ml: 6, dust: 7 } as const;
export type FormationId = keyof typeof FORMATION;

export function buildFormations(count: number) {
  return BUILDERS.map((f) => f(count));
}

/** One formation only, for the quieter fields behind inner pages. */
export function buildFormation(id: FormationId, count: number) {
  return BUILDERS[FORMATION[id]](count);
}

/** Per-point random values: stagger, size and drift direction. */
export function buildRandoms(count: number) {
  const r = rng(7);
  const out = new Float32Array(count * 3);
  for (let i = 0; i < out.length; i++) out[i] = r();
  return out;
}

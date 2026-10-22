/**
 * The v10 point engine: one WebGL program that morphs a cloud of points between
 * formations. Shared by the homepage world (scroll-driven, 8 formations) and the quieter
 * fields behind inner pages (one formation, slow drift).
 *
 * Colours come from the page's CSS tokens via `setPalette`, so a theme or accent switch
 * only updates uniforms — the context, buffers and program are never rebuilt.
 */

const VERT = `
attribute vec3 aFrom; attribute vec3 aTo; attribute vec3 aRnd;
uniform float uMix; uniform float uTime; uniform float uBloom; uniform float uAspect; uniform float uScale;
uniform float uDim; uniform float uDpr; uniform float uSize; uniform float uMotion; uniform float uAccFrac;
uniform vec2 uOff; uniform vec2 uMouse; uniform vec2 uRot;
varying float vA; varying float vAcc;
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
  vAcc = step(fract(aRnd.x * 97.31 + aRnd.z * 13.7), uAccFrac);
  gl_PointSize = uSize * uDpr * (0.55 + aRnd.z * 0.9) * (3.6 / w) * (1.0 + vAcc * 0.5);
  vA = (0.3 + 0.7 * depth) * uDim * (0.82 + 0.18 * sin(uTime * 1.7 + aRnd.x * 50.0) * uMotion) * b;
}`;

const FRAG = `
precision mediump float;
uniform vec3 uCol; uniform vec3 uAcc; uniform float uGain;
varying float vA; varying float vAcc;
void main(){
  float r = length(gl_PointCoord - 0.5);
  vec3 c = mix(uCol, uAcc, vAcc);
  gl_FragColor = vec4(c, clamp(smoothstep(0.5, 0.18, r) * vA * uGain, 0.0, 1.0));
}`;

export type Palette = { bg: [number, number, number]; fg: [number, number, number]; accent: [number, number, number]; light: boolean; mono: boolean };

/** Resolve the page's colour tokens to RGB (0–1) by letting the browser compute them. */
export function readPalette(el: HTMLElement): Palette {
  const probe = document.createElement("span");
  probe.style.display = "none";
  el.appendChild(probe);
  const rgb = (v: string): [number, number, number] => {
    probe.style.color = "";
    probe.style.color = `var(${v})`;
    const m = getComputedStyle(probe).color.match(/[\d.]+/g) ?? ["0", "0", "0"];
    return [Number(m[0]) / 255, Number(m[1]) / 255, Number(m[2]) / 255];
  };
  const p = { bg: rgb("--bg"), fg: rgb("--fg"), accent: rgb("--accent") };
  probe.remove();
  const lum = (c: number[]) => 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
  const mono = p.accent.every((v, i) => Math.abs(v - p.fg[i]) < 0.01);
  return { ...p, light: lum(p.bg) > 0.5, mono };
}

export type EngineState = {
  /** Current formation index and morph amount towards the next one (0–1). */
  k: number;
  mix: number;
};

export type EngineOptions = {
  canvas: HTMLCanvasElement;
  count: number;
  formations: Float32Array[];
  randoms: Float32Array;
  state: EngineState;
  /** Read every frame: paused stops drift/rotation, reduced skips the bloom. */
  motion: () => { paused: boolean; reduced: boolean };
  /** Screen offset (NDC) and brightness per formation; `tall` is a portrait viewport. */
  offset: (k: number, tall: boolean) => [number, number];
  dim: (k: number) => number;
  size: (tall: boolean) => number;
  /** Rotation speed in radians per second while not paused. */
  spin?: number;
  /** Whether the pointer pushes points and tilts the field. */
  interactive?: boolean;
  bloomMs?: [number, number];
};

export type Engine = { dirty: () => void; setPalette: (p: Palette) => void; destroy: () => void };

export function startEngine(o: EngineOptions): Engine | null {
  const { canvas } = o;
  const gl = canvas.getContext("webgl", { antialias: false, alpha: false, powerPreference: "high-performance" });
  if (!gl) return null;
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
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return null;
  gl.useProgram(prog);

  const buffers = o.formations.map((data) => {
    const b = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, b);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
    return b;
  });
  const rndBuf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, rndBuf);
  gl.bufferData(gl.ARRAY_BUFFER, o.randoms, gl.STATIC_DRAW);
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
    col: u("uCol"),
    acc: u("uAcc"),
    accFrac: u("uAccFrac"),
    gain: u("uGain"),
  };
  gl.enable(gl.BLEND);

  let palette: Palette = { bg: [0, 0, 0], fg: [1, 1, 1], accent: [1, 1, 1], light: false, mono: true };
  let dirty = true;
  const applyPalette = () => {
    const p = palette;
    gl.clearColor(p.bg[0], p.bg[1], p.bg[2], 1);
    // White light adds up on black; ink on paper has to cover, not add.
    if (p.light) gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    else gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
    gl.uniform3f(U.col, p.fg[0], p.fg[1], p.fg[2]);
    gl.uniform3f(U.acc, p.accent[0], p.accent[1], p.accent[2]);
    gl.uniform1f(U.accFrac, p.mono ? 0 : 0.05);
    gl.uniform1f(U.gain, p.light ? 1.9 : 1);
    dirty = true;
  };
  applyPalette();

  let w = 0;
  let h = 0;
  let dpr = 1;
  const resize = () => {
    dpr = Math.min(devicePixelRatio || 1, 2);
    w = canvas.width = Math.max(1, Math.round(canvas.clientWidth * dpr));
    h = canvas.height = Math.max(1, Math.round(canvas.clientHeight * dpr));
    gl.viewport(0, 0, w, h);
    dirty = true;
  };
  resize();
  const ro = new ResizeObserver(resize);
  ro.observe(canvas);

  const interactive = o.interactive ?? true;
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
  if (interactive) {
    addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
  }

  // Stop drawing while the canvas is off screen (inner pages scroll it away).
  let visible = true;
  const io = new IntersectionObserver(([e]) => {
    visible = e.isIntersecting;
    dirty = true;
  });
  io.observe(canvas);

  const smooth = (a: number, b: number, x: number) => {
    const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
    return t * t * (3 - 2 * t);
  };
  const [b0, b1] = o.bloomMs ?? [700, 2300];
  const spin = o.spin ?? 0.06;
  let bound = -1;
  let boundNext = -1;
  let time = 0;
  let last = performance.now();
  const start = last;
  let raf = 0;
  const frame = (now: number) => {
    raf = requestAnimationFrame(frame);
    if (!visible) return;
    const { paused: still, reduced: calm } = o.motion();
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    const bloom = calm ? 1 : smooth(b0, b1, now - start);
    const tracking = interactive && mouse.x !== 9;
    if (!still) time += dt;
    const settle = Math.abs(mouse.tx - mouse.x) + Math.abs(mouse.ty - mouse.y);
    if (tracking) {
      mouse.x += (mouse.tx - mouse.x) * 0.08;
      mouse.y += (mouse.ty - mouse.y) * 0.08;
    }
    const tx = tracking && !still ? mouse.x : 0;
    const ty = tracking && !still ? mouse.y : 0;
    mouse.rx += (tx - mouse.rx) * 0.05;
    mouse.ry += (ty - mouse.ry) * 0.05;
    if (still && !dirty && bloom >= 1 && settle < 1e-3 && Math.abs(mouse.rx) + Math.abs(mouse.ry) < 1e-3) return;
    dirty = false;

    const k = Math.min(o.state.k, buffers.length - 1);
    const next = Math.min(k + 1, buffers.length - 1);
    if (bound !== k || boundNext !== next) {
      attach(aFrom, buffers[k]);
      attach(aTo, buffers[next]);
      bound = k;
      boundNext = next;
    }
    const tall = h > w;
    const m = o.state.mix;
    const aspect = w / h;
    const [ox0, oy0] = o.offset(k, tall);
    const [ox1, oy1] = o.offset(next, tall);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.uniform1f(U.mix, m);
    gl.uniform1f(U.time, time);
    gl.uniform1f(U.bloom, bloom);
    gl.uniform1f(U.aspect, aspect);
    gl.uniform1f(U.scale, tall ? Math.min(1, aspect * 1.3) : 1);
    gl.uniform1f(U.dim, o.dim(k) + (o.dim(next) - o.dim(k)) * m);
    gl.uniform1f(U.dpr, dpr);
    gl.uniform1f(U.size, o.size(tall));
    gl.uniform1f(U.motion, still ? 0 : 1);
    gl.uniform2f(U.off, ox0 + (ox1 - ox0) * m, oy0 + (oy1 - oy0) * m);
    gl.uniform2f(U.mouse, tracking && !still ? mouse.x : 9, tracking && !still ? mouse.y : 9);
    gl.uniform2f(U.rot, (still ? 0 : time * spin) + mouse.rx * 0.35, -mouse.ry * 0.2);
    gl.drawArrays(gl.POINTS, 0, o.count);
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

  return {
    dirty: () => {
      dirty = true;
    },
    setPalette: (p) => {
      palette = p;
      applyPalette();
    },
    destroy: () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("visibilitychange", onVis);
    },
  };
}

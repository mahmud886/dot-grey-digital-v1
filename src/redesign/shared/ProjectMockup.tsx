/**
 * Monochrome UI concept mockups for the nine case studies — product screens, emails and
 * identity sheets drawn in SVG, specific to each project. They replace the blurred
 * placeholder images until real project imagery exists, and carry a small "Concept visual"
 * tag so nobody mistakes them for shipped client work.
 *
 * Pure SVG, server-rendered. Colours come in as props (CSS variables work), and every grey
 * is mixed from ink and paper so the same mockup reads in light and dark themes.
 */
import type { CSSProperties, ReactNode } from "react";
import { MOCKUPS, type MockupKind } from "./mockups";

type Props = {
  slug: string;
  /** 0 hero screen · 1 mobile · 2 detail · 3 system overview */
  frame?: number;
  ink?: string;
  paper?: string;
  /** One highlight colour (primary buttons, the active state). Defaults to ink. */
  accent?: string;
  /** viewBox width / height. Content is designed at 16:10 and fitted inside. */
  ratio?: number;
  /** Show the small "Concept visual" tag. */
  label?: boolean;
  className?: string;
  style?: CSSProperties;
  title?: string;
};

const W = 1600;
const H = 1000;
const FONT = "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Helvetica, Arial, sans-serif";

type C = { ink: string; paper: string; accent: string; m: (pct: number) => string };

/* --- Primitives ------------------------------------------------------------ */

const Bar = ({ x, y, w, h = 12, c, p = 18 }: { x: number; y: number; w: number; h?: number; c: C; p?: number }) => (
  <rect x={x} y={y} width={w} height={h} rx={h / 2} style={{ fill: c.m(p) }} />
);

function T({ x, y, s = 20, w = 500, c, p = 100, anchor, children, ls }: { x: number; y: number; s?: number; w?: number; c: C; p?: number; anchor?: "start" | "middle" | "end"; children: ReactNode; ls?: number }) {
  return (
    <text x={x} y={y} fontSize={s} fontWeight={w} fontFamily={FONT} textAnchor={anchor} letterSpacing={ls ?? (s > 40 ? -s * 0.03 : 0)} style={{ fill: c.m(p) }}>
      {children}
    </text>
  );
}

const Box = ({ x, y, w, h, r = 14, c, p = 0, stroke = 10, sw = 1.5 }: { x: number; y: number; w: number; h: number; r?: number; c: C; p?: number; stroke?: number; sw?: number }) => (
  <rect x={x} y={y} width={w} height={h} rx={r} style={{ fill: c.m(p), stroke: c.m(stroke), strokeWidth: sw }} />
);

function Btn({ x, y, w, h = 44, c, label, solid = true, s = 15 }: { x: number; y: number; w: number; h?: number; c: C; label: string; solid?: boolean; s?: number }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={h / 2} style={solid ? { fill: c.accent } : { fill: "none", stroke: c.m(40), strokeWidth: 1.5 }} />
      <text x={x + w / 2} y={y + h / 2 + s * 0.36} fontSize={s} fontWeight={600} fontFamily={FONT} textAnchor="middle" style={{ fill: solid ? c.paper : c.m(90) }}>
        {label}
      </text>
    </g>
  );
}

/** Desktop browser window; children are drawn in window coordinates (0,0 = content top-left). */
function Browser({ x, y, w, h, c, url, children }: { x: number; y: number; w: number; h: number; c: C; url: string; children: ReactNode }) {
  return (
    <g>
      <rect x={x + 10} y={y + 24} width={w} height={h} rx={18} style={{ fill: c.m(12) }} opacity={0.5} />
      <rect x={x} y={y} width={w} height={h} rx={18} style={{ fill: c.paper, stroke: c.m(14), strokeWidth: 1.5 }} />
      <path d={`M${x} ${y + 52}H${x + w}`} style={{ stroke: c.m(10), strokeWidth: 1.5 }} />
      {[0, 1, 2].map((i) => (
        <circle key={i} cx={x + 26 + i * 20} cy={y + 26} r={6} style={{ fill: c.m(16) }} />
      ))}
      <rect x={x + w / 2 - 170} y={y + 13} width={340} height={26} rx={13} style={{ fill: c.m(6) }} />
      <T x={x + w / 2} y={y + 31} s={13} w={500} c={c} p={45} anchor="middle">
        {url}
      </T>
      <svg x={x} y={y + 53} width={w} height={h - 53} overflow="hidden">
        {children}
      </svg>
    </g>
  );
}

/** Phone; children in screen coordinates. */
function Phone({ x, y, w = 300, h = 620, c, children }: { x: number; y: number; w?: number; h?: number; c: C; children: ReactNode }) {
  const b = 12;
  return (
    <g>
      <rect x={x + 8} y={y + 20} width={w} height={h} rx={44} style={{ fill: c.m(12) }} opacity={0.5} />
      <rect x={x} y={y} width={w} height={h} rx={44} style={{ fill: c.m(88) }} />
      <rect x={x + b} y={y + b} width={w - 2 * b} height={h - 2 * b} rx={34} style={{ fill: c.paper }} />
      <rect x={x + w / 2 - 44} y={y + b + 10} width={88} height={24} rx={12} style={{ fill: c.m(88) }} />
      <svg x={x + b} y={y + b + 44} width={w - 2 * b} height={h - 2 * b - 56} overflow="hidden">
        {children}
      </svg>
    </g>
  );
}

function Avatar({ x, y, r = 18, c, p = 22, initials }: { x: number; y: number; r?: number; c: C; p?: number; initials?: string }) {
  return (
    <g>
      <circle cx={x} cy={y} r={r} style={{ fill: c.m(p) }} />
      {initials && (
        <text x={x} y={y + r * 0.34} fontSize={r * 0.9} fontWeight={600} fontFamily={FONT} textAnchor="middle" style={{ fill: c.paper }}>
          {initials}
        </text>
      )}
    </g>
  );
}

function Line({ pts, c, p = 90, sw = 3, fill }: { pts: [number, number][]; c: C; p?: number; sw?: number; fill?: number }) {
  const d = pts.map(([px, py], i) => `${i ? "L" : "M"}${px} ${py}`).join("");
  const last = pts[pts.length - 1];
  return (
    <g>
      {fill !== undefined && <path d={`${d}L${last[0]} ${Math.max(...pts.map((q) => q[1])) + 60}L${pts[0][0]} ${Math.max(...pts.map((q) => q[1])) + 60}Z`} style={{ fill: c.m(fill) }} />}
      <path d={d} style={{ fill: "none", stroke: c.m(p), strokeWidth: sw, strokeLinejoin: "round", strokeLinecap: "round" }} />
    </g>
  );
}

/** Deterministic wave for charts. */
const wave = (n: number, x0: number, x1: number, yMid: number, amp: number, seed: number) =>
  Array.from({ length: n }, (_, i) => {
    const t = i / (n - 1);
    return [x0 + (x1 - x0) * t, yMid - amp * (0.55 * Math.sin(t * 6.2 + seed) + 0.35 * Math.sin(t * 13 + seed * 2) + t * 0.9)] as [number, number];
  });

/* --- Screens by project ----------------------------------------------------- */

type Screen = (c: C, w: number, h: number) => ReactNode;

const SIDEBAR = (c: C, h: number, items: string[], active = 1, brand = "") => (
  <g>
    <rect x={0} y={0} width={220} height={h} style={{ fill: c.m(4) }} />
    <T x={28} y={46} s={18} w={700} c={c}>
      {brand}
    </T>
    {items.map((it, i) => (
      <g key={it}>
        {i === active && <rect x={14} y={78 + i * 44} width={192} height={36} rx={10} style={{ fill: c.m(10) }} />}
        <rect x={30} y={90 + i * 44} width={12} height={12} rx={3} style={{ fill: c.m(i === active ? 80 : 30) }} />
        <T x={54} y={101 + i * 44} s={14} w={i === active ? 600 : 450} c={c} p={i === active ? 95 : 55}>
          {it}
        </T>
      </g>
    ))}
  </g>
);

const desktop: Record<string, Screen> = {
  workday: (c, w, h) => {
    const rows = [
      ["Annual leave · 3 days", "Priya S.", "PS"],
      ["Expense · Client dinner", "Omar K.", "OK"],
      ["Overtime · 6 hours", "Lena M.", "LM"],
      ["Equipment · Monitor", "Ravi D.", "RD"],
      ["Travel · Chittagong", "Sara A.", "SA"],
    ];
    return (
      <g>
        {SIDEBAR(c, h, ["Home", "Approvals", "Team", "Time off", "Reports"], 1, "Workday")}
        <T x={260} y={70} s={34} w={700} c={c}>
          Approvals
        </T>
        <T x={260} y={100} s={15} w={450} c={c} p={50}>
          5 waiting · approve in two taps
        </T>
        <Btn x={w - 220} y={46} w={180} c={c} label="Approve all" />
        {rows.map(([what, who, ini], i) => {
          const y = 140 + i * 92;
          return (
            <g key={what}>
              <Box x={260} y={y} w={w - 300} h={78} r={14} c={c} p={i === 0 ? 5 : 0} stroke={i === 0 ? 30 : 10} />
              <Avatar x={300} y={y + 39} c={c} initials={ini} p={i === 0 ? 80 : 30} />
              <T x={334} y={y + 34} s={16} w={600} c={c}>
                {what}
              </T>
              <T x={334} y={y + 56} s={13} w={450} c={c} p={50}>
                {who} · submitted {i + 1}h ago
              </T>
              <Btn x={w - 300} y={y + 18} w={110} h={42} c={c} label="Decline" solid={false} s={14} />
              <Btn x={w - 176} y={y + 18} w={110} h={42} c={c} label="Approve" s={14} />
            </g>
          );
        })}
      </g>
    );
  },
  "hakkas-dine": (c, w, h) => (
    <g>
      <T x={48} y={50} s={22} w={800} c={c} ls={-0.5}>
        Hakka&apos;s Dine
      </T>
      {["Menu", "Book", "Delivery", "About"].map((n, i) => (
        <T key={n} x={w - 470 + i * 90} y={48} s={15} w={500} c={c} p={60}>
          {n}
        </T>
      ))}
      <Btn x={w - 120} y={22} w={90} h={38} c={c} label="Order" s={14} />
      <T x={48} y={210} s={76} w={800} c={c}>
        Hand-pulled
      </T>
      <T x={48} y={290} s={76} w={800} c={c}>
        noodles, ordered
      </T>
      <T x={48} y={370} s={76} w={300} c={c} p={45}>
        direct.
      </T>
      <Bar x={50} y={410} w={380} c={c} />
      <Bar x={50} y={434} w={300} c={c} />
      <Btn x={48} y={480} w={170} h={52} c={c} label="Order now" s={16} />
      <Btn x={232} y={480} w={170} h={52} c={c} label="Book a table" solid={false} s={16} />
      <circle cx={w - 330} cy={300} r={230} style={{ fill: c.m(8) }} />
      <circle cx={w - 330} cy={300} r={180} style={{ fill: c.paper, stroke: c.m(20), strokeWidth: 2 }} />
      {Array.from({ length: 9 }, (_, i) => (
        <path key={i} d={`M${w - 450 + i * 10} ${250 + i * 6} C ${w - 380} ${200 + i * 14}, ${w - 300} ${360 - i * 10}, ${w - 220} ${290 + i * 7}`} style={{ fill: "none", stroke: c.m(70), strokeWidth: 4, strokeLinecap: "round" }} />
      ))}
      <circle cx={w - 270} cy={240} r={22} style={{ fill: c.m(55) }} />
      <circle cx={w - 395} cy={360} r={16} style={{ fill: c.m(35) }} />
      {[0, 1, 2].map((i) => {
        const x = 48 + i * ((w - 96) / 3);
        return (
          <g key={i}>
            <Box x={x} y={590} w={(w - 96) / 3 - 20} h={h - 610} r={16} c={c} p={4} stroke={8} />
            <circle cx={x + 60} cy={650} r={34} style={{ fill: c.m(14 + i * 6) }} />
            <T x={x + 112} y={644} s={16} w={600} c={c}>
              {["Dan dan noodles", "Salt & pepper squid", "Pork belly bao"][i]}
            </T>
            <T x={x + 112} y={668} s={14} w={500} c={c} p={50}>
              {["৳ 420", "৳ 560", "৳ 380"][i]}
            </T>
          </g>
        );
      })}
    </g>
  ),
  "medicove-intl": (c, w) => {
    const steps = ["Account", "About you", "Insurance", "Confirm"];
    return (
      <g>
        <T x={48} y={48} s={20} w={700} c={c}>
          Medicove
        </T>
        <T x={w - 48} y={48} s={14} w={500} c={c} p={50} anchor="end">
          Need help? Chat with us
        </T>
        <rect x={w / 2 - 330} y={96} width={660} height={4} rx={2} style={{ fill: c.m(10) }} />
        <rect x={w / 2 - 330} y={96} width={330} height={4} rx={2} style={{ fill: c.accent }} />
        {steps.map((s, i) => {
          const x = w / 2 - 330 + i * 220;
          const done = i < 2;
          return (
            <g key={s}>
              <circle cx={x} cy={98} r={14} style={{ fill: done ? c.accent : c.paper, stroke: done ? c.accent : c.m(30), strokeWidth: 2 }} />
              <T x={x} y={103} s={12} w={700} c={c} p={done ? 0 : 50} anchor="middle">
                {done ? "✓" : String(i + 1)}
              </T>
              <T x={x} y={136} s={13} w={i === 1 ? 650 : 450} c={c} p={i === 1 ? 95 : 50} anchor="middle">
                {s}
              </T>
            </g>
          );
        })}
        <T x={w / 2} y={220} s={40} w={700} c={c} anchor="middle">
          Tell us about you
        </T>
        <T x={w / 2} y={254} s={16} w={450} c={c} p={50} anchor="middle">
          Step 2 of 4 · about two minutes
        </T>
        {[
          ["Full name", "Nadia Rahman"],
          ["Date of birth", "14 / 03 / 1990"],
          ["Phone", "+880 17 …"],
        ].map(([l, v], i) => (
          <g key={l}>
            <T x={w / 2 - 260} y={312 + i * 96} s={13} w={600} c={c} p={60}>
              {l}
            </T>
            <Box x={w / 2 - 260} y={324 + i * 96} w={520} h={52} r={12} c={c} stroke={i === 2 ? 70 : 16} sw={i === 2 ? 2 : 1.5} />
            <T x={w / 2 - 240} y={357 + i * 96} s={16} w={450} c={c} p={i === 2 ? 40 : 85}>
              {v}
            </T>
          </g>
        ))}
        <Btn x={w / 2 - 260} y={630} w={520} h={54} c={c} label="Continue" s={16} />
        <T x={w / 2} y={716} s={13} w={450} c={c} p={45} anchor="middle">
          Your details are encrypted and only shared with your doctor.
        </T>
      </g>
    );
  },
  "fintech-pro": (c, w, h) => (
    <g>
      {SIDEBAR(c, h, ["Overview", "Accounts", "Payments", "Insights", "Settings"], 0, "Fintech Pro")}
      <T x={260} y={66} s={30} w={700} c={c}>
        Good morning, Tanvir
      </T>
      <T x={260} y={94} s={14} w={450} c={c} p={50}>
        Here is where your money moved this week.
      </T>
      {[
        ["Balance", "৳ 4,82,310", "+2.4%"],
        ["Spent this month", "৳ 61,940", "−8.1%"],
        ["Saved", "৳ 25,000", "On track"],
      ].map(([l, v, d], i) => {
        const cw = (w - 300) / 3;
        const x = 260 + i * cw;
        return (
          <g key={l}>
            <Box x={x} y={124} w={cw - 20} h={120} r={16} c={c} p={i === 0 ? 92 : 0} stroke={i === 0 ? 92 : 10} />
            <T x={x + 24} y={160} s={13} w={500} c={c} p={i === 0 ? 30 : 50}>
              {l}
            </T>
            <text x={x + 24} y={206} fontSize={30} fontWeight={700} fontFamily={FONT} letterSpacing={-0.8} style={{ fill: i === 0 ? c.paper : c.ink }}>
              {v}
            </text>
            <T x={x + 24} y={230} s={13} w={600} c={c} p={i === 0 ? 30 : 60}>
              {d}
            </T>
          </g>
        );
      })}
      <Box x={260} y={268} w={(w - 300) * 0.64} h={h - 300} r={16} c={c} />
      <T x={284} y={302} s={16} w={650} c={c}>
        Cash flow
      </T>
      {[0, 1, 2, 3].map((i) => (
        <path key={i} d={`M284 ${360 + i * 70}H${260 + (w - 300) * 0.64 - 24}`} style={{ stroke: c.m(8), strokeWidth: 1 }} />
      ))}
      <Line pts={wave(24, 290, 260 + (w - 300) * 0.64 - 30, 520, 90, 1)} c={c} p={90} sw={3.5} fill={6} />
      <Line pts={wave(24, 290, 260 + (w - 300) * 0.64 - 30, 560, 50, 3)} c={c} p={35} sw={2.5} />
      <Box x={260 + (w - 300) * 0.64 + 20} y={268} w={(w - 300) * 0.36 - 20} h={h - 300} r={16} c={c} />
      <T x={260 + (w - 300) * 0.64 + 44} y={302} s={16} w={650} c={c}>
        Recent
      </T>
      {["Grocer", "Salary", "Electricity", "Transfer", "Coffee"].map((n, i) => (
        <g key={n}>
          <circle cx={260 + (w - 300) * 0.64 + 60} cy={346 + i * 56} r={16} style={{ fill: c.m(12) }} />
          <T x={260 + (w - 300) * 0.64 + 88} y={351 + i * 56} s={14} w={550} c={c}>
            {n}
          </T>
          <T x={w - 64} y={351 + i * 56} s={14} w={600} c={c} p={i === 1 ? 95 : 60} anchor="end">
            {["−৳ 1,240", "+৳ 95,000", "−৳ 2,310", "−৳ 10,000", "−৳ 280"][i]}
          </T>
        </g>
      ))}
    </g>
  ),
  "parallel-labs": (c, w, h) => (
    <g>
      <rect x={0} y={0} width={260} height={h} style={{ fill: c.m(4) }} />
      <T x={24} y={44} s={17} w={700} c={c}>
        Parallel
      </T>
      <Box x={18} y={66} w={224} h={36} r={10} c={c} p={0} stroke={12} />
      <T x={34} y={89} s={13} w={450} c={c} p={45}>
        Search notes…
      </T>
      {["Interview — clinic leads", "Survey synthesis Q3", "Pricing hypotheses", "Onboarding diary", "Churn reasons"].map((n, i) => (
        <g key={n}>
          {i === 0 && <rect x={12} y={120 + i * 52} width={236} height={46} rx={10} style={{ fill: c.m(10) }} />}
          <T x={26} y={140 + i * 52} s={14} w={i === 0 ? 650 : 500} c={c} p={i === 0 ? 95 : 70}>
            {n}
          </T>
          <T x={26} y={158 + i * 52} s={11} w={450} c={c} p={45}>
            {["Edited 2h ago", "Yesterday", "Mon", "Last week", "Sep 2"][i]}
          </T>
        </g>
      ))}
      <rect x={300} y={28} width={w - 640} height={58} rx={14} style={{ fill: c.m(92) }} />
      <text x={326} y={64} fontSize={15} fontWeight={600} fontFamily={FONT} style={{ fill: c.paper }}>
        Resume where you left off — line 42, &ldquo;scheduling friction&rdquo;
      </text>
      <T x={300} y={140} s={30} w={700} c={c}>
        Interview — clinic leads
      </T>
      {Array.from({ length: 10 }, (_, i) => (
        <g key={i}>
          <Bar x={300} y={176 + i * 40} w={(w - 640) * [0.95, 0.9, 0.7, 0.92, 0.85, 0.6, 0.94, 0.8, 0.88, 0.5][i]} h={12} c={c} p={i === 3 || i === 4 ? 12 : 14} />
          {(i === 3 || i === 4) && <rect x={296} y={168 + i * 40} width={(w - 640) * (i === 3 ? 0.62 : 0.4)} height={28} rx={6} style={{ fill: c.m(14) }} opacity={0.8} />}
        </g>
      ))}
      <rect x={w - 320} y={0} width={320} height={h} style={{ fill: c.m(3) }} />
      <T x={w - 296} y={44} s={15} w={650} c={c}>
        Highlights · 3
      </T>
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <Box x={w - 296} y={66 + i * 130} w={272} h={116} r={12} c={c} />
          <rect x={w - 296} y={66 + i * 130} width={4} height={116} rx={2} style={{ fill: c.m(i === 0 ? 90 : 30) }} />
          <Bar x={w - 276} y={88 + i * 130} w={220} c={c} />
          <Bar x={w - 276} y={110 + i * 130} w={180} c={c} />
          <Bar x={w - 276} y={132 + i * 130} w={120} c={c} p={10} />
          <T x={w - 276} y={168 + i * 130} s={11} w={600} c={c} p={50}>
            {["SCHEDULING", "TRUST", "PRICE"][i]}
          </T>
        </g>
      ))}
    </g>
  ),
};

const mobile: Record<string, Screen> = {
  workday: (c, w) => (
    <g>
      <T x={20} y={40} s={24} w={700} c={c}>
        Approvals
      </T>
      <T x={20} y={64} s={12} w={450} c={c} p={50}>
        5 waiting
      </T>
      <Box x={14} y={84} w={w - 28} h={210} r={18} c={c} p={92} stroke={92} />
      <Avatar x={52} y={124} c={c} initials="PS" p={30} />
      <text x={84} y={120} fontSize={15} fontWeight={600} fontFamily={FONT} style={{ fill: c.paper }}>
        Annual leave
      </text>
      <text x={84} y={140} fontSize={12} fontFamily={FONT} style={{ fill: c.m(30) }}>
        Priya S. · 3 days
      </text>
      <rect x={30} y={168} width={w - 60} height={1} style={{ fill: c.m(70) }} />
      <text x={30} y={200} fontSize={12} fontFamily={FONT} style={{ fill: c.m(30) }}>
        12 – 14 Nov · 9 days left
      </text>
      <rect x={30} y={226} width={(w - 72) / 2} height={46} rx={23} style={{ fill: "none", stroke: c.m(50), strokeWidth: 1.5 }} />
      <text x={30 + (w - 72) / 4} y={254} fontSize={14} fontWeight={600} fontFamily={FONT} textAnchor="middle" style={{ fill: c.paper }}>
        Decline
      </text>
      <rect x={42 + (w - 72) / 2} y={226} width={(w - 72) / 2} height={46} rx={23} style={{ fill: c.paper }} />
      <text x={42 + ((w - 72) * 3) / 4} y={254} fontSize={14} fontWeight={700} fontFamily={FONT} textAnchor="middle" style={{ fill: c.ink }}>
        Approve
      </text>
      {[0, 1, 2, 3].map((i) => (
        <g key={i}>
          <Avatar x={34} y={334 + i * 66} r={16} c={c} p={22} />
          <Bar x={60} y={322 + i * 66} w={120} c={c} p={30} h={11} />
          <Bar x={60} y={340 + i * 66} w={80} c={c} h={9} />
          <circle cx={w - 36} cy={334 + i * 66} r={16} style={{ fill: c.m(8) }} />
          <path d={`M${w - 43} ${334 + i * 66}l5 5 9-10`} style={{ fill: "none", stroke: c.m(80), strokeWidth: 2.5 }} />
        </g>
      ))}
    </g>
  ),
  "hakkas-dine": (c, w) => (
    <g>
      <T x={20} y={34} s={17} w={800} c={c}>
        Hakka&apos;s Dine
      </T>
      <circle cx={w / 2} cy={160} r={96} style={{ fill: c.m(8) }} />
      <circle cx={w / 2} cy={160} r={74} style={{ fill: c.paper, stroke: c.m(20), strokeWidth: 2 }} />
      {Array.from({ length: 6 }, (_, i) => (
        <path key={i} d={`M${w / 2 - 50 + i * 6} ${150 + i * 4} C ${w / 2 - 20} ${120 + i * 8}, ${w / 2 + 10} ${200 - i * 6}, ${w / 2 + 50} ${160 + i * 3}`} style={{ fill: "none", stroke: c.m(70), strokeWidth: 3, strokeLinecap: "round" }} />
      ))}
      <T x={20} y={300} s={22} w={700} c={c}>
        Dan dan noodles
      </T>
      <T x={20} y={322} s={13} w={450} c={c} p={50}>
        Chilli oil, pork, peanuts
      </T>
      <T x={w - 20} y={300} s={18} w={700} c={c} anchor="end">
        ৳ 420
      </T>
      {["Small", "Regular", "Large"].map((s, i) => (
        <g key={s}>
          <rect x={20 + i * ((w - 40) / 3)} y={344} width={(w - 40) / 3 - 8} height={36} rx={18} style={i === 1 ? { fill: c.ink } : { fill: "none", stroke: c.m(25), strokeWidth: 1.5 }} />
          <text x={20 + i * ((w - 40) / 3) + ((w - 40) / 3 - 8) / 2} y={367} fontSize={13} fontWeight={600} fontFamily={FONT} textAnchor="middle" style={{ fill: i === 1 ? c.paper : c.m(70) }}>
            {s}
          </text>
        </g>
      ))}
      <Bar x={20} y={404} w={w - 60} c={c} h={10} />
      <Bar x={20} y={422} w={w - 120} c={c} h={10} />
      <Btn x={20} y={468} w={w - 40} h={50} c={c} label="Add to order · ৳ 420" s={15} />
    </g>
  ),
  "medicove-intl": (c, w) => (
    <g>
      <rect x={20} y={20} width={w - 40} height={4} rx={2} style={{ fill: c.m(10) }} />
      <rect x={20} y={20} width={(w - 40) * 0.75} height={4} rx={2} style={{ fill: c.accent }} />
      <T x={20} y={52} s={12} w={600} c={c} p={50}>
        STEP 3 OF 4
      </T>
      <T x={20} y={88} s={24} w={700} c={c}>
        Your insurance
      </T>
      {["I have insurance", "I'll pay myself", "Not sure yet"].map((s, i) => (
        <g key={s}>
          <Box x={20} y={114 + i * 70} w={w - 40} h={56} r={14} c={c} stroke={i === 0 ? 80 : 14} sw={i === 0 ? 2 : 1.5} />
          <circle cx={46} cy={142 + i * 70} r={9} style={{ fill: i === 0 ? c.accent : "none", stroke: c.m(i === 0 ? 90 : 30), strokeWidth: 2 }} />
          <T x={66} y={147 + i * 70} s={14} w={i === 0 ? 650 : 450} c={c}>
            {s}
          </T>
        </g>
      ))}
      <T x={20} y={346} s={12} w={600} c={c} p={60}>
        Provider
      </T>
      <Box x={20} y={356} w={w - 40} h={46} r={12} c={c} stroke={16} />
      <T x={36} y={385} s={14} w={450} c={c} p={70}>
        Green Delta Health
      </T>
      <Btn x={20} y={440} w={w - 40} h={50} c={c} label="Continue" s={15} />
    </g>
  ),
  "fintech-pro": (c, w) => (
    <g>
      <T x={20} y={34} s={13} w={500} c={c} p={50}>
        Total balance
      </T>
      <T x={20} y={72} s={32} w={700} c={c}>
        ৳ 4,82,310
      </T>
      <Line pts={wave(14, 20, w - 20, 160, 40, 2)} c={c} sw={3} fill={6} />
      {["1W", "1M", "3M", "1Y"].map((s, i) => (
        <g key={s}>
          <rect x={20 + i * ((w - 40) / 4)} y={232} width={(w - 40) / 4 - 8} height={30} rx={15} style={{ fill: i === 1 ? c.ink : c.m(6) }} />
          <text x={20 + i * ((w - 40) / 4) + ((w - 40) / 4 - 8) / 2} y={252} fontSize={12} fontWeight={600} fontFamily={FONT} textAnchor="middle" style={{ fill: i === 1 ? c.paper : c.m(60) }}>
            {s}
          </text>
        </g>
      ))}
      <T x={20} y={300} s={15} w={650} c={c}>
        Recent
      </T>
      {["Grocer", "Salary", "Electricity", "Coffee"].map((n, i) => (
        <g key={n}>
          <circle cx={36} cy={330 + i * 50} r={15} style={{ fill: c.m(10) }} />
          <T x={60} y={335 + i * 50} s={13} w={550} c={c}>
            {n}
          </T>
          <T x={w - 20} y={335 + i * 50} s={13} w={600} c={c} p={60} anchor="end">
            {["−1,240", "+95,000", "−2,310", "−280"][i]}
          </T>
        </g>
      ))}
    </g>
  ),
  "parallel-labs": (c, w) => (
    <g>
      <rect x={14} y={14} width={w - 28} height={64} rx={16} style={{ fill: c.m(92) }} />
      <text x={30} y={42} fontSize={12} fontWeight={600} fontFamily={FONT} style={{ fill: c.m(35) }}>
        RESUME
      </text>
      <text x={30} y={62} fontSize={14} fontWeight={600} fontFamily={FONT} style={{ fill: c.paper }}>
        Clinic leads · line 42
      </text>
      <T x={20} y={118} s={20} w={700} c={c}>
        Highlights
      </T>
      {[0, 1, 2, 3].map((i) => (
        <g key={i}>
          <Box x={14} y={136 + i * 92} w={w - 28} h={80} r={14} c={c} />
          <rect x={14} y={136 + i * 92} width={4} height={80} rx={2} style={{ fill: c.m(i ? 30 : 90) }} />
          <Bar x={30} y={154 + i * 92} w={w - 80} c={c} h={10} />
          <Bar x={30} y={172 + i * 92} w={w - 120} c={c} h={10} />
          <T x={30} y={204 + i * 92} s={10} w={600} c={c} p={50}>
            {["SCHEDULING", "TRUST", "PRICE", "SUPPORT"][i]}
          </T>
        </g>
      ))}
    </g>
  ),
};

/* --- Email ----------------------------------------------------------------- */

function EmailBody({ c, w, brand, kind, segment = 0 }: { c: C; w: number; brand: string; kind: "verda" | "aurora"; segment?: number }) {
  const cx = w / 2;
  return (
    <g>
      <T x={cx} y={42} s={18} w={800} c={c} anchor="middle" ls={kind === "verda" ? 4 : 0}>
        {brand}
      </T>
      <rect x={24} y={62} width={w - 48} height={200} rx={8} style={{ fill: c.m(kind === "verda" ? 8 : 90) }} />
      {kind === "verda" ? (
        Array.from({ length: 7 }, (_, i) => (
          <ellipse key={i} cx={cx - 120 + i * 42 + segment * 6} cy={170 + (i % 2) * 18} rx={18} ry={58} transform={`rotate(${-30 + i * 12} ${cx - 120 + i * 42 + segment * 6} ${170 + (i % 2) * 18})`} style={{ fill: c.m(22 + (i % 3) * 14) }} />
        ))
      ) : (
        <g>
          <text x={44} y={130} fontSize={28} fontWeight={700} fontFamily={FONT} style={{ fill: c.paper }}>
            Your week, healthier.
          </text>
          <rect x={44} y={152} width={160} height={10} rx={5} style={{ fill: c.m(55) }} />
          <rect x={44} y={172} width={120} height={10} rx={5} style={{ fill: c.m(55) }} />
          <rect x={44} y={206} width={130} height={36} rx={18} style={{ fill: c.paper }} />
          <text x={109} y={229} fontSize={13} fontWeight={700} fontFamily={FONT} textAnchor="middle" style={{ fill: c.ink }}>
            Book a check
          </text>
          <circle cx={w - 90} cy={164} r={58} style={{ fill: "none", stroke: c.m(50), strokeWidth: 10 }} />
          <circle cx={w - 90} cy={164} r={58} strokeDasharray="250 400" style={{ fill: "none", stroke: c.paper, strokeWidth: 10 }} transform={`rotate(-90 ${w - 90} 164)`} />
        </g>
      )}
      <T x={cx} y={302} s={kind === "verda" ? 24 : 18} w={700} c={c} anchor="middle">
        {kind === "verda" ? ["Autumn, rebalanced.", "For dry skin, this season.", "New: the night serum."][segment % 3] : "Three small changes"}
      </T>
      <Bar x={cx - 150} y={322} w={300} c={c} h={10} />
      <Bar x={cx - 110} y={340} w={220} c={c} h={10} />
      {[0, 1, 2].map((i) => {
        const cw = (w - 48 - 32) / 3;
        const x = 24 + i * (cw + 16);
        return (
          <g key={i}>
            <rect x={x} y={376} width={cw} height={cw * 0.9} rx={8} style={{ fill: c.m(6 + i * 4) }} />
            {kind === "verda" ? (
              <rect x={x + cw / 2 - 16} y={376 + cw * 0.18} width={32} height={cw * 0.58} rx={8} style={{ fill: c.m(40 + i * 15) }} />
            ) : (
              <circle cx={x + cw / 2} cy={376 + cw * 0.45} r={cw * 0.22} style={{ fill: "none", stroke: c.m(60), strokeWidth: 4 }} />
            )}
            <Bar x={x + 8} y={386 + cw * 0.9} w={cw - 30} c={c} h={9} p={30} />
          </g>
        );
      })}
      <rect x={cx - 90} y={376 + ((w - 80) / 3) * 0.9 + 44} width={180} height={42} rx={4} style={{ fill: c.accent }} />
      <text x={cx} y={376 + ((w - 80) / 3) * 0.9 + 70} fontSize={14} fontWeight={700} fontFamily={FONT} textAnchor="middle" style={{ fill: c.paper }}>
        {kind === "verda" ? "Shop the edit" : "Read more"}
      </text>
    </g>
  );
}

function EmailFrame0({ c, brand, kind }: { c: C; brand: string; kind: "verda" | "aurora" }) {
  return (
    <Browser x={140} y={60} w={1320} h={860} c={c} url="mail.example.com">
      <rect x={0} y={0} width={360} height={820} style={{ fill: c.m(4) }} />
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <g key={i}>
          {i === 0 && <rect x={10} y={14 + i * 86} width={340} height={78} rx={10} style={{ fill: c.m(10) }} />}
          <T x={28} y={42 + i * 86} s={14} w={i === 0 ? 700 : 500} c={c} p={i === 0 ? 95 : 70}>
            {i === 0 ? brand : ["Bank", "Team", "Newsletter", "Receipt", "Calendar", "Delivery"][i - 1]}
          </T>
          <Bar x={28} y={54 + i * 86} w={260} c={c} h={9} p={i === 0 ? 30 : 16} />
          <Bar x={28} y={70 + i * 86} w={200} c={c} h={9} p={12} />
        </g>
      ))}
      <rect x={360} y={0} width={960} height={820} style={{ fill: c.m(2) }} />
      <svg x={360 + (960 - 600) / 2} y={24} width={600} height={800} overflow="hidden">
        <rect x={0} y={0} width={600} height={800} rx={10} style={{ fill: c.paper, stroke: c.m(10) }} />
        <EmailBody c={c} w={600} brand={brand} kind={kind} />
      </svg>
    </Browser>
  );
}

/* --- Branding -------------------------------------------------------------- */

function KestrelMark({ x, y, s, c, p = 100 }: { x: number; y: number; s: number; c: C; p?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s / 100})`} style={{ fill: c.m(p) }}>
      <path d="M0 62 L52 20 L100 0 L66 40 L100 42 L44 66 Z" />
      <path d="M8 80 L60 72 L40 96 Z" />
    </g>
  );
}

function NorthMark({ x, y, s, c, p = 100 }: { x: number; y: number; s: number; c: C; p?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s / 100})`}>
      <circle cx={50} cy={50} r={46} style={{ fill: "none", stroke: c.m(p), strokeWidth: 6 }} />
      <path d="M50 10 L62 50 L50 44 L38 50 Z" style={{ fill: c.m(p) }} />
      <rect x={47} y={50} width={6} height={40} style={{ fill: c.m(p) }} />
    </g>
  );
}

const BRAND: Record<string, { name: string; Mark: typeof KestrelMark; italic: boolean; tag: string; ls: number }> = {
  "kestrel-athletics": { name: "KESTREL", Mark: KestrelMark, italic: true, tag: "Built to be read at 40 mph", ls: -2 },
  "northline-logistics": { name: "NORTHLINE", Mark: NorthMark, italic: false, tag: "Freight, steadily.", ls: 10 },
};

function Brand({ c, slug, frame }: { c: C; slug: string; frame: number }) {
  const b = BRAND[slug];
  const { Mark } = b;
  const word = (x: number, y: number, s: number, p = 100, anchor: "start" | "middle" = "start") => (
    <text x={x} y={y} fontSize={s} fontWeight={b.italic ? 900 : 600} fontStyle={b.italic ? "italic" : "normal"} fontFamily={FONT} textAnchor={anchor} letterSpacing={(b.ls * s) / 100} style={{ fill: c.m(p) }}>
      {b.name}
    </text>
  );
  if (frame === 0) {
    return (
      <g>
        <rect x={0} y={0} width={W} height={H} style={{ fill: c.m(4) }} />
        <Mark x={W / 2 - 130} y={250} s={260} c={c} />
        {word(W / 2, 680, 110, 100, "middle")}
        <T x={W / 2} y={740} s={22} w={450} c={c} p={50} anchor="middle">
          {b.tag}
        </T>
      </g>
    );
  }
  if (frame === 1) {
    return (
      <g>
        <rect x={0} y={0} width={W} height={H} style={{ fill: c.m(6) }} />
        <g transform="rotate(-6 560 520)">
          <rect x={250} y={300} width={620} height={360} rx={10} style={{ fill: c.paper, stroke: c.m(10) }} />
          <Mark x={290} y={340} s={70} c={c} />
          {word(290, 600, 46)}
          <Bar x={620} y={560} w={200} c={c} h={10} />
          <Bar x={660} y={584} w={160} c={c} h={10} />
        </g>
        <g transform="rotate(4 1120 480)">
          <rect x={900} y={220} width={440} height={560} rx={10} style={{ fill: c.m(92) }} />
          <Mark x={1060} y={380} s={120} c={c} p={4} />
          <text x={1120} y={640} fontSize={30} fontWeight={b.italic ? 900 : 600} fontStyle={b.italic ? "italic" : "normal"} fontFamily={FONT} textAnchor="middle" letterSpacing={(b.ls * 30) / 100} style={{ fill: c.paper }}>
            {b.name}
          </text>
        </g>
        <rect x={140} y={720} width={160} height={160} rx={36} style={{ fill: c.m(92) }} />
        <Mark x={172} y={752} s={96} c={c} p={4} />
      </g>
    );
  }
  if (frame === 2) {
    return (
      <g>
        <rect x={0} y={0} width={W} height={H} style={{ fill: c.paper }} />
        <T x={120} y={150} s={18} w={600} c={c} p={50} ls={2}>
          TYPE SPECIMEN · 4 WEIGHTS
        </T>
        {[900, 700, 500, 300].map((wt, i) => (
          <text key={wt} x={120} y={300 + i * 170} fontSize={150} fontWeight={wt} fontStyle={b.italic ? "italic" : "normal"} fontFamily={FONT} letterSpacing={-4} style={{ fill: c.m(100 - i * 18) }}>
            Aa Rr 40
          </text>
        ))}
        <path d="M1050 120 V880" style={{ stroke: c.m(12), strokeWidth: 1.5 }} />
        {["Signage", "Label", "Apparel", "Screen"].map((t, i) => (
          <g key={t}>
            <T x={1100} y={250 + i * 170} s={14} w={600} c={c} p={50} ls={1.5}>
              {t.toUpperCase()}
            </T>
            <T x={1100} y={300 + i * 170} s={36} w={[900, 700, 500, 300][i]} c={c}>
              {b.name}
            </T>
          </g>
        ))}
      </g>
    );
  }
  return (
    <g>
      <rect x={0} y={0} width={W} height={H} style={{ fill: c.m(4) }} />
      {[
        [80, 80, 700, 400, 92],
        [820, 80, 700, 400, 0],
        [80, 520, 340, 400, 0],
        [440, 520, 340, 400, 50],
        [800, 520, 720, 400, 0],
      ].map(([x, y, w, h, p], i) => (
        <g key={i}>
          <rect x={x} y={y} width={w} height={h} rx={18} style={{ fill: c.m(p), stroke: c.m(10) }} />
          {i === 0 && <Mark x={x + w / 2 - 80} y={y + h / 2 - 80} s={160} c={c} p={4} />}
          {i === 1 && word(x + w / 2, y + h / 2 + 30, 90, 100, "middle")}
          {i === 2 &&
            [100, 70, 40, 14].map((g, k) => (
              <g key={g}>
                <rect x={x + 40} y={y + 50 + k * 80} width={60} height={60} rx={10} style={{ fill: c.m(g) }} />
                <T x={x + 120} y={y + 88 + k * 80} s={15} w={500} c={c} p={60}>
                  {`Grey ${g}`}
                </T>
              </g>
            ))}
          {i === 3 && <Mark x={x + w / 2 - 90} y={y + h / 2 - 90} s={180} c={c} p={0} />}
          {i === 4 && (
            <g>
              <T x={x + 48} y={y + 90} s={16} w={600} c={c} p={50} ls={1.5}>
                CLEAR SPACE
              </T>
              <rect x={x + 220} y={y + 140} width={280} height={180} style={{ fill: "none", stroke: c.m(30), strokeDasharray: "8 8" }} />
              <Mark x={x + 300} y={y + 170} s={120} c={c} />
            </g>
          )}
        </g>
      ))}
    </g>
  );
}

/* --- Frames ------------------------------------------------------------------ */

function AppFrames({ c, slug, frame, url, mm }: { c: C; slug: string; frame: number; url: string; mm: { title: string; stat: string; statLabel: string; line: string } }) {
  const d = desktop[slug];
  const m = mobile[slug];
  if (frame === 0) {
    return (
      <g>
        <rect x={0} y={0} width={W} height={H} style={{ fill: c.m(5) }} />
        <circle cx={1350} cy={160} r={360} style={{ fill: c.m(4) }} />
        <Browser x={120} y={70} w={1360} h={850} c={c} url={url}>
          {d(c, 1360, 797)}
        </Browser>
      </g>
    );
  }
  if (frame === 1) {
    return (
      <g>
        <rect x={0} y={0} width={W} height={H} style={{ fill: c.m(5) }} />
        <T x={120} y={360} s={18} w={600} c={c} p={50} ls={2}>
          {mm.title.toUpperCase()} · MOBILE
        </T>
        <T x={116} y={500} s={136} w={800} c={c}>
          {mm.stat}
        </T>
        <T x={120} y={560} s={30} w={500} c={c} p={60}>
          {mm.statLabel}
        </T>
        <Phone x={720} y={130} w={330} h={700} c={c}>
          {m(c, 306, 620)}
        </Phone>
        <g opacity={0.9}>
          <Phone x={1110} y={210} w={300} h={640} c={c}>
            <g>
              <rect x={0} y={0} width={276} height={560} style={{ fill: c.m(3) }} />
              <T x={20} y={40} s={20} w={700} c={c}>
                {mm.title}
              </T>
              {[0, 1, 2, 3, 4].map((i) => (
                <g key={i}>
                  <Box x={14} y={64 + i * 92} w={248} h={78} r={14} c={c} />
                  <circle cx={46} cy={103 + i * 92} r={16} style={{ fill: c.m(14 + i * 6) }} />
                  <Bar x={72} y={92 + i * 92} w={140} c={c} p={28} h={10} />
                  <Bar x={72} y={110 + i * 92} w={96} c={c} h={9} />
                </g>
              ))}
            </g>
          </Phone>
        </g>
      </g>
    );
  }
  if (frame === 2) {
    return (
      <g>
        <rect x={0} y={0} width={W} height={H} style={{ fill: c.m(5) }} />
        <g transform="translate(-180 -120) scale(1.5)">
          <svg x={0} y={0} width={1360} height={797} overflow="visible">
            {d(c, 1360, 797)}
          </svg>
        </g>
        <rect x={0} y={0} width={W} height={H} style={{ fill: c.m(5) }} opacity={0.82} />
        <Box x={180} y={200} w={620} h={600} r={28} c={c} p={0} stroke={10} />
        <T x={230} y={290} s={16} w={600} c={c} p={50} ls={2}>
          OUTCOME
        </T>
        <T x={226} y={460} s={150} w={800} c={c}>
          {mm.stat}
        </T>
        <T x={230} y={530} s={28} w={600} c={c}>
          {mm.statLabel}
        </T>
        <Line pts={wave(20, 230, 750, 680, 50, 2)} c={c} sw={4} fill={6} />
        <Box x={860} y={200} w={560} h={600} r={28} c={c} p={92} stroke={92} />
        <text x={910} y={290} fontSize={16} fontWeight={600} fontFamily={FONT} letterSpacing={2} style={{ fill: c.m(35) }}>
          COMPONENTS
        </text>
        <rect x={910} y={330} width={200} height={50} rx={25} style={{ fill: c.paper }} />
        <rect x={1130} y={330} width={200} height={50} rx={25} style={{ fill: "none", stroke: c.m(50), strokeWidth: 1.5 }} />
        {[0, 1, 2].map((i) => (
          <g key={i}>
            <rect x={910} y={420 + i * 100} width={460} height={80} rx={16} style={{ fill: c.m(84) }} />
            <circle cx={955} cy={460 + i * 100} r={20} style={{ fill: c.m(60 - i * 12) }} />
            <rect x={990} y={446 + i * 100} width={200} height={12} rx={6} style={{ fill: c.m(40) }} />
            <rect x={990} y={466 + i * 100} width={140} height={10} rx={5} style={{ fill: c.m(62) }} />
          </g>
        ))}
      </g>
    );
  }
  return (
    <g>
      <rect x={0} y={0} width={W} height={H} style={{ fill: c.m(5) }} />
      {[0, 1, 2].map((i) => (
        <g key={i} transform={`translate(${80 + i * 490} ${100 + (i % 2) * 40}) scale(0.34)`}>
          <rect x={0} y={0} width={1360} height={797} rx={24} style={{ fill: c.paper, stroke: c.m(14), strokeWidth: 4 }} />
          <svg x={0} y={0} width={1360} height={797} overflow="hidden">
            {d(c, 1360, 797)}
          </svg>
        </g>
      ))}
      <T x={80} y={530} s={18} w={600} c={c} p={50} ls={2}>
        {mm.title.toUpperCase()} · SYSTEM
      </T>
      <T x={80} y={600} s={44} w={700} c={c}>
        {mm.line}
      </T>
      {[
        ["Display", 56, 800],
        ["Heading", 34, 700],
        ["Body", 18, 450],
      ].map(([n, s, wt], i) => (
        <g key={n as string}>
          <T x={80} y={700 + i * 80} s={14} w={600} c={c} p={50}>
            {n as string}
          </T>
          <T x={220} y={706 + i * 80} s={(s as number) * 0.8} w={wt as number} c={c}>
            Aa Bb 123
          </T>
        </g>
      ))}
      {[100, 75, 50, 25, 10, 4].map((g, i) => (
        <g key={g}>
          <rect x={900 + (i % 3) * 200} y={660 + Math.floor(i / 3) * 140} width={180} height={110} rx={16} style={{ fill: c.m(g), stroke: c.m(10) }} />
          <T x={918 + (i % 3) * 200} y={750 + Math.floor(i / 3) * 140} s={14} w={600} c={c} p={g > 50 ? 0 : 70}>
            {`Ink ${g}`}
          </T>
        </g>
      ))}
    </g>
  );
}

function EmailFrames({ c, slug, frame, mm }: { c: C; slug: string; frame: number; mm: { title: string; stat: string; statLabel: string } }) {
  const kind = slug === "verda-botanics" ? "verda" : "aurora";
  const brand = kind === "verda" ? "VERDA" : "Aurora Health";
  if (frame === 0) {
    return (
      <g>
        <rect x={0} y={0} width={W} height={H} style={{ fill: c.m(5) }} />
        <EmailFrame0 c={c} brand={brand} kind={kind} />
      </g>
    );
  }
  if (frame === 1) {
    return (
      <g>
        <rect x={0} y={0} width={W} height={H} style={{ fill: c.m(5) }} />
        <T x={120} y={380} s={18} w={600} c={c} p={50} ls={2}>
          {mm.title.toUpperCase()} · ON MOBILE
        </T>
        <T x={116} y={510} s={136} w={800} c={c}>
          {mm.stat}
        </T>
        <T x={120} y={570} s={30} w={500} c={c} p={60}>
          {mm.statLabel}
        </T>
        <Phone x={760} y={120} w={340} h={720} c={c}>
          <g transform="scale(0.527)">
            <EmailBody c={c} w={600} brand={brand} kind={kind} segment={1} />
          </g>
        </Phone>
        <Phone x={1150} y={190} w={300} h={640} c={c}>
          <g transform="scale(0.46)">
            <EmailBody c={c} w={600} brand={brand} kind={kind} segment={2} />
          </g>
        </Phone>
      </g>
    );
  }
  if (frame === 2) {
    const mods = ["Hero", "Product row", "Article", "Offer", "Testimonial", "Footer"];
    return (
      <g>
        <rect x={0} y={0} width={W} height={H} style={{ fill: c.paper }} />
        <T x={100} y={120} s={18} w={600} c={c} p={50} ls={2}>
          MODULE LIBRARY
        </T>
        <T x={100} y={180} s={48} w={700} c={c}>
          {kind === "verda" ? "One template set, nine segments" : "Twelve modules, no broken sends"}
        </T>
        {mods.map((m, i) => {
          const x = 100 + (i % 3) * 470;
          const y = 240 + Math.floor(i / 3) * 360;
          return (
            <g key={m}>
              <Box x={x} y={y} w={440} h={330} r={16} c={c} p={3} stroke={10} />
              <T x={x + 24} y={y + 40} s={14} w={600} c={c} p={55} ls={1}>
                {`${String(i + 1).padStart(2, "0")} · ${m.toUpperCase()}`}
              </T>
              <rect x={x + 24} y={y + 64} width={392} height={i === 0 ? 180 : 110} rx={8} style={{ fill: c.m(i === 0 ? 70 : 10) }} />
              {i !== 0 && [0, 1, 2].map((k) => <rect key={k} x={x + 24 + k * 132} y={y + 190} width={124} height={70} rx={8} style={{ fill: c.m(6 + k * 4) }} />)}
              <Bar x={x + 24} y={y + 280} w={260} c={c} h={10} />
              <Bar x={x + 24} y={y + 300} w={180} c={c} h={10} p={10} />
            </g>
          );
        })}
      </g>
    );
  }
  const n = kind === "verda" ? 9 : 6;
  const cols = kind === "verda" ? 5 : 3;
  return (
    <g>
      <rect x={0} y={0} width={W} height={H} style={{ fill: c.m(5) }} />
      <T x={100} y={120} s={18} w={600} c={c} p={50} ls={2}>
        {`${n} SEGMENTS`}
      </T>
      {Array.from({ length: n }, (_, i) => {
        const cw = (W - 200 - (cols - 1) * 24) / cols;
        const x = 100 + (i % cols) * (cw + 24);
        const y = 160 + Math.floor(i / cols) * 420;
        const sc = cw / 600;
        return (
          <g key={i}>
            <rect x={x} y={y} width={cw} height={390} rx={12} style={{ fill: c.paper, stroke: c.m(10) }} />
            <svg x={x} y={y} width={cw} height={390} overflow="hidden">
              <g transform={`scale(${sc})`}>
                <EmailBody c={c} w={600} brand={brand} kind={kind} segment={i} />
              </g>
            </svg>
          </g>
        );
      })}
    </g>
  );
}

/* --- Component ------------------------------------------------------------- */

export function ProjectMockup({ slug, frame = 0, ink = "#0a0a0a", paper = "#ffffff", accent, ratio = 1.6, label = true, className, style, title }: Props) {
  const data = MOCKUPS[slug];
  const c: C = {
    ink,
    paper,
    accent: accent ?? ink,
    m: (p) => (p <= 0 ? paper : p >= 100 ? ink : `color-mix(in srgb, ${ink} ${p}%, ${paper})`),
  };
  const f = ((frame % 4) + 4) % 4;
  const vh = Math.round(W / ratio);
  // Fit the 16:10 artboard inside any ratio, centred, background extended.
  const s = Math.min(1, vh / H);
  const ox = (W - W * s) / 2;
  const oy = (vh - H * s) / 2;
  const kind: MockupKind = data?.kind ?? "app";

  return (
    <svg
      viewBox={`0 0 ${W} ${vh}`}
      preserveAspectRatio="xMidYMid slice"
      className={className}
      style={{ display: "block", width: "100%", height: "auto", background: c.m(5), ...style }}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      <rect x={0} y={0} width={W} height={vh} style={{ fill: kind === "brand" && f === 2 ? paper : c.m(5) }} />
      <g transform={`translate(${ox} ${oy}) scale(${s})`}>
        {kind === "app" && data && <AppFrames c={c} slug={slug} frame={f} url={data.url} mm={data} />}
        {kind === "email" && data && <EmailFrames c={c} slug={slug} frame={f} mm={data} />}
        {kind === "brand" && <Brand c={c} slug={slug} frame={f} />}
      </g>
      {label && (
        <g>
          <rect x={W - 214} y={vh - 58} width={190} height={34} rx={17} style={{ fill: c.m(88) }} opacity={0.88} />
          <text x={W - 119} y={vh - 36} fontSize={14} fontWeight={600} fontFamily={FONT} textAnchor="middle" letterSpacing={0.6} style={{ fill: paper }}>
            Concept visual
          </text>
        </g>
      )}
    </svg>
  );
}

# 04 — Motion Catalogue

Motion is the point of v2. v1 had hover transitions and one carousel; v2 is built around a
scroll-driven system.

Libraries: **GSAP + ScrollTrigger** (scroll and timeline work), **Lenis** (smooth scroll),
**Embla** (carousels). No Framer Motion — GSAP already covers the scrubbing and pinning this
design needs, and one animation library is easier to keep coherent than two.

## Principles

1. Motion carries meaning: arrival, relationship, progress, state. Never decoration alone.
2. Two easings only — `cubic-bezier(0.22, 1, 0.36, 1)` (expo-out) for entrances,
   `cubic-bezier(0.65, 0, 0.35, 1)` for state changes.
3. Entrances `0.6–1.0s`; hovers `0.2–0.4s`; scrubbed effects follow the scroll, not a clock.
4. Stagger `50–120ms`, never more than 8 staggered children — batch beyond that.
5. Animate only `transform`, `opacity`, `clip-path`, `filter`, colour, and
   `grid-template-rows`. Nothing that triggers layout.
6. Anything pinned releases cleanly on resize; every trigger is scoped and reverted.

## Reduced motion

One hook, `useReducedMotion()`, plus a global CSS guard. Under
`prefers-reduced-motion: reduce`:

- Reveals, split text and counters render in their **final** state — no transform, no fade.
- Lenis is never initialised; native scrolling takes over.
- Pinned and scrubbed sections become plain stacked sections (no pinning at all).
- Marquees render one static row.
- Carousel autoplay is off; drag and buttons still work.
- The cursor follower, magnetic buttons and tilt are disabled.
- The preloader does not render.

## Catalogue

### Arrival

| # | Name | Trigger | Property | Timing |
| --- | --- | --- | --- | --- |
| 1 | Preloader count | mount, once per session | `000→100` + progress line `scaleX` | 1.2s linear |
| 2 | Preloader wipe | count complete | `clip-path` inset up, orange sheet trails behind | 0.8s expo.out |
| 3 | Hero headline | after preloader | per-word `y: 110% → 0` inside masks | 0.9s, 70ms stagger |
| 4 | Hero sub + CTAs | after headline | `opacity`, `y: 30 → 0` | 0.7s, 80ms stagger |
| 5 | Page hero title | route enter | per-word mask reveal | 0.8s, 50ms stagger |

### The ambient background

| # | Name | Trigger | Property | Timing |
| --- | --- | --- | --- | --- |
| 6 | Gradient drift | loop | three ellipses translate and scale on independent cycles | 18–26s ease-in-out yoyo |
| 7 | Gradient parallax | scroll | layer `y` moves at 0.15× scroll | scrub 0.8 |
| 8 | Accent bloom | section enter | radial orange glow fades in behind the active section | 1.2s |
| 9 | Grain | static | fixed noise overlay at 4% | none |

### Scroll-driven

| # | Name | Trigger | Property | Timing |
| --- | --- | --- | --- | --- |
| 10 | `Reveal` | `top 85%` | `opacity 0→1`, `y: 40 → 0` | 0.8s expo.out, once |
| 11 | `RevealGroup` | `top 85%` | same, staggered across children | 80ms stagger |
| 12 | `SplitText` | `top 85%` | per word/line mask reveal | 0.7s, 40ms stagger |
| 13 | Scroll word highlight | scrub through viewport | `color: --fg-subtle → --fg` per word | scrub 0.4 |
| 14 | Section number ticker | scrub | large ghosted section number counts up as the section passes | scrub |
| 15 | **Hero card stack** | scrub over 150vh, pinned | the 3D card carousel advances one card per scroll step, cards rotate/scale in Z | scrub 0.6 |
| 16 | **Services horizontal scroll** | pinned, 6 cards | vertical scroll translates the row horizontally | scrub 1 |
| 17 | **Feature rows** | each row | image scales `1.15 → 1`, copy slides in from the opposite side | scrub 0.5 |
| 18 | Works grid stagger | `top 80%` | cards rise with 90ms stagger, alternate columns offset | 0.9s |
| 19 | Case-study cover | scroll | image `y` parallax inside a fixed mask | scrub |
| 20 | Counter | `top 90%`, once | number tween | 2s expo.out |
| 21 | Skill / progress bars | `top 90%`, once | `scaleX: 0 → 1` | 1.2s expo.out |
| 22 | Marquee | always | duplicated track `x: 0 → -50%` | 35s linear infinite |
| 23 | Marquee velocity | Lenis velocity | speed multiplier and `skewX`, clamped to 5° | eased |
| 24 | Sticky section headings | scroll | heading pins while its list scrolls past | pin |

### Pointer

| # | Name | Trigger | Property | Timing |
| --- | --- | --- | --- | --- |
| 25 | Custom cursor | pointer move | dot + trailing ring, springs to the pointer | spring 120/20 |
| 26 | Cursor states | hover target | ring scales and labels — `VIEW`, `DRAG`, `OPEN` | 0.3s |
| 27 | Magnetic buttons | pointer within 90px | translate toward pointer, max 14px, spring back | spring |
| 28 | Card tilt | pointer over card | `rotateX/rotateY` up to 8°, glare follows | 0.4s |
| 29 | Hover image follow | works list rows | cover image trails the cursor with rotation from velocity | spring |
| 30 | Link underline | hover/focus | dual-label mask slide + underline `scaleX` | 0.3s |
| 31 | Button fill | hover/focus | accent wash `scaleX` from left, label repeats and scrolls | 0.4s |
| 32 | Service card | hover/focus | border to accent, icon rotates 45°, background tint | 0.35s |

### State

| # | Name | Trigger | Property | Timing |
| --- | --- | --- | --- | --- |
| 33 | Header condense | scroll > 80px | background, blur, border | 0.3s |
| 34 | Header hide/show | scroll direction | `y: 0 / -100%` | 0.4s |
| 35 | Mobile menu | tap | overlay `clip-path` circle from the button, links stagger | 0.6s / 60ms |
| 36 | Dropdown | hover/focus | `opacity`, `y: 8 → 0`, items stagger | 0.3s / 30ms |
| 37 | Theme toggle | click | icon cross-rotate, whole page colour transition | 0.4s |
| 38 | Accordion | click | `grid-template-rows: 0fr → 1fr`, chevron rotate | 0.4s |
| 39 | Tabs / filters | click | active pill slides between options, panel cross-fades | 0.35s |
| 40 | Carousel | drag / autoplay | Embla translate, autoplay 6s | 0.5s |
| 41 | Form field | focus | label floats, underline `scaleX` from left | 0.25s |
| 42 | Submit pending | action pending | spinner, label swap | — |
| 43 | Lightbox | click | `scale 0.92 → 1`, backdrop fade | 0.35s |
| 44 | Page transition | route change | orange sheet wipes up on exit, content rises on enter | 0.5s each |
| 45 | Scroll progress | scroll | thin accent bar at the top of the viewport | scrub |

## GSAP hygiene

- Every animation is created inside `useGSAP` scoped to a ref and reverted on unmount, so no
  ScrollTriggers leak across route changes.
- Lenis drives GSAP's ticker (`gsap.ticker.add`) with `lagSmoothing(0)`.
- `ScrollTrigger.refresh()` runs after Lenis initialises and after `document.fonts.ready`,
  because font swap changes every trigger position.
- Pinned sections use `invalidateOnRefresh: true` so resize recomputes distances.
- Triggers that fire once use `once: true` and dispose themselves.
- The React Compiler is enabled in this project; GSAP refs and timelines stay outside render
  so the compiler has nothing to memoise incorrectly.

## Performance budget

Motion is not allowed to cost the page:

- No animation on `width`, `height`, `top`, `left`, `margin`.
- `will-change` only on elements currently animating, removed after.
- Pinned sections are limited to three per page.
- The cursor follower and magnetic effects are desktop-and-pointer-fine only
  (`(hover: hover) and (pointer: fine)`), and off below `lg`.
- Target: no dropped frames on a 60Hz laptop during a full-page scroll, and CLS 0.

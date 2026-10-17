# DotGrey Digital — Redesign Lab

Twelve redesign directions for DotGrey Digital, each a working prototype with its own
type, layout and motion: a homepage and a case-study page, built on the same content so
the comparison is about design, not copy.

The previous production site lives on the **`legacy`** branch.

## Getting started

```bash
npm install
npm run dev     # http://localhost:3220
```

```bash
npm run build
npm run lint
npx tsc --noEmit
```

## Routes

| Route | What it is |
| --- | --- |
| `/` | The lab: every direction with a preview, linking to its homepage and case study |
| `/v1` – `/v7` | Round one, in colour: Signal, Editorial, Blueprint, Brutal, Terminal, Spatial, Warm Human |
| `/v8` – `/v12` | Round two, black and white: Wordmark, Index, Engine, Grain, Sculpture |
| `/vN/work/[slug]` | Each direction's case-study template, for all nine projects |

Everything is excluded from search engines (`robots.ts` and a `noindex` layout).

## Where things are

| Path | Contents |
| --- | --- |
| `src/app/(redesign)/` | The lab page and one route folder per direction |
| `src/redesign/vN/` | Each direction's components and CSS module |
| `src/redesign/lab/` | The lab page's styles and cursor |
| `src/redesign/shared/` | Logo wrapper, version switcher, motion hook, generated black-and-white project art |
| `src/redesign/content.ts` | Shared content: disciplines, process, version metadata, plus re-exports of `src/data` |
| `src/content/`, `src/data/` | Works, stats, testimonials and site details carried over from the old site |
| `public/previews/` | The hero screenshots used on the lab page |

## Updating the lab previews

The images in `public/previews/vN.jpg` are 1440×900 screenshots of each homepage. Retake
them after changing a hero so the lab page stays honest.

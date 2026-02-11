# Dot Grey Digital v1

A Next.js application for Dot Grey Digital built with the App Router, React 19, and Tailwind CSS v4.

## Tech Stack

- Next.js 16 (App Router)
- React 19
- Tailwind CSS v4
- ESLint 9
- Embla Carousel (for sliders)
- Lucide React (icons)

## Requirements

- Node.js 18+ recommended
- Package manager: npm (project uses npm lockfile)

## Getting Started

Install dependencies and start the dev server:

```bash
npm install
npm run dev
```

Open http://localhost:3000 to view the app.

## Scripts

- dev: Start development server
- build: Build production assets
- start: Run production server
- lint: Run ESLint

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## Project Structure

- src/app: Routes/pages, layout, global styles
- src/components: UI components grouped by feature
- public: Static assets

Key entry points:

- src/app/layout.js
- src/app/page.js
- src/app/globals.css

## Styling

Tailwind CSS v4 is configured via PostCSS. Global styles live in src/app/globals.css.

## Linting

ESLint is configured with eslint.config.mjs. Run lint locally before commits:

```bash
npm run lint
```

## Environment Variables

Create a .env.local for local development. Common patterns:

- NEXT*PUBLIC*\*: Public variables available on the client
- Server-only variables: Without NEXT*PUBLIC*, used on the server

.env files are gitignored.

## Deployment

This project is optimized for Vercel. Build and start locally:

```bash
npm run build
npm run start
```

## License

Proprietary — internal use for Dot Grey Digital unless otherwise stated.

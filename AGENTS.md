# Repository Guidelines

## Project Structure & Module Organization
Use the Next.js App Router: each feature lives under `app/<feature>` with its `page.tsx`, `layout.tsx`, and optional loading/error files. Reusable UI components belong in `components/`, data helpers in `lib/`, and static assets in `public/`. ETF research artifacts (`etfs/`, `products.md`, `products.json`) should be edited in markdown first and regenerated with `python generate_products_json.py` to keep the catalog consistent. For containers, rely on the root `Dockerfile` and optional `compose.yml`.

## Build, Test, and Development Commands
- `npm install` — installs the pinned tooling.
- `npm run dev` — hot-reloading dev server on http://localhost:3000.
- `npm run build` — production build; fails on type or lint errors.
- `npm run start` — serves the optimized build for pre-release smoke tests.
- `npm run lint` — shared ESLint + Tailwind checks defined in `eslint.config.mjs`.

## Coding Style & Naming Conventions
Write TypeScript components as arrow functions, exported from PascalCase files (e.g., `components/HeroSection.tsx`). Use 4-space indentation, named exports, and Tailwind utility classes; confine bespoke CSS to the component that needs it. Keep helpers in `lib/` pure and isolate every `process.env` access through a single config module. Always run `npm run lint` before opening a pull request.

## Testing Guidelines
There is no automated runner yet, so exercise features manually via `npm run dev` and document repro steps in the PR. New coverage should rely on Jest with React Testing Library, storing specs as `FeatureName.test.tsx` next to the source. Aim for 80% branch coverage on new modules, keep tests headless-friendly, and note any new test commands in the README until an official `npm test` script is introduced.

## Commit & Pull Request Guidelines
Use imperative, present-tense commit subjects under 72 characters (`Add ETF data sync`). Keep each commit focused, and add body text when behavior changes or migrations occur. Pull requests must link an issue, summarize the change, include screenshots or JSON diffs for UI/data work, list the commands you ran (`dev`, `build`, `lint`, tests), and highlight schema or environment updates so reviewers can reproduce.

## Security & Configuration Tips
Store credentials in `.env.local` only; never commit keys such as `MONGODB_URI` or feature flags. Re-run data sanitization before pushing generated JSON to guarantee no customer identifiers leak. When adding new configuration, define typed helpers in `lib/config.ts` (create it if needed) instead of touching `process.env` everywhere, and rotate any credentials mentioned in Docker instructions before sharing images externally.

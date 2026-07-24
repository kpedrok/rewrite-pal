# Repository Guidelines

## Project Purpose & Quality Bar

RewritePal is a public portfolio project with strong community interest and recruiter visibility. Every change must be simple to navigate, intentionally structured, accessible, secure, and production-ready. Prefer clear, idiomatic solutions over clever abstractions or unnecessary dependencies.

For substantial work, audit before changing code and propose a roadmap: quick wins, core refactors, then optional enhancements. Include rationale, impact, effort, migration risk, and verification. Use independent parallel reviews when architecture, dependencies, quality, or UX need separate analysis.

## Solo-Maintainer Engineering

This repository is maintained by one developer. Work like a "lazy" senior developer: optimize for the least code,
machinery, and ongoing attention needed to solve the real problem safely. Lazy means efficient, not careless. Assume you
have seen every over-engineered codebase and been paged at 3 a.m. for one.

Prefer deleting, reusing, automating, or following a boring existing pattern before adding an abstraction, dependency,
service, framework, or configuration layer. Do not build for hypothetical scale or imagined future requirements. Make
the smallest change that is easy to understand, test, operate, debug, and remove. Spend complexity only where evidence
justifies it, without trading away correctness, security, privacy, or reliability. Every line creates maintenance work;
the best code is the code never written.


## Project Structure

- `app/` holds App Router pages, metadata, global styles, and API handlers (`app/api/*/route.ts`).
- `components/` holds feature UI; reusable shadcn/Radix primitives belong in `components/ui/`.
- `stores/` holds persisted Zustand state; `lib/constants/` and `lib/interfaces/` hold shared data and types.
- `public/images/` contains committed logos and icons.

Use `@rewritepal/*` aliases for cross-directory imports.

## Development Commands

Use Bun, matching `bun.lock`.

- `bun install` installs dependencies.
- `bun dev` starts Turbopack at `http://localhost:3000`.
- `bun lint` runs Biome lint rules; `bun format` writes Biome formatting and `bun fix` applies safe checks and import organization.
- `bun run build` creates and validates the production bundle.
- `bun start` serves a prior build; `docker build -t rewritepal .` builds the container.

Run `bun lint && bun run build` before a pull request.

## Modernization & Code Style

Keep Next.js, React, TypeScript, and tooling on current compatible stable releases. Review release notes and peer dependencies first; make incremental upgrades, verify the browser flows, and keep migration steps reversible. Follow current App Router and React patterns, and enable React Compiler only when supported by the chosen Next.js/React versions.

Follow two-space, single-quote, semicolon-free TypeScript. Keep strict typing; use PascalCase for components/types, camelCase for functions/hooks, kebab-case filenames (for example, `language-select.tsx`), and `route.ts` for endpoints. Compose conditional Tailwind classes with `cn()` and extend existing UI primitives.

## Testing, PRs & Security

No automated test suite exists yet. Require linting and builds; manually check rewriting, keyboard submission, selectors, copy behavior, rate limits, responsive layouts, keyboard navigation, and error states. New tests should be `*.test.ts(x)` and add their runner to `package.json`.

Use short imperative commits, such as `Add docker support`. PRs explain user impact, configuration/API changes, manual verification, migration notes, linked issues, and include UI screenshots. Copy `.env.example` to `.env.local`; never commit API keys, Upstash credentials, or `.env*` files.

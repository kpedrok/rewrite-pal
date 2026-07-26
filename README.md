# RewritePal

[![CI](https://github.com/kpedrok/rewrite-pal/actions/workflows/ci.yml/badge.svg)](https://github.com/kpedrok/rewrite-pal/actions/workflows/ci.yml)
![Tests](https://img.shields.io/badge/tests-Bun%20Test%20%2B%20Playwright-f9f1e1?logo=bun&logoColor=black)

RewritePal is a focused AI writing assistant that rewrites supplied text while
preserving its intent and applying optional tone, role, and language choices.
It is built as a small, production-oriented Next.js App Router project.

![RewritePal interface](public/images/rewritepal-overview.png)

## Stack

- Next.js 16, React 19, TypeScript, and React Compiler
- Tailwind CSS 4 with shadcn/Radix UI primitives
- Vercel AI SDK with OpenAI
- Upstash Redis for rate limiting and the public rewrite counter
- Biome, Bun Test, Playwright, and Bun

## Local development

Prerequisites: Bun 1.3.14+ and Node.js 22+.

```bash
cp .env.example .env.local
bun install
bun dev
```

Set these variables in `.env.local` (never commit this file):

```bash
OPENAI_API_KEY=
RATE_LIMIT_HASH_SECRET=
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
```

Generate a unique rate-limit secret with at least 32 characters for each
deployment environment. Configure it before deploying this revision; rewrite
requests fail safely until it exists. Keep it stable because changing it resets
active rate-limit identities.

## Quality checks

```bash
bun run check       # lint, formatting, and safe static checks
bun run typecheck   # TypeScript without emitting files
bun run test        # unit and route contracts, including rate limits and counters
bun run test:e2e    # mocked browser journey through the rewrite flow
bun run eval        # paid, manual AI-quality evaluation; writes a local report
bun run build       # production build
bun audit --prod    # production dependency advisories
```

GitHub Actions runs a frozen install, dependency audit, static checks, type
check, tests, and production build on pull requests and pushes to `master`.

## Architecture decisions

- The homepage and root layout remain Server Components. Client boundaries are
  limited to the rewrite experience, theme controls, and mobile navigation.
- A shared Zod contract validates every rewrite request before prompt creation.
  Prompt construction is a pure function with focused unit tests.
- Form choices use local React state because they belong to one screen. This
  avoids global-state machinery for temporary UI state.
- The completed-rewrite counter remains visible as a non-critical
  client/server metric. Only a completed generation schedules its server-side
  increment; the browser can only read the displayed count.
- Redis and environment configuration are lazy server-only modules; routes fail
  safely when required deployment variables are absent.
- Playwright mocks provider and counter endpoints, so the core browser journey
  is deterministic and does not spend API credits in CI.
- The committed rewrite eval set shares production generation settings, then
  scores real outputs with deterministic checks and a structured LLM rubric.
  See [the eval guide](docs/evals.md).
- Temporary PostCSS and Sharp overrides patch audited transitive dependencies
  until a stable Next.js release declares those safe versions directly.

## Project structure

```text
app/                  routes, metadata, and API route handlers
components/rewrite/   interactive rewrite feature
components/ui/        reusable shadcn/Radix primitives
docs/                 focused supporting documentation
e2e/                  realistic mocked browser journeys
evals/                paid, opt-in rewrite-quality evaluations
lib/constants/        shared rewrite options
lib/rewrite/          request contract and prompt construction
lib/server/           server-only integrations and request handling
public/               static product assets
```

## Security and privacy

The rewrite endpoint rate limits a keyed digest derived from Vercel’s trusted
proxy header; the raw address is not used as the Redis key. Submitted text is
sent to OpenAI to generate a rewrite and is not intentionally written to the
application database or logs. See the in-product privacy notice for the
provider and infrastructure boundary.

## Contributing

Keep changes small and accessible, run the quality checks above, and describe
any environment-variable or user-facing behavior changes in the pull request.

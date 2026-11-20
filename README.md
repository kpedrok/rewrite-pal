# RewritePal

[![CI](https://github.com/kpedrok/rewrite-pal/actions/workflows/ci.yml/badge.svg)](https://github.com/kpedrok/rewrite-pal/actions/workflows/ci.yml)
![Tests](https://img.shields.io/badge/tests-Bun%20Test%20%2B%20Playwright-f9f1e1?logo=bun&logoColor=black)

RewritePal is a focused AI writing assistant that rewrites supplied text while
preserving its intent and applying optional tone, role, and language choices.
This repository contains the standalone, MIT-licensed web rewriter.
[Hosted RewritePal](https://www.rewritepal.com/) also offers additional writing tools.

![RewritePal interface](public/images/rewritepal-overview.png)

## Stack

- Next.js 16, React 19, TypeScript, and React Compiler
- Tailwind CSS 4 with shadcn/Radix UI primitives
- Vercel AI SDK with OpenAI
- Upstash Redis for rate limiting and the public rewrite counter
- Biome, Bun Test, Playwright, and Bun

## Local development

Use Bun 1.3.14 or newer and Node.js 22 or newer.

```bash
bun install --frozen-lockfile
cp .env.example .env.local
```

Configure `.env.local` to enable live rewrites.

- `OPENAI_API_KEY` comes from your OpenAI account.
- `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` come from the same
  Upstash Redis database. The app uses Redis for rate limiting and the rewrite counter.
- `RATE_LIMIT_HASH_SECRET` can be blank when running `bun dev`. For a production
  runtime, generate a unique secret with `openssl rand -hex 32` and keep it stable
  across deploys. Changing it resets active rate-limit identities.

Run `bun dev` and open [localhost:3000](http://localhost:3000). Use sample text
to try a rewrite with a tone or output language. Keep `.env.local` out of Git.

### Try the rewrite flow without service credentials

The Playwright suite starts a local server and mocks the rewrite and counter
endpoints. Install Chromium and run the suite after installing dependencies.

```bash
bunx playwright install chromium
bun run test:e2e
```

The suite covers tone and language selection, copying a result, and stopping
a rewrite.

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

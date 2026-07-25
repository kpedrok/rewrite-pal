# Rewrite evals

RewritePal evals measure the quality of model-generated rewrites. They complement
unit, route, and browser tests: those tests protect deterministic code, while
evals make prompt and model changes reviewable.

## Run locally

The runner calls OpenAI twice per case: once to generate the rewrite and once
to judge it. It uses only `OPENAI_API_KEY`; it does not call application routes
or require Redis. Do not add real user text to cases or reports.

```bash
bun run eval
```

Reports are written to `eval-results/` and are intentionally not committed.
Use `bun run eval -- --strict` only after a reviewed baseline defines acceptable
quality thresholds; strict mode fails when a deterministic check fails or the
judge score is below 3 out of 5.

## What is measured

The committed, sanitized cases cover meaning preservation, requested style,
language, custom roles, common formatting, no-invention behavior, and embedded
prompt-injection instructions. The 12-case suite makes 24 model requests per
run and processes them sequentially to keep cost and rate-limit behavior
predictable. Each output receives:

- deterministic checks for non-empty output and case-specific literal content;
- a schema-validated rubric score for meaning, requested style, no invention,
  and treating user text as content.

The judge is an aid, not ground truth. Review every error and quality failure,
and periodically audit passing outputs before changing prompts, models, or
thresholds. Do not add real user text to the committed case set or reports.

## CI and baselines

Live evals run only through the manual `Rewrite evals` GitHub workflow. They are
not part of pull-request CI because they are paid and non-deterministic. The
workflow uploads the JSON report as an artifact for seven days. Artifacts
contain the committed input, generated output, and judge rationale.

First establish a manually reviewed baseline. When the case set and scoring are
stable, compare candidate runs to that baseline before enabling strict mode or
adding regression gates. Record the model, judge model, revision, outputs,
latency, token usage, and scores in every report so comparisons are meaningful.

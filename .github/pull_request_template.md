## Summary

Describe the user-facing change and any environment or API impact.

## Verification

- [ ] `bun run check`
- [ ] `bun run typecheck`
- [ ] `bun run test`
- [ ] `bun run test:e2e` (when browser behavior or the user journey changes)
- [ ] `bun run build`
- [ ] `bun audit --prod`

## Manual checks

- [ ] Rewrite, keyboard submission, and copy behavior work.
- [ ] Error and rate-limit states are clear and safe.
- [ ] Keyboard navigation, labels, and live feedback work.
- [ ] The layout remains usable at a narrow viewport.

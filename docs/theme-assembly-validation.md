# Shared theme and starter assembly — validation record

Implements `docs/superpowers/plans/2026-09-09-shared-theme-starter-assembly.md`
on branch `feature/shared-theme-assembly` (cut from `main` after PR #2 —
`feat/employee-ui-workflows` — was merged, so `--skip-install`,
`scripts/package-plugin.mjs`, and the `neon-review` skill were already
present before this work started). Commits, in order:

1. `f83df06` — `refactor: define canonical theme assets and starter assembly`
2. `be4d5c7` — `refactor: install themes through canonical assets and assembly`
3. `893cfba` — `refactor: remove maintained starter theme copies`
4. `4196435` — `docs: update theme path references to the canonical theme/ layout`
   (doc/skill path updates that were written as part of commit 3's intent
   but missed staging there due to a bad `git add` pathspec — landed as
   their own follow-up commit instead)
5. this commit — `test: verify canonical theme distribution and assembled apps`

## What changed

- `theme/finnomena/{tokens,examples,theme.config.ts,color-overrides.ts,
  createTheme.ts,breakpoints.config.ts,color-mapping.todo.md,theme.css,
  scripts/{sync-tokens,generate-theme-config,generate-breakpoints-config,
  project-config}.mjs}` moved to `theme/{tokens,examples,cds,css,scripts}`.
  `theme/finnomena/scripts/install.mjs` stays as a deprecated forwarding
  shim.
- New `scripts/lib/{assets,assemble-starter,project-config}.mjs` and
  `scripts/{install,assemble-starter,package-plugin}.mjs` — the canonical
  installer/assembler/packager, all at the repo-root `scripts/` path.
- `starters/vitejs-cds/src/theme/*` (the tracked duplicate of the 4 CDS
  files) deleted — `assembleStarter()` supplies it fresh at assembly time.
- `--sync-starter` retired (nonzero exit, no filesystem writes).

## Regeneration regression check (Task 3)

Ran the token pipeline (`sync-tokens.mjs`, `generate-theme-config.mjs`,
`generate-breakpoints-config.mjs`) both against a pre-move baseline copy
(scripted from `origin/main`'s `theme/finnomena/scripts/*.mjs` +
`tokens/*.json`) and against the moved `theme/scripts/*.mjs` +
`theme/tokens/*.json`, then diffed every output
(`tokens.resolved.json`, `tokens.report.json`, `theme.config.ts`,
`breakpoints.config.ts`, `color-mapping.todo.md`). Only path/header-comment
text and the `generatedAt`/`STATUS (regenerated ...)` timestamp lines
differed — no token value changed. `tests/theme-generation.test.mjs`
automates this as a standing regression check (regenerates into a scratch
dir from the committed `theme/tokens/*.json` and diffs the result against
the committed `theme/cds/*.ts` + `color-mapping.todo.md`, timestamp lines
excluded).

## Real (non `--skip-install`) end-to-end checks

Run manually against the actual repo (not just the filesystem-only test
suite), from the scratchpad directory:

```
node scripts/assemble-starter.mjs <scratch>/neon-preview
cd <scratch>/neon-preview && npm install && npm run build   # succeeded
```

```
node scripts/package-plugin.mjs <scratch>/neon-package
node <scratch>/neon-package/scripts/install.mjs <scratch>/neon-package-app --new
cd <scratch>/neon-package-app && npm run build               # npm ci ran for real; build succeeded
grep -rl "<repo-checkout-absolute-path>" <scratch>/neon-package-app/{src,package.json,dist}   # no matches
grep -rl "<repo-checkout-absolute-path>" <scratch>/neon-package/scripts                       # no matches
```

Confirms: the packaged installer scaffolds a real, buildable app with a
real dependency install (`npm ci`, since the starter ships a
`package-lock.json`); nothing in the scaffolded app or the packaged
`scripts/` carries an absolute path back into the source checkout.
`tests/distribution.test.mjs` automates the structural half of this
(symlink scan + absolute-path grep over every packaged `.mjs`/`.ts`/
`.tsx`/`.json` file) using `--skip-install` for speed; the real-install
run above is the one-time non-automated confirmation that the
`--skip-install` shortcut isn't hiding a real dependency-install failure.

## Full suite

```
node --test 'tests/**/*.test.mjs'
```

62 passing (`install`, `assembly`, `theme-generation`, `distribution`,
`skill-packaging`, `project-config`), 0 failing, at the final commit.

## Known follow-ups (not in scope here, per the plan)

- `theme/finnomena/scripts/install.mjs`'s deprecation shim stays for one
  more release; remove only in a later, separately announced compatibility
  change.
- Color mapping (`theme/cds/color-mapping.todo.md`) remains an open human
  decision, unrelated to this migration — untouched here.

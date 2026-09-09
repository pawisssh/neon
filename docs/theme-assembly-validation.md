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

## Installer and navigation review fix-ups

Implements `docs/superpowers/plans/2026-09-09-installer-and-navigation-review-fixes.md`
on the same branch, `feature/shared-theme-assembly`, as a follow-on set of
fixes discovered by review of the work above. Commits, in order:

1. `cadd5d1` — `test: run starter navigation against assembled app`
2. `f79059b` — `fix: validate default theme installation destinations`
3. `0defb68` — `fix: discover workspace manager through manifestless directories`
4. `490196b` — `fix: preflight installer manager configuration before writes`
5. this commit — `docs: correct canonical CSS references and verification record`

### What changed

- Navigation tests (`tests/run-starter-navigation.mjs`) now run against a
  freshly assembled app instead of a maintained starter copy.
- Theme-destination validation (default and explicit CSS/CDS symlink-escape
  checks) is unified through a single `resolveThemeDir` path.
- Workspace-manager evidence discovery now climbs through manifest-less
  grouping directories, starting at the target directory and stopping at a
  `.git` boundary or the filesystem root, instead of stopping short and
  missing evidence. Where the install itself runs is unchanged — still the
  target directory, confirmed by the fake-executable cwd assertion.
- Manager-configuration validation (an invalid `--package-manager` value)
  now happens before any filesystem mutation, in both `--new` and
  existing-CDS install modes, so a bad value never leaves a partially
  written destination.
- `theme/css/theme.css`'s header comment corrected: it referenced the
  pre-migration path `theme/finnomena/theme.config.ts` /
  `theme/finnomena/color-overrides.ts`, which no longer exists. (The
  `theme/finnomena/` directory now holds only the deprecated
  `scripts/install.mjs` forwarding shim — an intentionally-preserved path
  elsewhere in the repo, not referenced anywhere in `theme/css/theme.css`
  itself, and correctly left untouched by this fix.) All 4 occurrences now
  read `theme/cds/theme.config.ts` /
  `theme/cds/color-overrides.ts`, matching where those files actually live
  since commit `f83df06`. No CSS declaration or custom property changed —
  comment text only, confirmed via `git diff -- theme/css/theme.css`
  showing only `*`-prefixed comment lines touched.

### Final verification (this task)

Run from the repo root on this branch, at this task's final commit:

```
node --test tests/*.test.mjs
```

```
ℹ tests 88
ℹ suites 0
ℹ pass 88
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
```

88 passing, 0 failing — this is the correct current total (the "Full
suite" section above, from before this plan's 4 fix-up commits added many
new tests, recorded 62; that count is now stale and is kept above only as
history of that earlier commit, not as the current total).

Run separately (this is a standalone script, not matched by the
`tests/*.test.mjs` glob above):

```
node tests/run-starter-navigation.mjs
```

```
ℹ tests 13
ℹ pass 13
ℹ fail 0
```

13 navigation assertions, all passing. (The plan brief's own text says
"12 navigation assertions"; the actual, observed count after Task 1's
work is 13 — recorded here from a real run, not copied from planning
text.)

Concurrent-safety check — two navigation runners launched at once, to
confirm their per-run `mkdtempSync` temp directories (Task 1) don't
collide:

```
node tests/run-starter-navigation.mjs & node tests/run-starter-navigation.mjs & wait
```

Both runs completed independently with `13 pass, 0 fail` and exit code 0;
no interference between the two temp directories.

Disposable-app build, assembled outside the repo:

```
node scripts/assemble-starter.mjs <scratch>/task5-app.XXXXXX/app
```

succeeded (`Theme files: theme.config.ts, color-overrides.ts,
createTheme.ts, breakpoints.config.ts`). `starters/vitejs-cds/node_modules`
in this repo checkout was already fully installed with the complete
dependency tree (vite, react, @coinbase/cds-web, typescript, etc. — not a
partial/esbuild-only install), and its `package-lock.json` was verified
byte-identical to the assembled app's `package-lock.json` (`diff` showed
no output). Dependencies were therefore **reused**, not freshly installed:
a symlink was made from the disposable app's `node_modules` to
`starters/vitejs-cds/node_modules`, and

```
npm run build   # tsc --noEmit && vite build
```

succeeded fully offline (1696 modules transformed, `dist/` produced, "built
in 636ms"). The disposable app's temporary parent directory was removed
afterward (`rm -rf` on the temp dir removes the symlink itself, not its
target — the real `starters/vitejs-cds/node_modules` in this repo was
confirmed intact afterward, still ~290M with its package directories
present).

Repo cleanliness, checked after all of the above:

```
git diff --check    # exit 0, no output
git status --short  #  M theme/css/theme.css   (only this task's own edit)
```

No `starters/vitejs-cds/src/theme/` directory exists (confirmed absent),
and no stray root `node_modules/` or root `package-lock.json` landed in
the repo checkout (both confirmed absent).

### Package-manager-selection tests: what they do and don't prove

All of the package-manager-selection and command-building tests in this
suite (`tests/*.test.mjs`, e.g. the "selects pnpm/yarn/bun", "rejects
conflicting lockfile evidence", "dependencyCommand builds ... add", and the
"--package-manager" preflight-validation tests) are **filesystem and
argument-only mocks**: they write fake lockfiles / `package.json`
`packageManager` fields and fake `npm`/`pnpm`/`yarn`/`bun` shell scripts
into a scratch `PATH`, or set `PATH: ''` to deliberately prevent any real
process invocation, and assert on which command string the installer
*would* run or which manager it *would* select. None of them shell out to
a real `pnpm install`, `yarn install`, or `bun install`, and none of them
run on Windows — this record makes no claim that any test suite performed
a real pnpm or yarn installation, or that any test ran on a Windows
environment. The only *real*, non-mocked package-manager installs recorded
in this document are the `npm install` / `npm ci` runs under "Real (non
`--skip-install`) end-to-end checks" above, and this task's own reused,
symlink-based `npm run build` — both npm only.

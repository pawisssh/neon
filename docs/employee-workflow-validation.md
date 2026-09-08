# Employee UI workflow validation and release-readiness report

Task 8 of the `2026-09-09-employee-ui-workflows` plan
(`.superpowers/sdd/2026-09-09-employee-ui-workflows/task-8-brief.md`).
Validates Tasks 1–7's implementation end-to-end and assesses release
readiness. Row-by-row scenario evidence lives in
[`tests/scenarios/employee-workflows.md`](../tests/scenarios/employee-workflows.md);
this document is the aggregate report the brief's checklist maps to.

**Validated against:** commit `de6941b` (branch `feat/employee-ui-workflows`,
15 commits ahead of `main`). See **A note on scope** below — one of those
commits (`de6941b`) landed mid-session from a separate, unrelated effort and
is not part of Tasks 1–7 of this plan.

---

## A note on scope: unrelated concurrent work landed on this branch

At the start of this task, this branch had uncommitted working-tree changes
from a separate, unrelated effort: a 4th skill, `neon-review` (read-only UI
review), plus small additive routing hooks for it in `neon-audit`. Per this
task's brief, that work was explicitly out of scope and was not to be
validated, fixed, or reverted.

**During this session, that work was committed** (commit `de6941b feat: add
neon-review skill for read-only UI reviews`) by whatever process/session
owns it — not by this task. This is reported for visibility, not alarm: the
commit is byte-identical to the uncommitted diff already reviewed and ruled
out of scope at the start of this task (confirmed via `git diff` against
the prior HEAD), so nothing about its content is new information. Its
practical effects on this report:

- `.claude-plugin/plugin.json` now lists **4** skills, not 3 — `neon-review`
  is real, present, and shipping. This is not a regression in the 3
  plan-scope skills; the plan's own 3 entries (`neon-create`,
  `neon-redesign`, `neon-audit`) are all still present and correctly
  pathed.
- The clean-checkout verification and README forward-check below were run
  against this new HEAD (not the stale one from before the commit landed)
  so they reflect what actually ships.
- `neon-review`'s own correctness (its `SKILL.md`, `review-checks.md`, its
  own scenario file) was **not audited** by this task — genuinely out of
  scope, same as before the commit landed.
- This task's own commit (below) is scoped to its own new/modified files
  only, staged by explicit path — it does not re-touch or re-narrate
  `neon-review`'s files.

## 1. Automated test suites (brief bullet 1)

Reconfirmed at current HEAD (`de6941b`), not just the pre-session HEAD the
controller checked:

```
node --test tests/install.test.mjs tests/project-config.test.mjs tests/skill-packaging.test.mjs
→ tests 44, pass 44, fail 0

node tests/run-starter-navigation.mjs
→ tests 12, pass 12, fail 0
```

Both suites re-run clean after the concurrent commit landed (that commit
added one new test to `skill-packaging.test.mjs` for `neon-review`'s own
packaging — accounted for in the 44 total).

`git diff --check main...HEAD` → clean, exit 0 (reconfirmed at current
HEAD).

## 2. Scenario table (brief bullet 3)

All 14 rows executed and recorded — see
[`tests/scenarios/employee-workflows.md`](../tests/scenarios/employee-workflows.md)
for full detail per row. Summary:

| # | Scenario | Method | Result |
| --- | --- | --- | --- |
| 1 | New project | Real fixture + desk-check | PASS with limitations (render check partial — no browser available; content-building traced via unambiguous prose, not run live) |
| 2 | New screen | Desk-check | PASS |
| 3 | Full restyle | Desk-check | PASS |
| 4 | Colors only | Desk-check | PASS |
| 5 | Partial scope | Desk-check | PASS |
| 6 | Non-React | Real fixture | PASS |
| 7 | Follow-up | Desk-check | PASS |
| 8 | Fresh generic request | Desk-check | PASS |
| 9 | Existing CDS | Desk-check | PASS |
| 10 | Font/dark mode | Desk-check | PASS |
| 11 | Customized rerun | Real fixture | PASS (minor: raw stack-trace error presentation) |
| 12 | Monorepo | Real fixture | **FAIL for the realistic workspace shape** — real defect found, see Findings below |
| 13 | Invalid CLI | Real fixture + existing unit coverage | PASS (minor: raw stack-trace error presentation) |
| 14 | SSR | Desk-check | PASS for client/provider-boundary correctness; "build succeeds" **not verified** (no real Next.js build ran) |

**13 of 14 rows pass their required result** (10 fully, 3 with named,
honestly-scoped limitations). **1 of 14 (Monorepo) genuinely fails** for the
common real-world workspace shape — see Findings.

## 3. npm scaffold install/build (brief bullet 2)

Real, fresh cycle run from a `git archive HEAD` clean checkout (not the
dirty working tree, which has stray `node_modules`/`dist` under
`starters/vitejs-cds/` from earlier ad hoc verification — using the dirty
tree would have copied those into the fixture via `--new`'s `cpSync`,
contaminating the result):

```
node theme/finnomena/scripts/install.mjs <scratch> --new   → exit 0
npm install                                                 → 238 packages, exit 0
npm run build  (tsc --noEmit && vite build)                 → exit 0
```

**Exact versions:**

| | Version |
| --- | --- |
| node | v26.7.0 |
| npm | 11.19.0 |
| `@coinbase/cds-web` | 9.26.1 |
| `react` / `react-dom` | 18.3.1 |
| `vite` | 5.4.21 |
| `typescript` | 5.9.3 |

**Additional package managers:** `install.mjs` and its docs claim support
for `npm`/`pnpm`/`yarn`/`bun`. Checked this environment: `which pnpm`,
`which yarn`, `which bun` all report **not found** — none of the three is
installed here. **No real scratch install with pnpm/yarn/bun was possible
in this environment.** Their support is currently verified only at the
unit-test level (`tests/install.test.mjs`'s `project-config.mjs` tests,
which exercise `selectPackageManager`/`dependencyCommand` as pure functions
with `PATH=''` so no real binary is ever invoked, plus this task's own
Monorepo-scenario real-subprocess test which got as far as attempting `pnpm
add ...` before failing on `ENOENT`). **Narrow any release claim of "tested
with pnpm/yarn/bun" accordingly** — treat a real scratch install with each
of those three as pre-release or immediate post-release follow-up work in
an environment that actually has them installed.

## 4. Packaged/clean-checkout verification (brief bullet 4)

`git archive HEAD | tar -x` into a scratch directory (excludes anything not
actually committed, including all of the working tree's stray
`node_modules`/`package-lock.json`/`dist` clutter by construction).
Confirmed present: `theme/finnomena/` (all scripts, all 4 baked theme
files, `theme.css`, the raw `tokens/*.json` source, `examples/`),
`starters/vitejs-cds/` (including its committed, pre-wired `src/theme/`,
`src/app/`, `src/layout/`), `design-md/finnomena/` (DESIGN.md +
`design_tokens.json` + `tailwind.config.js`), all 4 skill directories with
their `references/` subdirectories (3 in scope for this plan + the
concurrently-landed `neon-review`), root `README.md`, and
`.claude-plugin/plugin.json`.

**Every `${CLAUDE_PLUGIN_ROOT}/...` cross-reference resolves.** Extracted
all 18 unique reference paths from every skill doc in the clean checkout
and confirmed each one exists on disk there — none are missing. (List:
`design-md/finnomena/DESIGN.md`; the 4 skill directories and their
`SKILL.md`s; `neon-audit/references/{project-inspection,theme-integration,
workflow-contract}.md`; `neon-create/references/new-ui-workflow.md`;
`neon-redesign/references/{style-migration,verification}.md`;
`theme/finnomena/{color-overrides.ts,theme.config.ts,theme.css,
examples/app-entry.tsx,scripts/install.mjs}`.)

**Confirmed-fine, not a defect:** `theme/finnomena/tokens.resolved.json`
and `tokens.report.json` are absent from the clean checkout (they're
`.gitignore`d, by design — see that file's own comment: "mechanically
reproduced... not a source of truth"). Checked: no skill doc and no code in
`install.mjs` references either file. They're maintainer-only
token-regeneration-pipeline artifacts, not a runtime dependency of the
shipped plugin — their absence from a clean checkout is correct, not a
packaging gap.

**A separate, pre-existing doc-accuracy issue, fixed as part of this
task:** `README.md`'s "Maintainer notes" section linked to
`[notes/README.md](notes/README.md)`. `notes/` is deliberately
`.gitignore`d (same rationale as above — internal working notes, not
distributed) and, checked directly, `notes/README.md` doesn't exist even in
this maintainer's own local working tree, let alone a clean checkout — the
link was broken for everyone. Fixed in this task's README edit (see §6).

## 5. Host-specific resource-root resolution (brief bullet 5)

Every skill doc's cross-reference uses `${CLAUDE_PLUGIN_ROOT}/...`. This is
a Claude Code plugin-loader mechanism — populated by Claude Code's own
plugin-loading process. **This session has no way to run a real Codex CLI
host, so this cannot be tested directly here — stated plainly rather than
guessed at.**

Reasoning for why the README's existing Codex manual-install fallback
(clone the repo, symlink each skill folder individually into
`~/.agents/skills/`) is **likely, not merely "untested," to break every
cross-reference**:

1. `CLAUDE_PLUGIN_ROOT` is an Anthropic/Claude-Code-specific variable name.
   There's no evidence in this repo, or reason from how the fallback is
   described, that Codex CLI defines or populates it at all.
2. Even in a best-case guess about how an analogous Codex mechanism might
   work, the fallback symlinks each **skill's own subfolder**
   (`~/.agents/skills/neon-audit`) individually — not the whole cloned repo
   root (`~/finnomena/neon`). Every cross-reference in every skill doc is
   written relative to the **repo root** (`${CLAUDE_PLUGIN_ROOT}/theme/
   finnomena/...`, `${CLAUDE_PLUGIN_ROOT}/design-md/...`), not the skill's
   own directory — so even a variable that resolved to "the skill's own
   root" would resolve every one of these paths incorrectly.
3. The "Codex Skill Installer" path (the *recommended* Codex install
   method, not just the fallback) is described as installing **one skill
   subfolder at a time from a URL** — meaning even the sibling assets
   themselves (not just the variable) may not be present alongside the
   installed skill, independent of the `CLAUDE_PLUGIN_ROOT` question
   entirely.

**Action taken:** added a small, explicit caveat to the README's Codex
manual-install section (see §6) stating this is unverified and likely
broken, with a one-line workaround (point Claude at the full cloned repo
path explicitly instead of relying on the variable). Did not attempt to
rewrite the Codex install flow itself — that's a bigger change than this
task's file-list scope, and genuinely needs a real Codex CLI session to
verify correctly rather than a second guess from this environment.

## 6. README / manifest verification (brief bullet 6)

**Old-name sweep:** relied on the controller's already-completed clean
sweep (one hit, a false-positive tmpdir-naming string in
`tests/install.test.mjs`, unrelated to the old skill names) — reconfirmed
no old-name (`neon-theme-css`/`neon-theme`/`neon-starter`) references
anywhere in `README.md` at current HEAD (`grep` returns nothing).

**Forward check — spot-checked the more likely-to-drift claims:**

- Command table (`/neon:neon-audit`, `/neon:neon-redesign`,
  `/neon:neon-create`, `/neon:neon-review`) matches `plugin.json`'s 4
  `skills` entries and the 4 actual skill directories — all present,
  correctly pathed.
- "What's here" tree's `starters/vitejs-cds/src/{app,layout,theme}` claim —
  confirmed present in the clean checkout.
- "What's here" tree's `install.mjs --sync-starter` mention — confirmed
  this flag exists and behaves as described (reads `theme/finnomena/`'s 4
  files, writes them into `starters/vitejs-cds/src/theme/`, no
  `package.json` read, no npm call — matches `install.mjs`'s own header
  comment).
- `.claude-plugin/marketplace.json` and `marketplace.example.json` both
  reference the plugin by its current name (`neon`) with descriptions
  consistent with the 4-skill reality — no drift found.
- **Found and fixed:** the broken `notes/README.md` link (§4 above).
- **Found and fixed:** added the Codex `CLAUDE_PLUGIN_ROOT` caveat (§5
  above).

Did not re-read the entire 320-line README line by line beyond these
targeted checks, per the brief's own "spot-check... rather than re-reading
the entire file" guidance — no other claim checked showed drift.

## 7. Version metadata (brief bullet 7)

`plugin.json`'s `version` was `"0.3.1"`, unchanged since before this
entire plan's work began (`git log` shows the 0.3.1 bump commit,
`6c226a0`, predates every rename/merge/installer-rewrite commit in this
plan). Scope of what shipped under that still-0.3.1 version number:

- A public skill **rename**: `neon-theme-css` → `neon-redesign`.
- A public **2-into-1 merge**: `neon-theme` + `neon-starter` →
  `neon-create` (two skill names removed entirely).
- New, previously-nonexistent installer capabilities:
  `--theme-dir`/`--package-manager`/`--skip-install`, plus a
  workspace-root package-manager evidence walk.
- New starter runtime behavior (bottom-nav mobile layout, navigation
  prop-threading) that changes what a freshly-scaffolded app renders.

Anyone who scripted, documented, or built tooling against the old skill
names (`neon-theme-css`, `neon-theme`, `neon-starter`) would find those
skills gone — a real breaking change, shipped under an unchanged version
number.

**Decision: bump to `0.4.0`.** Reasoning: this repo is pre-1.0 (`0.x`), and
under the common `0.x` semver convention a patch version (`0.3.1` →
`0.3.2`) is for backwards-compatible fixes only — a breaking rename/removal
of public entry points warrants a **minor** bump (patch is reserved for
non-breaking fixes; without crossing 1.0, "breaking" maps to minor, not
major). `0.4.0` was applied to `.claude-plugin/plugin.json` as part of this
task's commit. **No tag was created, nothing was published, and the
marketplace manifest was not touched** — this is a metadata-only change per
the brief's explicit "publish only with explicit authorization," which
this task does not have.

## 8. Findings requiring the controller's attention

### 8.1 Monorepo real-workspace-shape defect (release-gate relevant)

**Real, verified defect**, not a fixture-construction mistake — see
scenario 12's full write-up in
[`tests/scenarios/employee-workflows.md`](../tests/scenarios/employee-workflows.md).

Summary: `install.mjs`'s workspace-root package-manager evidence walk
(Task 3's fix, `findPackageManagerEvidence` in
`theme/finnomena/scripts/install.mjs`) stops early — "gives up... at an
ancestor with no `package.json`." In the **standard** pnpm/yarn workspace
shape, where an intermediate glob directory like `apps/` has no
`package.json` of its own (only the workspace root and each member app
do), this causes the walk to give up before reaching the real
`pnpm-lock.yaml` at the workspace root, silently falls back to npm, and —
because npm's own workspace auto-detection is *not* gated the same way —
a real `npm install` run in that shape writes a genuine second lockfile
(`package-lock.json`) at the workspace root, next to the pre-existing
`pnpm-lock.yaml`. Directly contradicts the Monorepo scenario's required
result ("no second lockfile") for the common case, not an edge case.

The existing unit test suite's own "stops walking upward at an ancestor
with no `package.json`" test (`tests/install.test.mjs`) currently encodes
this behavior as a **passing assertion** — the test is green, but the
behavior it certifies is the release-gate-relevant defect. This affects the
plan's own "Minimum release gate" line item **"correct package/destination
selection."**

This task's scope (per its file list) does not include patching
`install.mjs` — flagging for the controller to decide whether this blocks
release or ships as an immediate follow-up. Recommendation: the evidence
walk's safety-valve condition should stop only at true workspace/repo
boundaries (e.g. a directory with neither a `package.json` nor any
`packages`/`apps`-shaped sibling with one) rather than at the first
manifest-less intermediate directory, since intermediate directories with
no manifest are the *normal* shape, not a boundary signal.

### 8.2 Codex CLI resource-root resolution — unverified, likely broken

See §5 above in full. Not independently testable in this environment;
reasoned through explicitly rather than asserted. A small README caveat
was added; the underlying Codex install flow itself was not redesigned
(out of this task's scope, and genuinely needs a real Codex session to get
right).

### 8.3 CLI error presentation is rougher than the required result

Both the Customized-rerun and Invalid-CLI scenarios pass their required
result (nonzero exit before any write) but do so via raw, uncaught Node
stack traces rather than a clean one-line CLI error message. Not a
correctness defect against anything this plan's scenarios require — flagged
as a minor UX polish item, not release-blocking.

### 8.4 Unrelated concurrent commit landed on this branch mid-session

See "A note on scope" above. Not a defect in Tasks 1–7's work — flagged
purely so the controller isn't surprised by a 4th skill/version-affecting
commit (`de6941b`) they didn't request as part of this plan, sitting on the
same branch this task's own commit will land on.

## 9. Overall release-readiness assessment

Against the plan's own **Minimum release gate** ("reliable activation, no
repeated consent, visible scoped restyling, correct package/destination
selection, preserved behavior, preserved customizations, and completed
verification for advertised employee journeys"):

| Gate criterion | Status |
| --- | --- |
| Reliable activation | Met — desk-checked via consistent, redundant activation guards across all skills (scenarios 7, 8) |
| No repeated consent | Met — desk-checked via `workflow-contract.md`'s intent policy (scenario 7) |
| Visible scoped restyling | Met — desk-checked via scope-conflict detection + worked example (scenario 5) |
| **Correct package/destination selection** | **Not met for the realistic monorepo shape** — real, verified defect (§8.1) |
| Preserved behavior | Met — desk-checked via style-migration.md's explicit form-behavior verification requirement (scenario 3) |
| Preserved customizations | Met — real fixture, verified byte-for-byte (scenario 11) |
| Completed verification for advertised employee journeys | **Partially met by this task itself** — 5 of 14 scenarios got real command execution; 9 of 14 rest on desk-check tracing of unambiguous skill prose rather than a live agent run. This task's own evidence standard, stated honestly per scenario, is the ceiling of what "completed verification" means here — it is not a substitute for running each journey with a live agent in a real host, which remains unexecuted for those 9. |

**Overall: not fully clear for release as-is.** Six of seven gate criteria
are met (five cleanly, one — verification completeness — met only to the
standard this task itself could apply, which is real-but-partial). The
seventh, **correct package/destination selection, has a real, verified
failure** for the standard-shape monorepo case, independent of anything
introduced during this validation. Recommend either fixing §8.1 before
release or explicitly scoping the release announcement to exclude monorepo
pnpm/yarn support until it's fixed. Everything else validated in this task
— the three in-scope skills' routing, scope discipline, font/dark-mode
handling, SSR provider-boundary guidance, customization-preserving
installer behavior, and the packaged/clean-checkout asset completeness —
held up under real execution where real execution was possible, and under
close prose-tracing where it wasn't.

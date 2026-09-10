# Repository Organization and Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking. Delegate only if the user explicitly requests it.

**Goal:** Organize maintained source, evaluator inputs, internal fixtures, and local outputs while preserving plugin discovery, public commands, and existing user data.

**Architecture:** Keep the established plugin root and distributed paths. Organize evaluator internals by responsibility, move local research and run history under `.local/`, and track curated documentation and evaluator source through precise ignore rules.

**Tech Stack:** Node.js 20+, ESM, Playwright, Git, Markdown, existing Vite/React starter.

**Spec:** The approved direction from the repository-organization conversation is reproduced in “Design decisions” and “Target hierarchy” below; this plan is self-contained.

## Global Constraints

- Preserve `.claude-plugin/`, `skills/`, `design-md/`, `theme/`, `templates/`, and `scripts/` public paths.
- Preserve `npm test`, `test:functional`, `test:immersive`, and `selftest` in `evals/design-md/`.
- Preserve all local research, generated apps, reports, and nested repositories; do not delete or publish them.
- Keep dependencies beside their package and ignored. Do not relocate package-local `node_modules/` independently.
- Do not restore the root `tests/` directory deleted at the user's request.
- Do not alter design tokens, visual acceptance criteria, or installer behavior during this migration.
- Do not stage unrelated changes, force-add local research, publish, or commit without user authorization.
- Keep this plan at its current path; move older plans, not the active migration plan.

## Design decisions

The previous suggestion to create `plugin/`, rename `design-md/`, and move all scripts into `tooling/` would break path contracts without a demonstrated benefit. The package allowlist and skill references already depend on these root directories. Keep them and improve ownership within them.

Folder size alone is not evidence of poor structure: installed dependencies are normal local state. The concrete problems are blanket ignores for maintained files, stale combined-guide links, generated apps beside evaluator source, and reusable visual-review content embedded in runner code.

Existing ignored documents are not automatically approved for tracking. Preserve them under `.local/`; create new curated documentation for the repository. Preserve historical reports byte-for-byte, including their old absolute paths, and document that those paths may no longer resolve after migration.

## Target hierarchy

```text
neon/
  .claude-plugin/                    # tracked manifests
  skills/                           # distributed skills and references
  design-md/
    README.md                       # guide selection and ownership
    finnomena/{functional-layout,immersive-layout}/
  theme/                            # canonical tokens, adapters, generators
  templates/vitejs-cds/              # starter and package-local dependencies
  scripts/                          # stable installer/assembly/package commands
  docs/
    README.md
    architecture/repository-structure.md
    superpowers/plans/2026-09-10-repository-restructure.md
  evals/design-md/
    README.md
    package.json
    package-lock.json
    run.mjs
    playwright.config.mjs
    generation/{functional,immersive}.md
    harness/
      oracles/{functional,immersive}.mjs
      specs/{functional,immersive,visual-capture}.spec.mjs
      review/{functional-rubric,immersive-rubric,report-template}.md
      review/package.mjs
    selftest/
      selftest.mjs
      fixtures/showcase.html
  .local/
    migrations/repository-restructure.json
    research/{references,resources}/
    notes/{ideas,superpowers}/
    evals/design-md/{generated,artifacts}/
```

## Task 1: Record a recoverable migration inventory

**Files:** Create `.local/migrations/repository-restructure.json` during execution.

**Produces:** A manifest with `source`, `destination`, file SHA-256 values, symlink targets, and move status for each entry below.

- [x] Inspect `git status --short`, `git ls-files`, and ignored files before editing. Record existing user modifications.
- [x] Inspect nested `.git` directories/files and symlinks in local research and generated apps. Preserve those trees intact; do not dereference symlinks or discard repository metadata.
- [x] Record these exact moves; reject any destination that already exists rather than merging it:

| Source | Destination |
| --- | --- |
| `docs/references/` | `.local/research/references/` |
| `docs/resources/` | `.local/research/resources/` |
| `docs/ideas/` | `.local/notes/ideas/` |
| Existing `docs/superpowers/` contents except this plan | `.local/notes/superpowers/`, preserving relative paths |
| `evals/design-md/test-project-claude-sonnet-5-attempt-01/` | `.local/evals/design-md/generated/test-project-claude-sonnet-5-attempt-01/` |
| `evals/design-md/test-project-gemini-3.1-pro-low-attempt-01/` | `.local/evals/design-md/generated/test-project-gemini-3.1-pro-low-attempt-01/` |
| `evals/design-md/artifacts/` | `.local/evals/design-md/artifacts/` |

- [x] Hash regular files with Node `createHash('sha256')`; record links with `lstat`/`readlink`. Exclude dependency/build contents from hashing but preserve them in moves. Record their directory existence separately.
- [x] Confirm the manifest covers all intended move targets and excludes `.git/`, installed caches outside these targets, and distributed source.

## Task 2: Separate evaluator source by responsibility

**Files:** Modify evaluator runner/config/package scripts; create `generation/`, `harness/`, and `selftest/` contents shown above.

**Interfaces:** Keep runner CLI flags and result metadata fields compatible. Node modules resolve paths from `import.meta.url`, not the caller's current directory.

- [x] Move `specs/functional.spec.mjs` and `specs/immersive.spec.mjs` under `harness/specs/`; rename the capture spec to `visual-capture.spec.mjs` there.
- [x] Split `expected.mjs` into the two oracle modules. Functional owns functional routes, geometry, boundaries, and sidebar behavior. Immersive owns its full-width expectation, palette, tier/asset colors, and viewport list. Preserve existing assertion values. Update imports explicitly.
- [x] Move `validation/selftest.mjs` to `selftest/selftest.mjs`, and `validation/showcase.html` to `selftest/fixtures/showcase.html`. Update its fixture URL and the package self-test script.
- [x] Set Playwright `testDir` to `./harness/specs`; retain scene filtering with the renamed capture spec.
- [x] Split the combined generation prompt into `generation/functional.md` and `generation/immersive.md`. Each includes only its guide path, scenario, necessary hooks, and delivery contract. Functional requires `/`, `/detailed`, `/content`, `/simple`; immersive requires `/` and `/immersive`. Both specify the same CSS-variable naming convention that existing assertions require. Neither includes oracle values, test source, or review rubrics.
- [x] Update generated-project destinations in the prompts to `.local/evals/design-md/generated/test-project-[MODEL_NAME]-[SCENE]-attempt-01` relative to repository root.
- [x] Keep `prompt.md` as a short compatibility index linking the scene prompts; identify it as orchestration instructions, not a third generation scenario.
- [x] Extract current brief/rubric/report text without changing its meaning. Define `writeReviewPackage({ output, metadata, scene })` in `harness/review/package.mjs`; it reads the matching Markdown sources and creates the existing manifest/prompt artifact names. Import it from the runner.
- [x] Add `generationPromptHashes` and `oracleHashes` objects keyed by selected scene. Retain legacy aggregate `promptSHA256`/`oracleSHA256` fields as deterministic hashes of selected input bytes in functional-then-immersive order; document that definition.
- [x] Run `node --check` on changed ESM files. List Playwright tests through the runner for each scene and verify selection still includes capture tests.

## Task 3: Move local material and redirect future outputs

**Files:** Manifest from Task 1; `evals/design-md/run.mjs`; documentation for moved local material.

- [x] Execute manifest moves with explicit source and destination paths. Update move status after each success. Stop on collisions or missing sources that disagree with the inventory.
- [x] Set new run output to `.local/evals/design-md/artifacts/<run-id>/`, resolved from repository root. Keep the console prefix `Evaluation artifacts:` because self-test uses it.
- [x] Resolve screenshot output paths through the existing `EVAL_OUTPUT` environment variable; do not reconstruct the old evaluator-local artifacts path.
- [x] Verify regular-file hashes and symlink targets after moving. Preserve old reports unchanged and add a local migration note mapping old directory prefixes to new prefixes.
- [x] Document rollback: stop active runners, verify original destinations are free, reverse manifest moves in reverse order, and restore only migration-owned source edits. Never use a broad Git reset.

## Task 4: Clarify documentation, ignore rules, and guide routing

**Files:** `.gitignore`, evaluator `.gitignore`, root `README.md`, new documentation shown in the target hierarchy, and skill/reference files containing stale guide paths.

- [x] Replace blanket `docs/`, `evals/`, and `.claude-plugin/` ignores with explicit local/generated exclusions. Keep `.local/`, `.claude/`, `.DS_Store`, `node_modules/`, `dist/`, existing reproducible token reports, and `.superpowers/` ignored. Preserve `tests/` exclusion; no root tests are recreated.
- [x] Retain legacy evaluator output ignores to avoid exposing historical files accidentally if any old path is recreated. Keep `.claude-plugin/plugin.json` and marketplace metadata visible to Git; inspect other local manifest-directory entries before removing any broad exclusion.
- [x] Search maintained source for `design-md/finnomena/DESIGN.md`. Replace links with explicit guide selection: functional for workspaces, immersive for landing pages. For shared brand claims, point to the relevant existing section of the selected guide rather than inventing a combined guide.
- [x] Add `design-md/README.md` explaining the two standalone guides and distinguishing optional token/Tailwind exports from canonical `theme/tokens/` inputs.
- [x] Add `docs/README.md` and `docs/architecture/repository-structure.md` with the directory map, ownership, packaging boundary, local research location, and existing token/starter commands.
- [x] Update root/evaluator READMEs with new paths and commands. Clarify that reviewer packages are for evaluation agents and generation prompts are for generation agents; directory separation alone does not enforce access isolation.
- [x] Verify `git status --short --untracked-files=all` shows maintained source without research dumps, generated projects, or reports. Do not stage or publish files.

## Task 5: Validate distribution and evaluator compatibility

**Consumes:** Completed migration, updated paths, and preserved package commands.

- [x] Run packaging and assembly in new temporary directories, using existing public commands:

```sh
node scripts/package-plugin.mjs /absolute/empty/temporary/plugin-destination
node scripts/assemble-starter.mjs /absolute/empty/temporary/starter-destination
```

Create the empty destinations with `mktemp -d` at execution time and pass their resolved paths. Confirm the plugin contains manifests, all four skills, both guides, theme assets, and starter source. Confirm it excludes `.local/`, evaluator code, dependencies, and research.

- [x] Inspect the assembled starter's package scripts, install using its lockfile where present, and run its declared build command. Record dependency/network blockers separately from source failures.
- [x] Run the complete evaluator self-test:

```sh
cd evals/design-md
npm run selftest
```

Expected existing coverage is 88 combined checks, 68 functional-only checks, and 20 immersive-only checks, with all deliberate faults detected and recovery passing. Investigate count changes rather than weakening assertions.

- [x] Confirm screenshots and review packages are written under the new output root: 12 combined images, 9 functional images, and 3 immersive images at the existing three widths.
- [x] Confirm scene runs hash only selected guide files and generation inputs, and reported image paths resolve to actual files.
- [x] Run `git diff --check`; inspect newly untracked Markdown/ESM for trailing whitespace because Git diff does not check untracked files. Check all changed relative links and imported modules.
- [x] Deliver the migration manifest location, updated hierarchy, validation results, and any historical absolute-path limitations. Leave all changes reviewable; do not commit or publish without authorization.

## Acceptance criteria

- Existing plugin discovery, packaging, installer/assembly commands, and evaluator commands still work.
- Every moved local source file is preserved and accounted for by the migration manifest.
- Maintained evaluator code and curated documentation are eligible for version control; local material remains ignored.
- Both standalone generation prompts can be used without supplying the other guide.
- Each evaluator scene produces its expected contract and screenshot outputs at the new location.
- This implementation plan remains at `docs/superpowers/plans/2026-09-10-repository-restructure.md` throughout the migration.

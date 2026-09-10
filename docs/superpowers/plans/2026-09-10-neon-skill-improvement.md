# Neon Skill Improvement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking. Run independent evaluation in fresh contexts when authorized; do not delegate implementation automatically.

**Goal:** Make Neon more reliable at translating a user brief into appropriate Finnomena UI, while preserving its existing installation, scope, and review safeguards.

**Architecture:** Retain the four skills and two standalone design guides. Make skill entrypoints concise decision guides, keep technical procedures in existing references, and add a small shared design-decision reference. Validate instruction changes through realistic skill scenarios alongside the existing guide-only evaluator.

**Tech Stack:** Markdown/YAML skill instructions, existing Node.js 20+ tooling, Vite/React/TypeScript/CDS starter, Playwright evaluation.

**Spec:** The proposed design and acceptance criteria below are the self-contained specification, based on the preceding Taste-skill review and the request to write an implementation plan. This document authorizes no implementation or release by itself.

**Status:** Proposed; implementation has not started. Preserve the separate repository-restructure plan and its progress.

## Design decisions

Use Taste's progression from brief interpretation to explicit design choices, relevant implementation guidance, and evidence-based verification. Do not copy its aesthetic defaults or broad prohibitions. Its marketing-page focus differs from Neon's product workspaces.

Reference studied: [Taste SKILL.md](https://github.com/Leonxlnx/taste-skill/blob/main/skills/taste-skill/SKILL.md). At baseline time, record the exact upstream revision used for any further comparison. The finished Neon skills must not depend on downloading Taste or on its continued availability.

Three approaches considered:

| Approach | Benefit | Cost / decision |
| --- | --- | --- |
| Add more rules to current entrypoints | Small initial edit | Increases repetition and keeps design decisions buried |
| Refine entrypoints and reuse canonical guides | Clear decisions with stable integration behavior | Recommended; requires careful reference and behavior checks |
| Merge all skills into one configurable skill | One discovery entry | Changes routing and review boundaries unnecessarily; defer |

The repository already has brief inference and design decisions in the functional guide, creative settings in the immersive guide, worked creation examples, and a visual evaluator. Improve their connection and clarity before adding new rules or files.

## Global constraints

- Preserve the four skill names and their existing activation boundaries. Do not broaden generic UI requests into Finnomena branding.
- Keep `neon-audit` responsible for integration selection; keep `neon-review` a read-only review workflow.
- Preserve `NeonContext.operation` and `tier` values, existing handoffs, established intent, and explicit user scope.
- Colors-only changes remain colors-only, including when CDS is already installed.
- Preserve existing routes, app shells, provider trees, theme-state ownership, and custom theme files unless changing them is in the authorized request.
- Do not modify tokens, dependencies, installer behavior, or shipped component APIs as part of this instruction improvement.
- Keep functional and immersive guides standalone. Do not make a guide depend on a skill reference to be usable.
- The immersive guide is light-theme and already specifies variance 7/10, density 3/10, and motion 2/10. Do not replace these with Taste defaults or add dark mode.
- Keep generated apps, screenshots, transcripts, and run history under `.local/evals/`; keep maintained scenarios and rubrics under `evals/`.
- Preserve the guide-only evaluation's input isolation and all current acceptance thresholds. Do not restore a root `tests/` directory.
- Do not label screenshots or generated examples as approved brand references without recorded approval.
- Do not commit, push, publish, install an updated plugin globally, or edit plugin caches during plan execution without applicable user authorization.

## File ownership

| File | Planned responsibility |
| --- | --- |
| `skills/neon-audit/SKILL.md` | Concise inspection, tier decision, and handoff |
| `skills/neon-create/SKILL.md` | Brief interpretation, mode selection, essential CDS rules, workflow routing, completion |
| `skills/neon-redesign/SKILL.md` | Requested restyle scope, preservation, relevant migration path, completion |
| `skills/neon-review/SKILL.md` | Evidence-aware review; retain existing report structure |
| `skills/neon-audit/references/workflow-contract.md` | Shared routing/intent policy and optional design context |
| `skills/neon-audit/references/design-decisions.md` (new) | Interpret a brief, select the canonical guide, distinguish fixed and adjustable choices |
| `skills/neon-create/references/cds-integration.md` (new) | Create-specific installer/provider/token procedures extracted from the entrypoint |
| Existing `new-ui-workflow.md`, `theme-integration.md`, `style-migration.md`, verification and review references | Retain detailed procedures; repair moved links and duplicated instructions |
| `design-md/finnomena/{functional-layout,immersive-layout}/DESIGN.md` | Canonical design rules and focused examples added only where baseline evidence shows a gap |
| `evals/skills/{README.md,scenarios.md,review-rubric.md}` (new) | Maintained full-skill evaluation protocol, requests, and separate scoring rules |
| `docs/architecture/repository-structure.md` | Document ownership of the additional evaluation source and local outputs |

Do not introduce a fifth skill, a generic block catalog, or a new test runner in the first iteration. `scripts/package-plugin.mjs` already packages `skills/` and both guides; its allowlist should not need to change.

## Task 1: Establish evidence and a repeatable baseline

**Files:** Create `evals/skills/README.md`, `scenarios.md`, and `review-rubric.md`; modify `docs/architecture/repository-structure.md`. Store execution output in `.local/evals/skills/`.

**Consumes:** Current four skills, matching guides, existing generation prompts and evaluator documentation.

**Produces:** Stable scenarios, a reviewer-only rubric, and a baseline report distinguishing observed failures from proposed improvements.

- [ ] Inspect `git status --short`; record the starting revision and pre-existing edits. Read all affected references before moving instructions.
- [ ] Create the scenario table below. Each scenario includes the exact request, supplied environment, allowed effects, and evidence to capture. Keep evaluator expectations in `review-rubric.md`, not generation inputs.
- [ ] Prepare disposable fixtures: a CDS starter assembled through `scripts/assemble-starter.mjs`; an existing CDS app with a route/provider/theme toggle to preserve; a small Vue app with scoped header styles; and screenshot/source-only review inputs. Record fixture hashes and commands. Use existing disposable apps where their setup is inspectable and fits the case.
- [ ] Run the scenarios with current skills before editing them. Use fresh generation contexts that receive only the request, fixture, skills, and relevant guide. A reviewer receives the resulting evidence and rubric, without the proposed fix or preferred verdict.
- [ ] For the two design-generation scenarios, compare five fresh samples per variant: relevant guide without Neon skills, current skills plus guide, and later revised skills plus guide. Keep model/settings and fixtures constant. Do not make API calls with unknown credentials or incur unapproved external costs; if independent runs are unavailable, record the evaluation as pending.
- [ ] Record each failure's artifact location, user impact, likely instruction source, and desired observable correction. Distinguish routing failures, missing information, and visual-quality problems. Do not add a rule for a failure the baseline does not exhibit.

| ID | Exact request | Setup and expected evidence |
| --- | --- | --- |
| S1 | “Start a Finnomena approval dashboard with a pending list and selected-request details.” | Empty target; populated list/detail UI, justified layout, reversible demo interaction, mobile detail/Back flow |
| S2 | “Create a Finnomena Finnomena Exclusive landing page with a clear offer and one primary CTA. Use only the supplied product facts.” | Empty target plus fixed facts/assets; immersive guide, logo-only header, restrained motion, no invented proof |
| S3 | “Add a Finnomena saved-funds screen to this existing CDS app.” | Existing React/CDS fixture; routes, shell, provider tree, and theme toggle survive; no scaffold replacement |
| S4 | “Apply Finnomena colors only to this header. Keep the typography and layout.” | Existing CDS fixture; local color changes only, no dependency/provider/layout changes |
| S5 | “Apply Finnomena colors and typography to this Vue screen; keep Vue.” | Existing Vue fixture; CSS route, no React/CDS migration, existing behavior preserved |
| S6 | “Review this Finnomena screen for mobile layout and brand consistency. Do not edit files.” | Screenshot plus source, no live preview; evidence-bounded findings, no runtime claims or application edits |
| S7 | “Build a settings screen with CDS components.” | No prior branding context; Neon remains inactive under its current activation policy |
| S8 | “Make the header colors match the theme we already agreed on.” | Prior turn explicitly establishes Finnomena, colors-only, and target; no repeated brand/tier question or scope expansion |

**Acceptance:** Baseline artifacts exist before behavioral skill edits. Each proposed behavior change links to a demonstrated failure or a verified contradictory instruction. S7 tests automatic selection; do not force-invoke Neon in this scenario.

## Task 2: Define one shared design-decision contract

**Files:** Create `skills/neon-audit/references/design-decisions.md`; modify `skills/neon-audit/references/workflow-contract.md`.

**Consumes:** Baseline findings and existing canonical guide rules.

**Produces:** A shared optional `design` field that downstream skills can reuse without reopening settled questions.

- [ ] Add the following optional field to the existing `NeonContext` type. Do not change existing field names or enum values:

```ts
design?: {
  surface: 'functional' | 'immersive';
  audience: string;
  primaryTask: string;
  primaryAction: string | null;
  direction: string;
};
```

- [ ] Document that `design` is optional for colors-only work, unnecessary for review routing, and omitted when the surface is not established. It stays in conversation context, not in the consuming app. `direction` records a brief rationale; it is not a new token source.
- [ ] In `design-decisions.md`, define the decision sequence: infer the requested task and audience; select the matching standalone guide; identify the main content/action; identify preserved behavior; choose composition and density within that guide.
- [ ] Require at most a brief direction statement when it helps communicate a meaningful choice. Example: “This is a list-and-detail approval workspace; the pending list supports scanning, and the selected request owns the main action.” Do not require this ceremony for a small colors-only edit.
- [ ] Separate fixed constraints (documented brand tokens, logos, guide scope, approved geometry) from adjustable decisions (content emphasis, guide-supported composition, appropriate density and motion). User constraints and existing project behavior remain authoritative within the requested scope.
- [ ] Reuse the immersive guide's numeric settings; use plain task-based guidance for functional screens rather than inventing a new numerical scale. Dense comparison tables remain valid workspace content.
- [ ] Define when to ask: only when missing information prevents choosing between materially different outcomes. Reuse prior answers; make a reasonable assumption explicit for noncritical gaps.
- [ ] Test S1, S2, S4, and S8 for correct use or omission of the new field. Judge resulting decisions, not exact phrase matching.

**Acceptance:** Shared context improves the handoff without making colors-only tasks or review requests enter a new design workflow. Existing records without `design` remain valid.

## Task 3: Refactor creation guidance and reconcile layout terminology

**Files:** Modify `skills/neon-create/SKILL.md` and `references/new-ui-workflow.md`; create `references/cds-integration.md`; update callers of moved sections.

**Consumes:** Shared design decisions and baseline observations.

**Produces:** A concise creation entrypoint and reachable technical instructions with equivalent safeguards.

- [ ] Inventory current rules into retained-inline, moved-reference, or removed-duplicate groups. Give each moved rule a destination before editing. Keep token correctness, provider order, preservation of customized files, and genuine completion requirements discoverable.
- [ ] Restructure the entrypoint around purpose/scope, request and mode, design direction, essential constraints, relevant workflow, and verification. Keep its discovery description concise while preserving the literal Finnomena/neon activation boundary and CDS scope.
- [ ] Extract installer commands/flags, create-specific provider setup, token-key examples, component overrides, and token extension procedure into `cds-integration.md`. Reference existing `theme-integration.md` for fonts, dark-mode ownership, upgrades, and conflicts instead of duplicating it.
- [ ] Add an explicit read condition for each reference: installation/integration, new content, or final verification. Read design decisions only when choosing or changing UI composition. Do not load every reference for every request.
- [ ] Reconcile visual pattern names with actual starter exports: functional `DetailedLayout` maps to starter `AppShell`; `ContentLayout` and `SimpleLayout` keep their names; immersive pages use `ImmersiveLayout`. State that visual pattern names are not guaranteed imports in arbitrary apps.
- [ ] Remove `MultiColumnLayout` from the default supported design-guide choices. Record that it remains a shipped component outside current guide/evaluator coverage; explicit board requests need task-specific treatment. Do not delete or rename it, change its API, or claim its removal from the starter.
- [ ] Update `new-ui-workflow.md` references to the old numbered steps and five-pattern table. Preserve new-project versus new-screen behavior and the requirement to deliver actual requested content.
- [ ] Run S1 and S3. Check package dependencies, route/provider diffs, requested interactions, and rendered outcomes. Repeat reference retrieval using a packaged plugin outside the repository working directory.

**Acceptance:** No lost integration constraints, duplicate provider trees, invented imports, or scaffold-only completion. Entry-point reduction must come from moving conditional detail and eliminating duplication, not removing necessary rules.

## Task 4: Align audit, redesign, and review around the shared decisions

**Files:** Modify `skills/neon-audit/SKILL.md`, `skills/neon-redesign/SKILL.md`, `skills/neon-review/SKILL.md`, and their relevant existing references.

**Consumes:** Shared contract and the refactored creation handoff.

**Produces:** Consistent discovery, routing, preservation, and evidence behavior across all four skills.

- [ ] Reduce duplicated intent/routing prose in audit and redesign; link to the contract at the actual decision points. Preserve explicit scope precedence over dependency signals.
- [ ] In redesign, load design decisions only for authorized composition or visual-system work. A preserve-oriented restyle retains content, routes, actions, and state; a request for visual overhaul still does not authorize functional changes.
- [ ] Keep review's current coverage/findings/unverified report format. Clarify that design judgments cite the matching guide or are labeled as judgments; screenshot-only evidence does not establish interaction or measured accessibility results.
- [ ] Use `neon-review`'s evidence principles in completion references without forcing every small creation task through a second full review workflow.
- [ ] Resolve links relative to the loaded skill/package root. Preserve environment-supported plugin-root references where required; add clear resolution guidance rather than assuming the consuming app's working directory is the plugin root.
- [ ] Run S4–S8. Compare changed file sets and reported coverage with scenario scope. Test each changed skill before moving to the next.

**Acceptance:** No re-confirmation of settled intent, unexpected dependency installation, non-React conversion, colors-only scope expansion, or review-only application mutation. Evidence limitations remain visible.

## Task 5: Add only examples supported by observed design gaps

**Files:** Conditionally modify the matching existing `DESIGN.md` guide and `skills/neon-create/references/new-ui-workflow.md`; keep captured examples under `.local/evals/skills/`.

**Consumes:** Baseline failures and existing worked examples/guide patterns.

**Produces:** A small set of concrete decision examples, or a documented decision that existing examples already suffice.

- [ ] Begin with three candidate examples: a functional list/detail screen, an immersive landing page, and an observed unsuccessful result. Attach screenshot paths, source provenance, viewport, and the specific reason each example matters.
- [ ] For each example, document when to use the pattern, its content hierarchy, appropriate primary action, narrow-screen behavior, and the observed failure it addresses. Link to canonical tokens rather than copying token tables.
- [ ] Extend existing examples where possible. Put visual principles in the matching guide and implementation/preservation examples in `new-ui-workflow.md`.
- [ ] Do not track customer data, screenshots with unclear distribution rights, or generated examples labeled as approved. If approved visual references are unavailable, use clearly labeled illustrative examples and the current canonical guides; approval-dependent calibration remains pending.
- [ ] Re-run the affected S1/S2 comparisons. Keep an example only when it resolves an observed ambiguity or improves the result without degrading scope/brand behavior.

**Acceptance:** Every added example teaches a reusable decision and has known provenance. No duplicate token source or large speculative pattern library is introduced.

## Task 6: Verify behavior, packaging, and release readiness

**Files:** Finalize `evals/skills/README.md` and `review-rubric.md`; update root `README.md` only if the documented user-facing workflow changes. Do not change release metadata yet.

**Consumes:** Revised skills, packaged artifact, baseline scenarios, and current evaluator.

**Produces:** A comparison report with explicit pass/fail and remaining limitations.

- [ ] Run frontmatter validation for each modified skill using the available skill-creator validator. This is a local authoring check, not a dependency to add to the plugin:

```sh
python3 /Users/kane/.codex/skills/.system/skill-creator/scripts/quick_validate.py skills/neon-audit
python3 /Users/kane/.codex/skills/.system/skill-creator/scripts/quick_validate.py skills/neon-create
python3 /Users/kane/.codex/skills/.system/skill-creator/scripts/quick_validate.py skills/neon-redesign
python3 /Users/kane/.codex/skills/.system/skill-creator/scripts/quick_validate.py skills/neon-review
```

- [ ] Resolve all changed reference links from both source and a fresh packaged artifact. Inspect `rg -n 'step [0-9]|5-pattern|five patterns|MultiColumnLayout|DetailedLayout|CLAUDE_PLUGIN_ROOT' skills` for stale references; review matches individually rather than banning these strings.
- [ ] Package into a fresh empty directory; inspect that all new skill references and guides are present and `docs/`, `evals/`, and `.local/` are absent:

```sh
node scripts/package-plugin.mjs /tmp/neon-skill-improvement-package-01
```

If that destination exists and is nonempty, choose a fresh suffix; do not delete it or bypass the packager's safeguard.

- [ ] Execute revised S1–S8 with the same fixtures/settings as baseline. Record version hashes, inputs supplied, commands actually run, screenshots, changed files, failures, and reviewer verdicts. For S1/S2, complete the five samples per variant established in Task 1.
- [ ] Keep guide-only evaluation separate. Generate the functional and immersive showcase using only each original scene prompt and its matching guide. Do not supply skills, skill scenario fixtures, review rubrics, or harness oracles to those generation runs.
- [ ] Build and serve the disposable showcase with its own package scripts. With dependencies/browser available and the showcase running on port 5173, run from `evals/design-md/`:

```sh
npm run selftest
npm test -- --base-url http://localhost:5173 --run-label neon-skill-improvement
```

The evaluator does not start the app. Record dependency or browser setup failures honestly; missing prerequisites are not a passing check. Install prerequisites only within the execution environment's authorization.

- [ ] Review S1/S2 screenshots at 375px, 1440px, and 1920px. Check Thai/English text, hierarchy, appropriate density, requested interactions, narrow-screen navigation, brand treatment, and reduced-motion behavior where motion exists. Check only existing/requested color schemes.
- [ ] Inspect `git diff --check` and `git diff --stat`. Confirm only intended source/evaluation/documentation changes are present and no generated artifacts are staged.
- [ ] Produce `.local/evals/skills/comparison.md` with baseline versus revised results and a release recommendation. Stop before release if a required evaluation remains pending or a critical scope/brand regression exists.

## Acceptance and rollout

The reviewer rubric uses per-dimension verdicts: pass, fail, or unverified, with artifact citations. Judge routing, scope preservation, design-guide choice, task hierarchy, brand consistency, responsiveness, interaction completeness, and evidence honesty separately. Do not collapse these into an unexplained overall taste score.

Release criteria:

1. Every selected routing/preservation scenario passes; no unauthorized application mutation, scaffold replacement, duplicated provider, or invented verification evidence.
2. For S1/S2, revised output is preferred in at least four of five paired baseline comparisons on the targeted design issue, with no critical regression. This is a practical acceptance threshold, not a statistical confidence claim. If baseline already passes and there is no design gap, require parity and demonstrably simpler reference retrieval instead of inventing a need for visual change.
3. Relevant guide-only checks and visual review pass without loosening existing thresholds.
4. All packaged references resolve; modified skill frontmatter validates.
5. The report states what changed, which failures were corrected, which checks ran, and what remains unverified.

Deliver in reviewable stages: baseline → shared decisions → creation pilot → remaining skills → evidence-driven examples → final comparison. Keep the prior published plugin available until the revised version is approved for release. A subsequent release can update version metadata and distribution through the repository's established workflow.

## Preparation checklist for the maintainer

- [ ] Collect approved functional and immersive screenshots if available, including permission to distribute them.
- [ ] Identify the main baseline failure to improve first: generic composition, wrong layout, missed states, or incorrect scope. Use baseline evidence if no priority is supplied.
- [ ] Select a model and execution environment for comparable generation runs; record settings rather than changing them between variants.
- [ ] Have a designer review the final paired screenshots when available. Without that review, label visual preference as evaluator judgment, not Finnomena design approval.

Preparation can begin with the existing guides and worked examples. Missing new brand assets should not block baseline collection or structural cleanup; it only limits approval claims about new visual exemplars.

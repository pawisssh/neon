# Skill behavior scenarios

Run each request with the named context, first against the baseline and then the revised skill. Record the revision, prompt, supplied files, agent decisions, changed files and actual checks. Use an isolated app for implementation runs. Do not supply the expected answer to a fresh evaluating agent.

| Request/context | Observe |
| --- | --- |
| Add Finnomena approvals to an existing themed React/CDS app; retain providers/routes/services | Reuses installation and shell; builds actual list/detail/actions; navy foundation, indigo selection, labeled statuses |
| Build a colorful Finnomena product landing page | Immersive composition permits prominent brand color/illustration; does not force navy/white dominance; actions remain accessible |
| Create a Finnomena request tracker with mock data | Scaffolds in an empty destination and builds the feature; demo behavior is visible; relevant states exist |
| Change only a Vue header to Finnomena colors | No React/CDS installation, font/layout changes or global theme side effects |
| Review this Finnomena screenshot; do not edit | Visible findings only; keyboard, other viewports and measured contrast remain unverified |
| Make the buttons clearer after Finnomena was established | Retains brand intent without repeated onboarding |
| Build a CDS settings screen with no Finnomena context | Does not infer Finnomena branding from CDS alone |

Verdicts are pass, fail or unverified for routing, scope, resource retrieval, component correctness, color roles, feature completion, responsive behavior and evidence honesty. Link actual artifacts. Do not turn a successful retrieval simulation into a claim that an app was built or looked better.

## September 2026 refactor evidence

Baseline retrieval evaluation found missing canonical guide links, an unconditional installer step despite reuse guidance, global CSS-import risk for partial restyles, and a literal-color example conflicting with token reuse. The remaining immersive overlay required yellow-led branding contrary to the current product brief.

A packaging reproduction reported success while its promised functional guide was absent. Two executable regression tests failed before the packaging fix, then passed: required design resources ship, and missing required payloads reject before writing output.

The revised skills use one shipped product contract, a shorter creation entrypoint with conditional setup references, and scoped CSS integration. Source and packaged resource checks run via `scripts/check-repository.mjs`. The independent follow-up evaluates retrieval and decisions only; no newly generated app or visual preference benchmark is claimed by this refactor.

## Flow refactor evaluation

See [the paired evaluation protocol](flow-refactor-protocol.md) for exact prompts, fixture boundaries, measurements and acceptance. Evaluation apps and raw screenshots remain local; only a verified comparison report should claim outcomes.

## Neon controller evaluation — September 2026

Method: maintainer-agent instruction walkthrough, comparing the pre-controller entrypoints with the revised controller, specialist entrypoints and shared workflow contract. No separate agent, installed-host session or employee app was executed. The rows below record routing decisions from that walkthrough, not measured host behavior or rendered UI results. No app files were changed by the walkthrough; theme setup, installation and previews were not run.

| Conversation/request | Baseline instruction result | Revised walkthrough decision |
| --- | --- | --- |
| `neon` | No mode-only command defined | Active; brief acknowledgment; no workflow or setup |
| `Add Finnomena approvals to this already themed React/CDS app; reuse providers/routes/services` | Create workflow with reuse | Active; create fast path with the same reuse constraints |
| Then `Add an empty state when filters match nothing` | Established brand intent retained | Active; create follow-up, no repeated onboarding |
| Then `neon off` (also checked `stop neon`, `deactivate neon`) | No explicit off-state contract | Off; acknowledge, no edits or undo |
| While off: `Make this Finnomena header clearer` | Established brand intent could select redesign | Remain off; ordinary app workflow, retain existing app requirements |
| While off: `Explain the filename neon.config.ts` | Incidental mention handling not explicit | Remain off; no Neon workflow |
| While off: `neon` or `activate neon` | Reactivation not defined | Active; acknowledge only |
| While off: explicitly invoke `neon-review` with a screenshot and `do not edit` | Review-only workflow | Reactivate; review visible evidence only; no install or edits |
| Explicitly invoke `neon-create` but say `neon off` in the same request | Precedence not defined | Off takes precedence; no automatic create workflow |
| While active: `Translate this meeting note` | Outside UI skill scope | Ordinary translation; mode retained for later relevant UI work |
| `Change only this Vue header to Finnomena colors; preserve layout and behavior` | Scoped redesign | Active; redesign, local color changes only; no CDS, font or composition changes |
| `Review this Finnomena screenshot; do not edit` | Read-only review | Active; review, with keyboard behavior and other viewports unverified |

Resources inspected: controller, four specialist entrypoints, shared workflow contract and design contract. Detailed setup references were unnecessary for these routing walkthroughs. Baseline has no controller or explicit deactivation policy; existing colors-only and review-only constraints remain intact. Packaging tests separately verify distribution discovery and links. Actual host selection, long-conversation retention and UI output remain unverified.

## Review-fix scenarios — September 2026

Run these as instruction walkthroughs or real host tasks, and record which method was used. Expected outcomes below are acceptance criteria, not completed test results.

| Request/context | Expected decisions |
| --- | --- |
| `neon off`, then `Make this Finnomena header clearer` | Remain off; ordinary task handling preserves existing branding without automatically loading Neon |
| Then explicitly invoke `neon-redesign` | Reactivate and perform only the requested styling scope |
| Monorepo contains two plausible React apps; `Assess Finnomena adoption` names neither | Inspect workspace candidates, ask which app; no theme installation or arbitrary target choice |
| Theme files exist but are not imported; `Assess whether Finnomena is already wired` | Trace entry/provider imports; report inactive files rather than claiming successful integration |
| `Review this screenshot; do not edit` | Visible findings only; keyboard behavior, other viewports and exact measured contrast remain unverified |
| `Review accessibility` with source only and no browser access | Report source-supported findings and runtime limitations; no invented interaction pass or dependency installation |
| `Adopt CDS in this React app` without global or icon styles | Inspect existing imports, add missing imports once at permitted entrypoint; build and inspect a real component/icon |
| `Change only this Vue header's colors in light and dark mode` | Use scoped canonical mode declarations; preserve geometry, fonts, services and non-header consumers; no CDS |

Browser evidence for the starter and integration reference is collected separately by [the template harness](../templates/README.md). It does not establish these host-level routing decisions or formal brand approval.

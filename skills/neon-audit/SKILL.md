---
name: neon-audit
description: ONLY use this skill if the user's message literally contains the word "Finnomena" or "neon" — do not infer from related terms like "CDS", "Coinbase Design System", "on-brand", or generic theming/UI requests alone. Entry point for theming an EXISTING project with Finnomena's brand — this runs a quick check of the project and recommends a theming depth (colors only, colors+typography, or full CDS) before handing off to the skill that implements it. Do NOT use this to scaffold a brand-new project — use neon-create for that.
---

# Finnomena Theming — Entry Point

For a review of existing UI quality (branding, responsiveness, accessibility,
or interaction states), use **neon-review**. This skill selects an integration
path; a review-only request must not enter its installer handoff.

Before theming UI in an existing project, figure out how deep the user
actually wants to go — not everyone wants to adopt the full Coinbase
Design System just to get on-brand colors. This skill runs a lightweight
audit, recommends a tier, confirms with the user, then hands off to
whichever skill implements that tier. It does not do any theming work
itself.

**Three tiers** (`NeonContext.tier` — see the shared contract's
"Tier terminology" table for the exact mapping):
- **Colors only** (`'colors'`) — brand colors via CSS variables. No CDS.
- **Colors + typography** (`'visual-system'`) — also brand fonts, spacing,
  and radius via CSS variables. No CDS.
- **Full CDS** (`'cds'`) — install `@coinbase/cds-web`, use `ThemeProvider`
  + real CDS components.

**Implementation skills:** `${CLAUDE_PLUGIN_ROOT}/skills/neon-redesign`
(first two tiers), `${CLAUDE_PLUGIN_ROOT}/skills/neon-create` (Full CDS —
handles both an existing project and a brand-new scaffold internally). This
skill only decides which one to use — follow the chosen skill's own
instructions for the actual work, don't duplicate them here.

## What this skill does, every time

Before starting, read
`${CLAUDE_PLUGIN_ROOT}/skills/neon-audit/references/workflow-contract.md` —
the shared `NeonContext` handoff record, routing rules, and intent policy
used by all three neon skills — and
`${CLAUDE_PLUGIN_ROOT}/skills/neon-audit/references/project-inspection.md` —
the inspection methodology step 1 below follows to gather real evidence for
`NeonContext`. The steps below assume both.

0. **Use established Finnomena branding intent; don't repeat it.** Per the
   contract's intent policy: if branding intent is already established —
   the request itself says "Finnomena"/"neon", or it was confirmed earlier
   in this conversation (including in another neon skill) — treat
   `brandConfirmed` as true and move on. Ask a direct brand question only
   when it's genuinely missing: "Do you want to use Finnomena's neon brand
   theme for this?" If the answer is no, or they want something else, stop
   — don't run the audit, touch any files, or hand off to another neon
   skill. (This is separate from the tier question in step 4 below, which
   is a scope question, not a brand question — see the contract's "ask
   only when missing" rule for both.)

1. **Resolve the target, then check quick signals** — this is a fast,
   evidence-based check, not a code scan. Follow
   `${CLAUDE_PLUGIN_ROOT}/skills/neon-audit/references/project-inspection.md`
   for the full methodology (what to inspect, what to exclude, and how to
   fill in `NeonContext`); this step summarizes the decisions it feeds:
   - **Multiple apps (monorepo)?** Resolve which app is the target from the
     request or the current working directory before inspecting further;
     ask only if neither resolves it. Never default to the repo root just
     because it has a `package.json` — that's usually workspace tooling,
     not an app.
   - **Framework.** Is this React, or something else (Vue, Svelte, ...)? A
     non-React target can never take Full CDS — don't offer it as an
     option in step 4; route straight to `neon-redesign` and say why.
   - Is `@coinbase/cds-web` already a dependency in `package.json`? →
     strong signal for Full CDS — but also check for an existing provider
     tree (`ThemeProvider`/`MediaQueryProvider`/`PortalProvider` already
     wired up) before handing off; see step 2.
   - Does `src/theme/theme.css` (or similar, from a prior `neon-redesign`
     run) already exist? → the project is already on Colors or
     Colors+Typography; frame this as an upgrade decision, not a
     from-scratch question (see step 3).
   - What styling approach does the project already use — a Tailwind
     config, `styled-components`/`emotion` in `package.json`, CSS modules,
     or plain CSS? This informs the *reasoning* behind a recommendation,
     not the decision itself.
   - **Server-rendered (Next-style) React?** Note client/server component
     boundaries and where a global style import is legal before any CDS
     provider recommendation — see the reference doc's SSR section.
   - **Partial scope** (e.g. "just the header")? Check whether the styles
     involved are local to that scope or shared/global tokens the rest of
     the app depends on — see the reference doc's scope-conflict section.
    - Does the user's own request already name CDS/Coinbase Design System,
      or say something like "just the colors" / "brand colors only"? Apply
      explicit user scope before dependency signals: a colors-only request
      stays CSS-only even when CDS appears in package.json.
    - **Preparation contract**: Inspect the target manifest, lockfile, app
      entry, and existing theme/provider usage. Reuse an active installation.
      Compare required React/CDS APIs and versions before changing
      dependencies; a major-version mismatch is a migration decision.
    - This inspection is **read-only** — never edit or create files while
      gathering evidence.

2. **If a signal is decisive** — unless overridden by explicit colors-only
   scope, if `@coinbase/cds-web` is already installed, or the request
   clearly wants real CDS components — skip the question and give a brief
   one-line confirmation instead ("This project already uses CDS, so I'll
   theme it with the full Finnomena CDS setup — let me know if you'd rather
   use a lighter, CSS-only option instead") before handing off to
   `${CLAUDE_PLUGIN_ROOT}/skills/neon-create`. If CDS is already installed,
   also record whether a provider tree already exists (step 1) — pass its
   location via `NeonContext.targetPaths`/`preserve` so `neon-create` edits
   that existing wiring instead of wrapping a second
   `ThemeProvider`/`MediaQueryProvider`/`PortalProvider` around it.

3. **If `theme.css` already exists**, frame the question as an upgrade,
   not a fresh choice: "This project is already themed with Finnomena
   colors[/+typography] via CSS variables — want to expand scope, or move
   to the full CDS setup?" Point to the relevant implementation skill's own
   "Upgrading" section rather than re-explaining the tiers from zero.

4. **Otherwise, ask the user directly** which tier they want. Present the
   3 options along with your reasoning from step 1 (e.g. "this project
   uses Tailwind extensively — Colors+Typography via CSS variables
   integrates without introducing a second styling system alongside it;
   Full CDS would mean adopting CDS's own component library too") — don't
   present a bare, context-free list. For a non-React target, present only
   Colors / Colors+Typography — omit Full CDS from the list entirely (see
   step 1). If the requested scope is partial (e.g. just the header) and
   inspection found the affected styles are shared/global tokens rather
   than local to that scope, say so and propose a local override instead
   of silently widening the change to global tokens.

5. **Hand off.** Once the tier is confirmed:
   - Colors / Colors+Typography → follow `${CLAUDE_PLUGIN_ROOT}/skills/neon-redesign/SKILL.md`.
   - Full CDS → follow `${CLAUDE_PLUGIN_ROOT}/skills/neon-create/SKILL.md`.

   Don't duplicate either skill's implementation steps here — this skill's
   job ends at the handoff.

6. **If there's no existing project** (the user is starting fresh), this
   skill doesn't apply — redirect to `${CLAUDE_PLUGIN_ROOT}/skills/neon-create`
   instead, which scaffolds a brand-new project on Full CDS by design.

## Known limitations

- The audit is **signal-level only** — checking for a few files/dependencies
  and reading the request, not scanning the codebase for hardcoded colors,
  inline styles, or font declarations. A deeper audit (e.g. "here are the
  47 hardcoded hex colors in your codebase") is a bigger, separate feature
  and isn't attempted here — don't imply this skill did that kind of scan.
- Styling-approach detection is best-effort (checking for a few well-known
  config files/dependencies) — if it can't confidently tell what styling
  system a project uses, say so and ask rather than guessing.
- See `${CLAUDE_PLUGIN_ROOT}/skills/neon-audit/references/project-inspection.md`
  for the inspection methodology itself (evidence sources, exclusions,
  monorepo/SSR/existing-CDS/partial-scope handling, and worked examples) —
  it's still signal-level and best-effort, per the two points above, not a
  guarantee of full precision.

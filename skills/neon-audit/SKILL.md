---
name: neon-audit
description: Entry point for theming an EXISTING project with Finnomena's brand. Use whenever a Finnomena employee asks Claude to build UI, theme something, or make it on-brand in a project that already exists — this runs a quick check of the project and recommends a theming depth (colors only, colors+typography, or full CDS) before handing off to the skill that implements it. Do NOT use this to scaffold a brand-new project — use neon-starter for that.
---

# Finnomena Theming — Entry Point

Before theming UI in an existing project, figure out how deep the user
actually wants to go — not everyone wants to adopt the full Coinbase
Design System just to get on-brand colors. This skill runs a lightweight
audit, recommends a tier, confirms with the user, then hands off to
whichever skill implements that tier. It does not do any theming work
itself.

**Three tiers:**
- **Colors only** — brand colors via CSS variables. No CDS.
- **Colors + typography** — also brand fonts, spacing, and radius via CSS
  variables. No CDS.
- **Full CDS** — install `@coinbase/cds-web`, use `ThemeProvider` + real
  CDS components.

**Implementation skills:** `../neon-theme-css` (first two tiers),
`../neon-theme` (Full CDS). This skill only decides which one to use —
follow the chosen skill's own instructions for the actual work, don't
duplicate them here.

## What this skill does, every time

1. **Check quick signals** in the target project — this is a fast,
   surface-level check, not a code scan:
   - Is `@coinbase/cds-web` already a dependency in `package.json`? →
     strong signal for Full CDS.
   - Does `src/theme/theme.css` (or similar, from a prior `neon-theme-css`
     run) already exist? → the project is already on Colors or
     Colors+Typography; frame this as an upgrade decision, not a
     from-scratch question (see step 3).
   - What styling approach does the project already use — a Tailwind
     config, `styled-components`/`emotion` in `package.json`, CSS modules,
     or plain CSS? This informs the *reasoning* behind a recommendation,
     not the decision itself.
   - Does the user's own request already name CDS/Coinbase Design System,
     or say something like "just the colors" / "brand colors only"? A
     clear request overrides the audit.

2. **If a signal is decisive** — `@coinbase/cds-web` is already installed,
   or the request clearly wants real CDS components — skip the question
   and give a brief one-line confirmation instead ("This project already
   uses CDS, so I'll theme it with the full Finnomena CDS setup — let me
   know if you'd rather use a lighter, CSS-only option instead") before
   handing off to `../neon-theme`.

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
   present a bare, context-free list.

5. **Hand off.** Once the tier is confirmed:
   - Colors / Colors+Typography → follow `../neon-theme-css/SKILL.md`.
   - Full CDS → follow `../neon-theme/SKILL.md`.

   Don't duplicate either skill's implementation steps here — this skill's
   job ends at the handoff.

6. **If there's no existing project** (the user is starting fresh), this
   skill doesn't apply — redirect to `../neon-starter` instead, which
   scaffolds a brand-new project on Full CDS by design.

## Known limitations

- The audit is **signal-level only** — checking for a few files/dependencies
  and reading the request, not scanning the codebase for hardcoded colors,
  inline styles, or font declarations. A deeper audit (e.g. "here are the
  47 hardcoded hex colors in your codebase") is a bigger, separate feature
  and isn't attempted here — don't imply this skill did that kind of scan.
- Styling-approach detection is best-effort (checking for a few well-known
  config files/dependencies) — if it can't confidently tell what styling
  system a project uses, say so and ask rather than guessing.

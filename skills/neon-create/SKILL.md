---
name: neon-create
description: ONLY use this skill if the user's message literally contains the word "Finnomena" or "neon" — do not infer from related terms like "CDS", "Coinbase Design System", or "real CDS components" alone. Implements FULL Finnomena theming on top of the Coinbase Design System (CDS) — install @coinbase/cds-web, wire ThemeProvider, build with real CDS components — for EITHER a brand-new project (scaffolds Vite + React + CDS + a responsive app-shell layout) OR a project that already exists (themes it in place). Normally reached via neon-audit's recommendation for existing projects; invoke directly for a brand-new project. If the user just wants Finnomena's colors (optionally + typography) WITHOUT adopting CDS, use neon-redesign instead — do not assume CDS is wanted by default.
---

# Finnomena Brand Theme + Scaffold (CDS)

This skill is a thin layer on top of Coinbase's own official tooling — for
"which component"/"what props," prefer `cds-code`/`cds-docs`/the CDS MCP
server if available; otherwise read real prop types from the installed
`@coinbase/cds-web` package's `dts/` folder rather than guessing (step 5).

Its only job is to make sure whatever CDS produces uses **Finnomena's**
brand, not Coinbase's default — whether that means scaffolding a brand-new
project or theming one that already exists. Reached via
`${CLAUDE_PLUGIN_ROOT}/skills/neon-audit` for existing projects, or invoked
directly for a brand-new one. If the user just wants colors/fonts without
CDS, use `${CLAUDE_PLUGIN_ROOT}/skills/neon-redesign` instead.

See `${CLAUDE_PLUGIN_ROOT}/design-md/finnomena/DESIGN.md` — the single
canonical Finnomena design reference shared by every skill in this repo —
for the full color/typography/spacing/component reference and do's/don'ts.
Read it before making styling decisions rather than guessing from
`theme.config.ts` alone.

## What this skill does, every time

Before starting, read
`${CLAUDE_PLUGIN_ROOT}/skills/neon-audit/references/workflow-contract.md` —
the shared `NeonContext` handoff record, routing rules, and intent policy
used by all three neon skills. The steps below assume it.

0. **Use established Finnomena branding intent; don't repeat it.** Per the
   contract's intent policy: if branding intent is already established —
   the request itself says "Finnomena"/"neon", or it was confirmed earlier
   in this conversation, including via `neon-audit`'s handoff — treat
   `brandConfirmed` as true and move on without asking again. Ask a direct
   brand question only when it's genuinely missing: "Do you want to use
   Finnomena's neon brand theme for this?" If no, stop — don't install
   anything, wire `ThemeProvider`, scaffold, or hand off to another skill.

1. **Determine the target: brand-new project, or one that already exists?**
   If it's obvious from the request or the target directory (empty/
   nonexistent, explicit "start a new project" wording), proceed without
   asking; otherwise ask directly.

2. **Confirm the target directory** with the user before running anything —
   never scaffold into a non-empty directory without asking first (the
   installer below refuses to anyway, but confirm before invoking it).

3. **Run the installer** from this repo's root:

   ```
   node ${CLAUDE_PLUGIN_ROOT}/theme/finnomena/scripts/install.mjs <target-dir> --new   # brand-new project
   node ${CLAUDE_PLUGIN_ROOT}/theme/finnomena/scripts/install.mjs <target-dir>         # existing project
   ```

   Also accepts `--theme-dir <project-relative-dir>` (default `src/theme`;
   existing-project/`--css-only` only), `--package-manager
   <npm|pnpm|yarn|bun>` (auto-detected otherwise), and `--skip-install`
   (copy files without installing — output reports deps as not installed,
   never an unqualified "Done"); see `install.mjs`'s header for full semantics.

   For a new project, this copies `starters/vitejs-cds/` (theme
   pre-wired) into `<target-dir>` and runs the install command. Report its
   output, then tell the user to run `npm run dev` and confirm the app
   boots before claiming it "works." For an existing project, it copies
   the same 4 theme files into `<target-dir>/src/theme/` (or
   `--theme-dir`) and installs `@coinbase/cds-web` if not already a
   dependency. It never touches provider wiring or component code —
   that's your job, from here on. **If a destination theme file is
   already customized, the installer refuses to overwrite it and exits
   nonzero rather than touching anything** — don't force a clean rerun by
   deleting the customized file or bypassing the check; diff, merge, and
   retain the customization per
   `${CLAUDE_PLUGIN_ROOT}/skills/neon-audit/references/theme-integration.md`
   §4 (§5 covers a partial multi-file-copy failure).

   If the project already has a `theme.css` (from a prior
   `${CLAUDE_PLUGIN_ROOT}/skills/neon-redesign` run), this is an
   *upgrade*. Its variable names are byte-identical to what CDS's
   `ThemeProvider` emits, but matching names alone don't guarantee
   `var(--color-fg)` markup keeps working unchanged — verify variable
   scope, cascade order, portal behavior, and theme-state ownership
   before removing `theme.css`; see
   `${CLAUDE_PLUGIN_ROOT}/skills/neon-audit/references/theme-integration.md`
   §3. Migrate markup to real CDS components incrementally, screen by
   screen, not a big-bang rewrite.

4. **Use `createNeonTheme()` (from the copied `src/theme/createTheme.ts`),
   never CDS's `defaultTheme` passed through unmodified.** Call it **once,
   at module scope** (not inline in JSX) and pass the result to
   `ThemeProvider`'s `theme` prop alongside `activeColorScheme` (`"light"`
   or `"dark"`) — `ThemeProvider` is memoized on theme identity, so a new
   object every render defeats that. **Derive `activeColorScheme` from the
   app's existing dark-mode source of truth**, not a hardcoded `"light"`
   or a second mechanism — see
   `${CLAUDE_PLUGIN_ROOT}/skills/neon-audit/references/theme-integration.md`
   §2. It merges Finnomena's overrides (`theme.config.ts`'s `neonTheme`,
   `color-overrides.ts`'s `colorOverrides`) onto CDS's own `defaultTheme`.
   See `${CLAUDE_PLUGIN_ROOT}/theme/finnomena/examples/app-entry.tsx`
   (existing project) or the copied `src/app/AppRoot.tsx` (new project,
   already wired) for the exact pattern.

5. **Enforce provider order.** Always:

   ```
   MediaQueryProvider → ThemeProvider → PortalProvider
   ```

   Do not reorder, skip, or nest these differently — CDS's responsive and
   theming behavior depends on this exact order.

6. **Forbid hardcoded colors and spacing.** Never write a hex/rgb color, raw
   pixel padding/margin, or a raw border-radius number in JSX or CSS-in-JS.
   Always go through CDS's style props using **real CDS token keys**
   (verified against `@coinbase/cds-web`'s actual types
   `dts/styles/styleProps.d.ts`/`dts/core/theme.d.ts`, not invented names):
   - `color` accepts `ThemeVars.Color` keys — semantic slugs like `"fg"`,
     `"fgMuted"`, `"bgPrimary"`, `"accentBoldBlue"` (42 total; see
     `theme.config.ts`'s header or `color-overrides.ts` for the full list).
   - `padding`/`paddingX`/`paddingY`/etc. accept `ThemeVars.Space` keys —
     numeric-string scale steps `0`, `0.25`, `0.5`, `0.75`, `1`, `1.5`,
     `2`...`10` (e.g. `padding={2}` for 16px).
   - `borderRadius` accepts `ThemeVars.BorderRadius` keys — strings `"0"`
     through `"1000"` (e.g. `borderRadius="200"` for 8px, `"1000"` for
     fully round).

     Example: `<Box color="fg" padding={2} borderRadius="200">`. There is
     **no** `"textPrimary"`, `"medium"`, or `"sm"` value for these props —
     those don't exist in CDS's type system; using them is a TypeScript
     error, and hitting that error is the single most common way this rule
     gets silently abandoned in practice.

   (Layout components under `src/layout/`, new-project branch only, are the
   one exception — their pixel widths are structural breakpoint geometry
   from `breakpoints.config.ts`/`layoutPanes.ts`, not tokens.)

   If a mockup needs a value with no matching token, flag it to the user
   rather than inventing a one-off hex value. **Color tokens are a
   provisional, first-pass mapping** (see `color-overrides.ts`'s own
   header) — flag that any color assignment may need design review before
   treating it as final.

7. **Component-level default overrides** (e.g. "all buttons should have a
   pill radius") go through CDS's `ComponentConfigProvider`, not by editing
   theme tokens. Don't repurpose a color/space token to hack a
   component-specific look.

8. **Custom tokens** outside CDS's built-in `ThemeVars` must be declared via
   the `ThemeVarsExtended` namespace before use — don't bolt extra keys onto
   the theme object and hope CDS's types pick them up.

9. **New-project branch only — pick the right layout.** `App.tsx` boots into
   `AppShell` (Detailed Layout) by default; five patterns ship in
   `src/layout/`, sharing `Sidebar`/`ContentView`/`InspectorView` pane
   primitives plus `breakpoints.config.ts` for sidebar width. Pick the one
   matching what the user describes, don't default to `AppShell` for
   everything. `Sidebar` ships with real Finnomena navigation already wired
   (`Logo.tsx`, a 5-item nav rail in `SidebarNav.tsx`/`navItems.ts`, also
   powering `BottomNav.tsx` at phone width) — the `sidebar` prop on any
   layout is for *extra* app-specific content below that, pass `null` if
   none.

   | Component | Panes | Use for |
   |---|---|---|
   | `AppShell` (Detailed) | Sidebar + Content + Inspector, inspector-weighted | Default — general screens needing a detail panel |
   | `ContentLayout` | Sidebar + Content + Inspector, content-weighted | Main content should dominate over inspector |
   | `SimpleLayout` | Sidebar + Content only | No third pane needed |
   | `MultiColumnLayout` | Sidebar + N scrolling fixed-width columns | Kanban/board-style views |
   | `ImmersiveLayout` | Content only, full-bleed, logo-only header | Focus/distraction-free flows |

   All 5 are hand-maintained, Figma-sourced constants in
   `src/layout/layoutPanes.ts` — see that file's own header for which
   numbers are corroborated vs. extrapolated before treating any as
   pixel-final.

10. **Font loading — new-project branch reuses the shipped pattern**
    (`starters/vitejs-cds/src/main.tsx` loads IBM Plex Sans Thai);
    **existing-project branch inspects and integrates, never invents a
    new mechanism.** Never touch font loading at `tier: 'colors'`. At
    `'visual-system'`/`'cds'`, inspect how the app loads fonts, prefer
    that mechanism, load only the weights the affected UI uses, support a
    self-hosted alternative to a CDN link, and verify with real Thai
    *and* Latin sample text (a font can load by name while still falling
    back for Thai glyphs specifically) — full procedure in
    `${CLAUDE_PLUGIN_ROOT}/skills/neon-audit/references/theme-integration.md`
    §1.

For the token-regeneration pipeline and known limitations, read
`${CLAUDE_PLUGIN_ROOT}/theme/finnomena/theme.config.ts`,
`color-overrides.ts`, and `scripts/generate-theme-config.mjs`'s own header
comments directly — that's the source of truth, not a second copy here.

## Roadmap context

This skill is an early step of a longer plan (real brand values → Figma
Code Connect → token sync automation + governance) — ask the maintainer
for the full roadmap if asked; it isn't shipped in this repo.

# CDS installation and integration

Read when setting up or changing the CDS theme, providers, dependencies, tokens, or starter layout. Skip installation when the app already has a working Finnomena theme.

1. **Determine the mode and target directory.** Split create into three distinct modes:
   - **new-project**: Brand-new app scaffolded from template.
   - **new-screen/component**: Add UI into an existing app in place. Never scaffold over or replace the existing app shell.
   - **existing CDS integration**: Wire theme/providers into an existing React app.
   
   **Preparation contract**: Inspect the target manifest, lockfile, app
   entry, and existing theme/provider usage. Reuse an active installation.
   Compare required React/CDS APIs and versions before changing
   dependencies; a major-version mismatch is a migration decision.
   Confirm the target directory before running anything — never scaffold
   into a non-empty directory. See
   `${CLAUDE_PLUGIN_ROOT}/skills/neon-create/references/new-ui-workflow.md`.

2. **When installation is needed**, run the installer from the resolved Neon root:

   ```
   node ${CLAUDE_PLUGIN_ROOT}/scripts/install.mjs <target-dir> --new   # brand-new project
   node ${CLAUDE_PLUGIN_ROOT}/scripts/install.mjs <target-dir>         # existing project
   ```

   Also accepts `--theme-dir <project-relative-dir>` (default `src/theme`;
   existing-project/`--css-only` only), `--package-manager
   <npm|pnpm|yarn|bun>` (auto-detected otherwise), and `--skip-install`
   (copy files without installing — output reports deps as not installed,
   never an unqualified "Done"); see `install.mjs`'s header for full semantics.

   **Completion contract**: After scaffolding, implement the employee's
   requested UI in the generated project. A copied starter is not
   completion. Use existing data/services where present; local mock data
   is appropriate for a mockup request. Reuse relevant loading, empty,
   disabled, and validation-state guidance. Do not invent backend
   authentication or persistence to make a UI demo appear functional.
   Require actual build and browser checks when available (narrow/wide
   layouts, long Thai/English labels, keyboard focus, primary interactions,
   and collapsing regions; check requested color schemes without forcing
   dark mode). For an existing project, it copies the 4 theme files into
   `<target-dir>/src/theme/` (or `--theme-dir`) and installs
   `@coinbase/cds-web` if not already a dependency, never touching
   existing provider wiring or component code — that's your job, from here
   on. **If a destination theme file is already customized, the installer
   refuses to overwrite it and exits nonzero rather than touching anything**
   — don't force a clean rerun by deleting the customized file or bypassing
   the check; diff, merge, and retain the customization per
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

3. **Use `createNeonTheme()` (from the copied `src/theme/createTheme.ts`),
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
   See `${CLAUDE_PLUGIN_ROOT}/theme/examples/app-entry.tsx`
   (existing project) or the copied `src/app/AppRoot.tsx` (new project,
   already wired) for the exact pattern.

4. **Enforce provider order.** Always:

   ```
   MediaQueryProvider → ThemeProvider → PortalProvider
   ```

   Do not reorder, skip, or nest these differently — CDS's responsive and
   theming behavior depends on this exact order.

5. **Use semantic tokens for branded values.** Use existing color, spacing
   and radius tokens rather than duplicating their literals in JSX or CSS.
   Go through CDS's style props using **real CDS token keys**
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

   Structural widths and responsive geometry can use documented layout
   dimensions. Preserve existing app geometry; the starter's values live
   in `breakpoints.config.ts`/`layoutPanes.ts`. This does not permit
   arbitrary replacements for existing brand spacing/radius tokens.

   If a mockup needs a value with no matching token, flag it to the user
   rather than inventing a one-off hex value. **Color tokens are a
   provisional, first-pass mapping** (see `color-overrides.ts`'s own
   header) — flag that any color assignment may need design review before
   treating it as final.

6. **Component-level default overrides** (e.g. "all buttons should have a
   pill radius") go through CDS's `ComponentConfigProvider`, not by editing
   theme tokens. Don't repurpose a color/space token to hack a
   component-specific look.

7. **Custom tokens** outside CDS's built-in `ThemeVars` must be declared via
   the `ThemeVarsExtended` namespace before use — don't bolt extra keys onto
   the theme object and hope CDS's types pick them up.

8. **New-project branch only — pick the right layout.** `App.tsx` boots into
   `AppShell` (Detailed Layout) by default; five patterns ship in
   `src/layout/`, sharing `Sidebar`/`ContentView`/`InspectorView` pane
   primitives plus `breakpoints.config.ts` for sidebar width. Pick the one
   matching what the user describes, don't default to `AppShell` for
   everything. Every layout but `ImmersiveLayout` takes a `navigation` prop
   (`NavItem[]` from `navItems.ts`, empty by default — no dead links out of
   the box) feeding both `Sidebar` and `BottomNav`; pass its
   `finnomenaEcosystemNav` only to opt into linking out to Finnomena's own
   ecosystem. `sidebar` is for *extra* content below the nav, `null` if none.

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

   **Use the shipped SVG logos.** `src/assets/logo/` contains full and compact
   Finnomena marks for light and dark surfaces. Use `Logo` rather than
   recreating the wordmark as text: full in a header or full sidebar, compact
   in an icon rail. See `design/FINNOMENA.md` for the asset mapping.

9. **Font loading — new-project branch reuses the shipped pattern**
   (`templates/vitejs-cds/src/main.tsx` loads IBM Plex Sans Thai);
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
`${CLAUDE_PLUGIN_ROOT}/theme/cds/theme.config.ts`,
`color-overrides.ts`, and `theme/scripts/generate-theme-config.mjs`'s own
header comments directly — that's the source of truth, not a second copy
here.


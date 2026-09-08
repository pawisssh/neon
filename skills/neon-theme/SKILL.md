---
name: neon-theme
description: ONLY use this skill if the user's message literally contains the word "Finnomena" or "neon" — do not infer from related terms like "CDS", "Coinbase Design System", or "real CDS components" alone. Implements FULL Finnomena theming on top of the Coinbase Design System (CDS) — install @coinbase/cds-web, wire ThemeProvider, build with real CDS components. Normally reached via neon-audit's recommendation; invoke directly only if the user has already said they want real CDS components. If the user just wants Finnomena's colors (optionally + typography) WITHOUT adopting CDS, use neon-theme-css instead — do not assume CDS is wanted by default.
---

# Finnomena Brand Theme (CDS)

This skill is a thin layer on top of Coinbase's own official tooling. It does
**not** reimplement component knowledge — for "which component do I use" and
"what props does Button take," prefer Coinbase's own tooling if it's already
available in the user's environment:

- `cds-code` — component selection, correct style-prop usage
- `cds-docs` — component reference docs
- CDS MCP Server (`@coinbase/cds-mcp-server`) — environment detection,
  component discovery, token access

**This plugin does not install any of the above** — `.claude-plugin/plugin.json`
declares no dependency on them. If they're present, use them. If they
aren't, read the real prop types directly from the installed
`@coinbase/cds-web` package (its `dts/` folder) rather than guessing — see
step 4 below for exactly which types matter most (`ThemeVars.Color`,
`ThemeVars.Space`, `ThemeVars.BorderRadius`).

This skill's only job is to make sure whatever CDS produces uses
**Finnomena's** brand, not Coinbase's default theme. It's the Full CDS
implementation arm of Finnomena's theming — reached via `../neon-audit`
after it's confirmed the user actually wants real CDS components, not just
brand colors/fonts (see `../neon-theme-css` for that lighter path). It
themes UI inside a project that already exists — if the user wants a
brand-new project scaffolded from scratch (Vite + React + CDS + a
responsive app-shell layout), use `../neon-starter` instead.

See `DESIGN.md` for the full color/typography/spacing reference tables,
per-component styling notes, and do's/don'ts — read it before making
styling decisions rather than guessing from `theme.config.ts` alone.

## Migrating from neon-theme-css

Before assuming this is a fresh install, **check whether the project
already has a `theme.css`** (from a prior `../neon-theme-css` setup). If it
does, this is an *upgrade*, not a from-scratch integration:

- Leave `theme.css` in place during the transition — its `var(--color-fg)`,
  `var(--space-2)`, etc. references keep working unchanged even after CDS
  is installed, since `theme.css`'s variable names are byte-identical to
  what real CDS's `ThemeProvider` emits (verified — see
  `../neon-theme-css/theme.css`'s own header for how that was confirmed).
- Install `@coinbase/cds-web` and wire `ThemeProvider` per the steps below
  — this doesn't conflict with the existing CSS variables.
- Migrate markup to real CDS components **incrementally**, screen by
  screen, rather than a forced big-bang rewrite the moment CDS is adopted.
  A `<div style={{ color: "var(--color-fg)" }}>` and a CDS `<Box
  color="fg">` can coexist in the same codebase during the transition.

## What this skill does, every time

0. **Confirm intent before doing anything.** Ask the user directly: "Do you
   want to use Finnomena's neon brand theme for this?" If they decline, stop
   here — don't install `@coinbase/cds-web` with Finnomena overrides, don't
   wire `ThemeProvider` with `createNeonTheme()`, and don't hand off to
   another neon skill. Only continue past this point once they've confirmed
   yes.

1. **Ensure `@coinbase/cds-web` is installed** in the current project. If it
   isn't, install it before writing any component code:

   ```
   npm install @coinbase/cds-web
   ```

2. **Use `createNeonTheme()`, never CDS's `defaultTheme` passed through
   unmodified.** Import it from `./theme/createTheme.ts` — copy only these
   three files from this folder into the target project's `src/theme/` (not
   the whole `theme/` directory — the rest is source data and generator
   output, nothing else is ever imported by application code):
   - `theme.config.ts`
   - `color-overrides.ts`
   - `createTheme.ts`

   Call `createNeonTheme()` **once, at module scope** (not inline inside a
   component's JSX) and pass the result to `ThemeProvider`'s `theme` prop
   alongside an `activeColorScheme` prop (`"light"` or `"dark"`) —
   `ThemeProvider` is memoized on theme identity, so creating a new object
   every render defeats that. `createNeonTheme()` merges Finnomena's
   overrides (`theme.config.ts`'s `neonTheme` and `color-overrides.ts`'s
   `colorOverrides`) onto CDS's own `defaultTheme`, since `ThemeProvider`
   requires a complete `ThemeConfig`, not a partial one. See
   `examples/app-entry.tsx` for the exact pattern.

3. **Enforce provider order.** It must always be:

   ```
   MediaQueryProvider → ThemeProvider → PortalProvider
   ```

   Do not reorder, skip, or nest these differently — CDS's responsive and
   theming behavior depends on this exact order.

4. **Forbid hardcoded colors and spacing.** Never write a hex/rgb color,
   raw pixel padding/margin, or a raw border-radius number directly in JSX or
   CSS-in-JS. Always go through CDS's style props using **real CDS token
   keys** — verified against `@coinbase/cds-web`'s actual types
   (`dts/styles/styleProps.d.ts` and `dts/core/theme.d.ts`), not invented
   names:
   - `color` accepts `ThemeVars.Color` keys — semantic slugs like `"fg"`,
     `"fgMuted"`, `"bgPrimary"`, `"accentBoldBlue"` (42 total; see
     `theme.config.ts`'s header or `color-overrides.ts` for the full list).
   - `padding`/`paddingX`/`paddingY`/etc. accept `ThemeVars.Space` keys —
     numeric-string scale steps: `0`, `0.25`, `0.5`, `0.75`, `1`, `1.5`, `2`,
     `3`...`10` (e.g. `padding={2}` for 16px, `padding="1"` for 8px).
   - `borderRadius` accepts `ThemeVars.BorderRadius` keys — the strings
     `"0"` through `"1000"` (e.g. `borderRadius="200"` for 8px,
     `borderRadius="1000"` for fully round).

     Example: `<Box color="fg" padding={2} borderRadius="200">`. There is
     **no** `"textPrimary"`, `"medium"`, or `"sm"` value for these props —
     those names don't exist in CDS's type system; using them is a
     TypeScript error, and an agent hitting that error is the single most
     common way this rule gets silently abandoned in practice (verified:
     it happened in a real project built from this skill).

   If a mockup needs a value that has no matching token, that's a signal to
   flag it to the user rather than invent a one-off hex value. **Color
   tokens are a provisional, first-pass mapping** (see
   `theme/color-overrides.ts`'s own header and "Current known
   limitations") — flag to the user that any color assignment might need
   design review before treating it as final brand sign-off.

5. **Component-level default overrides** (e.g. "all buttons should have a
   pill radius") go through CDS's `ComponentConfigProvider`, not by editing
   theme tokens. Don't repurpose a color/space token to hack a
   component-specific look.

6. **Custom tokens** that aren't part of CDS's built-in `ThemeVars` (e.g.
   Finnomena-specific tokens) must be declared via the `ThemeVarsExtended`
   namespace before use — don't just bolt extra keys onto the theme object
   and hope CDS's types pick them up.

## Regenerating theme.config.ts

`theme.config.ts` (the `neonTheme` overrides object) and
`color-mapping.todo.md` are both **generated files** — mechanically
projected from the raw Figma Token Studio export in `theme/tokens/*.json`.
Never hand-edit either. To update them (after adding/changing files in
`theme/tokens/`), run both scripts in order from `skills/neon-theme/`:

```
node scripts/sync-tokens.mjs && node scripts/generate-theme-config.mjs
```

The first resolves every token alias in `theme/tokens/` into
`theme/tokens.resolved.json` (values) and `theme/tokens.report.json`
(resolution stats + exactly which root collections are still missing). The
second reads those and rewrites both `theme/theme.config.ts` and
`theme/color-mapping.todo.md` from scratch. This is the only supported way
to update either file.

`theme/createTheme.ts` (the runtime merge helper) and
`theme/color-overrides.ts` (the color mapping) are both **hand-written, not
generated** — `createTheme.ts` doesn't depend on Finnomena's specific token
values, only on `neonTheme`'s/`colorOverrides`'s shape, and
`color-overrides.ts` encodes a human design decision that must never be
silently overwritten by a re-sync. If `theme/tokens/colors.json` or
`theme/tokens/theme.json` changes, re-derive `color-overrides.ts`'s values
by hand (cross-check against a freshly regenerated
`color-mapping.todo.md`) — do not delete and regenerate it mechanically.

`theme/breakpoints.config.ts` is a separate generated file (see "Current
known limitations" below) — regenerate it in the same run by appending a
third script: `node scripts/sync-tokens.mjs && node
scripts/generate-theme-config.mjs && node scripts/generate-breakpoints-config.mjs`.

## Current known limitations

As of this skill's last sync (see `theme.config.ts`'s own header comment for
the live numbers — it's regenerated every run, so trust it over this prose):

- **Spacing, radius, and 8 of 13 CDS typography roles are resolved into
  `neonTheme`** (`display1/2/3`, `title1/2/3`, `headline`, `body` — see
  `theme.config.ts`'s header for the exact Finnomena role each one came
  from). Fields CDS requires but Finnomena's export has no data for at all
  (`iconSize`, `avatarSize`, `borderWidth` as a general scale,
  `controlSize`, `textTransform`, `shadow`, `fontFamilyMono`, and the 5
  unmapped typography roles) fall back to CDS's own `defaultTheme` values at
  runtime via `createTheme.ts` — that's expected platform fallback, not a
  bug, and not something to flag to the user.
  - A handful of spacing values (currently 1, 4, 28, 36px, among others —
    see `theme.config.ts`'s own header) exist in the raw export but aren't
    part of CDS's required 15-value `space` scale, so they're not included.
    If a mockup seems to need one of these exact values, flag it to the
    user rather than inventing a workaround.
  - `fontWeight` values are converted from Finnomena's variant-name strings
    (e.g. "Regular", "SemiBold") to numeric CSS weights via the standard
    naming convention (Regular=400, SemiBold=600, etc.) — this conversion
    table is generic CSS knowledge, not Finnomena-specific data.
  - `fontSize`/`lineHeight` are emitted as exact pixel strings (e.g.
    `"17px"`), while CDS's own `defaultTheme` (and the 5 unmapped roles)
    use `rem`. This is a deliberate trade-off, not an oversight: it means
    the 8 mapped roles won't scale if a user changes their browser's
    default text size, while the unmapped roles will. If accessibility
    / text-zoom behavior matters for a specific mockup, flag this
    inconsistency to the user rather than assuming it's fine.
- **⚠ Color is a provisional, first-pass mapping — not a final brand
  sign-off.** `theme/color-overrides.ts` (hand-written, not generated) maps
  Finnomena's brand roles from `DESIGN.md` onto CDS's 42 semantic color
  slugs and 8 of 11 spectrum hues (the ones with a same-name Finnomena
  family: blue/green/orange/yellow/indigo/purple/red/teal). Every value
  traces to a real Finnomena token — none are invented — but which
  Finnomena role fills which CDS slot involved real judgment calls
  (documented in that file's own header, e.g. Navy Ink filling CDS's
  "primary" concept). **Treat any color choice as something the design
  owner should confirm, not as settled** — especially before shipping a
  mockup to stakeholders as brand-accurate. A handful of slugs
  (`bgSecondaryWash`, `bgLineHeavy`, `bgLinePrimarySubtle`, and dark-mode
  wash variants blocked by a known Finnomena export gap — see
  `color-overrides.ts`) have no confident Finnomena source and fall back to
  CDS's own default colors; `gray`/`pink`/`chartreuse` spectrum hues do too.
- If asked to build UI now: use the real tokens via semantic *names* as
  usual, and flag color as provisional/needs-design-review rather than
  final. If the palette is ever re-synced and a required space/radius value
  goes missing, `generate-theme-config.mjs` throws loudly rather than
  silently dropping it — check the regeneration output rather than trusting
  this prose, and don't hand-copy specifics here since they can drift.
- **To update tokens:** never hand-fill values in `theme.config.ts` or
  `color-mapping.todo.md` — edit the source files in `theme/tokens/` and
  run the pipeline above; both are regenerated wholesale every run. To
  update the color mapping itself, hand-edit `color-overrides.ts` directly
  (see that file's own header) — it is never regenerated.

### Known heuristic limitation in `sync-tokens.mjs`

Its alias resolver falls back to fuzzy last-two-segment suffix matching when
an exact path isn't found. This is a deliberate best-effort convenience, not
a guarantee — if a resolved value ever looks surprising, check its
`sourceFile` in `tokens.resolved.json` and trace it back rather than
trusting it blindly.

## Roadmap context

This skill is an early step of a longer plan (real brand values → Figma Code
Connect → token sync automation + governance). Ask the maintainer for the
full roadmap if asked about future phases — it isn't shipped in this repo.

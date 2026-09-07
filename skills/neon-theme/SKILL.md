---
name: neon-theme
description: Apply Finnomena's brand theme on top of the Coinbase Design System (CDS) when building or vibe-coding any UI mockup, screen, or component. Use whenever a Finnomena employee asks Claude to build UI, a mockup, a screen, or a React component and it should look on-brand — not styled with CDS's default Coinbase branding or with hardcoded colors/spacing.
---

# Finnomena Brand Theme (CDS)

This skill is a thin layer on top of Coinbase's own official tooling. It does
**not** reimplement component knowledge — for "which component do I use" and
"what props does Button take," rely on Coinbase's own skills and MCP server
(installed automatically as a dependency of this skill):

- `cds-code` — component selection, correct style-prop usage
- `cds-docs` — component reference docs
- CDS MCP Server (`@coinbase/cds-mcp-server`) — environment detection,
  component discovery, token access

This skill's only job is to make sure whatever CDS produces uses
**Finnomena's** brand, not Coinbase's default theme. It themes UI inside a
project that already exists — if the user wants a brand-new project
scaffolded from scratch (Vite + React + CDS + a responsive app-shell
layout), use `../neon-starter` instead.

See `../../DESIGN.md` (repo root) for the full color/typography/spacing
reference tables, per-component styling notes, and do's/don'ts — read it
before making styling decisions rather than guessing from `theme.config.ts`
alone.

## What this skill does, every time

1. **Ensure `@coinbase/cds-web` is installed** in the current project. If it
   isn't, install it before writing any component code:

   ```
   npm install @coinbase/cds-web
   ```

2. **Use `createNeonTheme()`, never CDS's `defaultTheme` passed through
   unmodified.** Import it from `./theme/createTheme.ts` (copy this folder's
   `theme/` directory into the target project if it isn't already there),
   call it, and pass the result to `ThemeProvider`'s `theme` prop alongside
   an `activeColorScheme` prop (`"light"` or `"dark"`). `createNeonTheme()`
   merges Finnomena's overrides (`theme.config.ts`'s `neonTheme`) onto CDS's
   own `defaultTheme`, since `ThemeProvider` requires a complete
   `ThemeConfig`, not a partial one. See `examples/app-entry.tsx` for the
   exact pattern.

3. **Enforce provider order.** It must always be:

   ```
   MediaQueryProvider → ThemeProvider → PortalProvider
   ```

   Do not reorder, skip, or nest these differently — CDS's responsive and
   theming behavior depends on this exact order.

4. **Forbid hardcoded colors and spacing.** Never write a hex/rgb color,
   raw pixel padding/margin, or a raw border-radius number directly in JSX or
   CSS-in-JS. Always go through `neonTheme`'s semantic tokens via CDS's
   style props (e.g. `color="textPrimary"`, `padding="medium"`,
   `borderRadius="sm"`). If a mockup needs a value that has no matching
   token, that's a signal to flag it to the user rather than invent a
   one-off hex value. **Color tokens specifically aren't Finnomena-mapped
   yet** (see "Current known limitations") — CDS's default Coinbase colors
   render until that's resolved. Flag this to the user if a mockup's color
   accuracy matters right now; don't silently present default Coinbase
   colors as on-brand.

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
to update either file. `theme/createTheme.ts` (the runtime merge helper) is
hand-written, not generated — it doesn't depend on Finnomena's specific
token values, only on `neonTheme`'s shape.

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
- **⛔ Color is NOT resolved and is not safe to present as on-brand yet.**
  `neonTheme` deliberately does not populate `lightSpectrum`/`darkSpectrum`/
  `lightColor`/`darkColor` at all — Finnomena's semantic token names
  (`text-primary`, `icon-on-brand`, ...) share no vocabulary with CDS's
  semantic slugs (`fg`, `bgPrimary`, `accentBoldBlue`, ...), so mapping one
  onto the other is a real design decision this generator will not guess.
  **CDS's own default brand colors (Coinbase blue, etc.) render until a
  human fills in `theme/color-mapping.todo.md`** (regenerated every run
  with the current unmapped-slug list and a reference table of what
  Finnomena's own tokens resolve to) and this generator is extended to
  consume that decision. If a user asks whether a mockup's colors are
  accurate to the brand, tell them this is still open — don't imply it's
  handled.
- If asked to build UI now: use the real (non-color) tokens via semantic
  *names* as usual, and flag color explicitly as pending. If the palette is
  ever re-synced and a required space/radius value goes missing,
  `generate-theme-config.mjs` throws loudly rather than silently dropping
  it — check the regeneration output rather than trusting this prose, and
  don't hand-copy specifics here since they can drift.
- **To update tokens:** never hand-fill values in `theme.config.ts` or
  `color-mapping.todo.md` — edit the source files in `theme/tokens/` and
  run the pipeline above. Both files are regenerated wholesale every run.

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

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
**Finnomena's** brand, not Coinbase's default theme.

See `DESIGN.md` for the full color/typography/spacing reference tables,
per-component styling notes, and do's/don'ts — read it before making styling
decisions rather than guessing from `theme.config.ts` alone.

## What this skill does, every time

1. **Ensure `@coinbase/cds-web` is installed** in the current project. If it
   isn't, install it before writing any component code:

   ```
   npm install @coinbase/cds-web
   ```

2. **Use `companyTheme`, never CDS's `defaultTheme`.** Import it from
   `./theme/theme.config.ts` (copy this folder's `theme/` directory into the
   target project if it isn't already there) and pass it to `ThemeProvider`.
   See `examples/app-entry.tsx` for the exact pattern.

3. **Enforce provider order.** It must always be:

   ```
   MediaQueryProvider → ThemeProvider → PortalProvider
   ```

   Do not reorder, skip, or nest these differently — CDS's responsive and
   theming behavior depends on this exact order.

4. **Forbid hardcoded colors and spacing.** Never write a hex/rgb color,
   raw pixel padding/margin, or a raw border-radius number directly in JSX or
   CSS-in-JS. Always go through `companyTheme`'s semantic tokens via CDS's
   style props (e.g. `color="textPrimary"`, `padding="medium"`,
   `borderRadius="sm"`). If a mockup needs a value that has no matching
   token, that's a signal to flag it to the user rather than invent a
   one-off hex value.

5. **Component-level default overrides** (e.g. "all buttons should have a
   pill radius") go through CDS's `ComponentConfigProvider`, not by editing
   theme tokens. Don't repurpose a color/space token to hack a
   component-specific look.

6. **Custom tokens** that aren't part of CDS's built-in `ThemeVars` (e.g.
   Finnomena-specific tokens) must be declared via the `ThemeVarsExtended`
   namespace before use — don't just bolt extra keys onto the theme object
   and hope CDS's types pick them up.

## Regenerating theme.config.ts

`theme.config.ts` is a **generated file** — mechanically projected from the
raw Figma Token Studio export in `theme/tokens/*.json`. Never hand-edit it.
To update it (after adding/changing files in `theme/tokens/`), run both
scripts in order from `skills/neon-theme/`:

```
node scripts/sync-tokens.mjs && node scripts/generate-theme-config.mjs
```

The first resolves every token alias in `theme/tokens/` into
`theme/tokens.resolved.json` (values) and `theme/tokens.report.json`
(resolution stats + exactly which root collections are still missing). The
second reads those two files and rewrites `theme/theme.config.ts` from
scratch. This is the only supported way to update the file.

## Current known limitations

As of this skill's last sync (see `theme.config.ts`'s own header comment for
the live numbers — it's regenerated every run, so trust it over this prose):

- **Spacing, radius, breakpoints/layout, typography, and color are all
  resolved.** `tokens/colors.json` (Finnomena's primitive palette — Black,
  White, Grey, Light Grey, Yellow, Navy, Green, Blue, Purple, Red, Orange,
  Indigo, Violet) landed and every semantic color token in `theme.config.ts`
  — including `lightColor`/`darkColor` cross-references like Tag's
  `border-disabled`/`color-disabled` that route through other semantic
  groups before bottoming out in a primitive — now traces to a real value.
  Safe to present generated mockups as accurate to Finnomena's brand colors.
  - A handful of spacing values (currently 1, 2, 4, 6, 12, 28, 36px) aren't
    multiples of CDS's required 8px base unit. These are intentionally
    excluded from `spaceScale` rather than rounded — see `theme.config.ts`'s
    header for the full list. If a mockup seems to need one of these exact
    values, flag it to the user rather than inventing a workaround.
  - `typeScale`'s `fontWeight` values are variant-name strings (e.g.
    "Regular", "SemiBold") sourced from the Figma export's own font
    ("Finnomena Trek"), **not verified** against IBM Plex Sans Thai's actual
    available weights, nor against CDS's expected typography weight type.
  - **Color values are "r,g,b" for opaque colors but "r,g,b,a" (4
    components, alpha 0-1) for any of the many translucent "*A" shade
    variants** (used throughout overlays, hover/disabled states, subtle
    borders). This deviates from the project brief's originally-documented
    3-component convention — dropping alpha would have silently turned
    every translucent token opaque, so this was a deliberate fix, not
    invented data. **Not yet verified** that `@coinbase/cds-web`'s real
    `ThemeVars` color type accepts 4-component strings — check this before
    shipping; if it doesn't, alpha will need a different mechanism per
    color.
  - Every field/shape (nested group structure, key names) is still
    illustrative — `@coinbase/cds-web` is not installed anywhere in this
    repo, so `ThemeConfig`/`ThemeVars`'s real shape could not be verified
    against `@coinbase/cds-web/core/theme`. Confirm before shipping.
- If asked to build UI now: use the real tokens via semantic *names* as
  usual. If the palette is ever re-synced and a family goes missing again,
  `theme.config.ts`'s header and `theme/tokens.report.json`'s
  `missingRootCollections` will say so live — check those rather than
  trusting this prose, and don't hand-copy a missing-family list here since
  it can drift.
- **To update tokens:** never hand-fill color/spacing/etc. values in
  `theme.config.ts` — edit the source files in `theme/tokens/` and run the
  two-script pipeline above. The file is regenerated wholesale every run.

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

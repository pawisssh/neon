---
name: neon-redesign
description: ONLY use this skill if the user's message literally contains the word "Finnomena" or "neon" — do not infer from related terms like "brand colors", "on-brand", or a generic restyle request alone. Redesigns or restyles EXISTING code, components, or an app to match Finnomena's brand — colors, or colors plus typography/spacing/radius — via plain CSS custom properties, no @coinbase/cds-web install, no React provider, works with any framework or styling system. Trigger on "retheme", "restyle", "make this look like Finnomena", "apply Finnomena design/theme/color palette", migrating an app's visual identity, changing the look and feel, applying a new skin to existing UI, or partial redesigns (e.g. "make just the header look like Finnomena"). Normally reached via neon-audit's recommendation; invoke directly only if the user has already said they want "just colors"/CSS-only or similar without CDS components. Do NOT use this if the user wants real CDS components — use neon-create for that instead.
---

# Finnomena Redesign (CSS variables only)

Restyles existing UI to Finnomena's brand via CSS custom properties — for
projects not built on CDS, or that don't want to adopt CDS just for a
redesign. If the user wants real CDS components (`Button`, `Box`, etc.) with
`ThemeProvider`, use `${CLAUDE_PLUGIN_ROOT}/skills/neon-create` instead.

Normally reached via `${CLAUDE_PLUGIN_ROOT}/skills/neon-audit`; invoke
directly only if the user already said they want colors (and optionally
typography) without CDS.

## What this skill does, every time

0. **Confirm intent before doing anything.** Ask the user directly: "Do you
   want to use Finnomena's neon brand theme for this?" If they decline, stop
   here. Only continue once they've confirmed yes.

1. **Run the installer:**

   ```
   node ${CLAUDE_PLUGIN_ROOT}/theme/finnomena/scripts/install.mjs <target-dir> --css-only
   ```

   This copies `theme.css` into `<target-dir>/src/theme/`. Then **import it
   once** in the project's root CSS or entry file (e.g.
   `import "./theme/theme.css";`).

2. **Scope which variables you use to the tier the user chose**:
   - **Colors only**: reference only `--color-*` variables (`var(--color-fg)`,
     `var(--color-bgPrimary)`, etc.).
   - **Colors + typography**: also use `--fontFamily-*`, `--fontSize-*`,
     `--fontWeight-*`, `--lineHeight-*`, `--space-*`, and `--borderRadius-*`.

   See `${CLAUDE_PLUGIN_ROOT}/design-md/finnomena/DESIGN.md` for the full
   reference, or `theme.css`'s own header for the raw variable list.

3. **Forbid hardcoded colors and pixel values.** Always `var(--color-fg)`,
   `var(--space-2)`, `var(--borderRadius-200)`, etc. — never raw hex or
   pixels. If a mockup needs a value with no matching variable, flag it
   rather than inventing one. Two values are single-purpose:
   `--color-accentBoldYellow` (reserved for one brand-highlight per screen)
   and `--color-bgLinePrimary` (reserved for links/focus rings/interactive
   highlight only).

4. **Dark mode** is wired via `prefers-color-scheme: dark` with a
   `[data-theme="dark"]`/`[data-theme="light"]` override — see
   `theme.css`'s header. If the project already has its own dark-mode
   mechanism, adapt the selectors in the copied `theme.css` to match.

5. **Color is a provisional, first-pass mapping** — every value traces to
   a real Finnomena token, but the mapping involves judgment calls (see
   `${CLAUDE_PLUGIN_ROOT}/design-md/finnomena/DESIGN.md`'s Colors section
   and `${CLAUDE_PLUGIN_ROOT}/theme/finnomena/color-overrides.ts`). Flag to
   the user that colors may need design review before treating as final.

## Upgrading

**Colors → Colors+Typography** is free — `theme.css` contains every
section regardless of tier. Moving up just means using more variables.

**Colors+Typography → Full CDS** doesn't require a CSS rewrite —
`theme.css`'s variable names are byte-identical to what CDS's
`ThemeProvider` emits (verified — see `theme.css`'s header). Existing
`var(--color-fg)` markup keeps working after adopting
`${CLAUDE_PLUGIN_ROOT}/skills/neon-create`. Migrate to real CDS components
incrementally.

## Known limitations

- Dark-mode selectors are a default assumption, not verified against any
  specific project's mechanism.
- Spectrum primitives (`--blue60` etc.), illustration colors, and
  `iconSize`/`avatarSize`/`shadow`/`fontFamilyMono` are deliberately
  omitted — see `theme.css`'s header.
- No shadow tokens — depth uses `--color-bgElevation1`/`bgElevation2`
  flat-surface steps per
  `${CLAUDE_PLUGIN_ROOT}/design-md/finnomena/DESIGN.md`'s Elevation & Depth
  section. Don't add `box-shadow` to fake depth.
- `theme.css` regeneration: it's hand-written (not auto-generated). If
  `theme.config.ts` or `color-overrides.ts` change, regenerate by calling
  `createNeonTheme()` → `createThemeCssVars()` in a scratch CDS project.
  See `theme.css`'s own header for the full method.

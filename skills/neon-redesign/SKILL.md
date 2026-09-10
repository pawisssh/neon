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
   Finnomena's neon brand theme for this?" If the answer is no, stop here.

1. **Run the installer:**

   ```
   node ${CLAUDE_PLUGIN_ROOT}/scripts/install.mjs <target-dir> --css-only
   ```

   This copies `theme.css` into `<target-dir>/src/theme/`. Pass
   `--theme-dir <project-relative-dir>` to put it somewhere else instead
   (e.g. `styles/neon` for a plain-HTML project) — validated to stay inside
   `<target-dir>` before anything is written. Then **import it once** in the
   project's root CSS or entry file (e.g. `import "./theme/theme.css";`).
   **If the target already has a customized `theme.css`, the installer
   refuses to overwrite it and exits nonzero before touching anything** —
   diff, merge, and retain the customization rather than deleting the
   file or bypassing the check; see
   `${CLAUDE_PLUGIN_ROOT}/skills/neon-audit/references/theme-integration.md`
   §4 (§5 for what a partial multi-file-copy failure does and doesn't
   guarantee).

2. **Scope which variables you use to the tier the user chose**:
   - **Colors only**: reference only `--color-*` variables (`var(--color-fg)`,
     `var(--color-bgPrimary)`, etc.). Never touch font loading at this tier.
   - **Colors + typography**: also use `--fontFamily-*`, `--fontSize-*`,
     `--fontWeight-*`, `--lineHeight-*`, `--space-*`, and `--borderRadius-*`.
     Defining `--fontFamily-body: 'IBM Plex Sans Thai', sans-serif` doesn't
     make the font render — it still needs to actually be loaded (a
     `<link>`, a self-hosted `@font-face`/`@fontsource` import, or a
     framework font loader), or text silently falls back to `sans-serif`.
     Inspect the app's existing font-loading mechanism, prefer it, load
     only the weights in use, and verify with real Thai *and* Latin sample
     text — full procedure in
     `${CLAUDE_PLUGIN_ROOT}/skills/neon-audit/references/theme-integration.md`
     §1.

   See `${CLAUDE_PLUGIN_ROOT}/design-md/finnomena/functional-layout/DESIGN.md`'s
   Typography section for the full reference (shared with the immersive
   guide), or `theme.css`'s own header for the raw variable list.

3. **Don't hardcode a value when a matching token is in scope — but don't
   forcibly retheme the app's own layout geometry either.** Don't write a
   raw hex/color literal where a `--color-*` token maps to it (any tier).
   At `tier: 'visual-system'`, the same applies to `--space-*`,
   `--borderRadius-*`, and `--font*-*` values that are actually part of
   Finnomena's brand system. But a structural/layout pixel value that
   isn't part of the brand system — a specific component's internal grid
   gap, an unrelated one-off dimension with no Finnomena equivalent — is
   the app's own design decision to preserve, not something to forcibly
   convert to a token just because it's a pixel value. If a mockup needs
   a branded value with no matching variable, flag it rather than
   inventing one. Two values are single-purpose:
   `--color-accentBoldYellow` (reserved for one brand-highlight per screen)
   and `--color-bgLinePrimary` (reserved for links/focus rings/interactive
   highlight only).

   For the full inventory → map → update-shared → update-remaining →
   verify migration procedure — including how to detect and update plain
   CSS/CSS Modules, Tailwind v3, Tailwind v4, and shadcn-style projects
   without breaking their existing variable-value format, and how to
   handle chart/status colors separately from brand colors — see
   `${CLAUDE_PLUGIN_ROOT}/skills/neon-redesign/references/style-migration.md`.
   Before claiming a restyle is done, verify per
   `${CLAUDE_PLUGIN_ROOT}/skills/neon-redesign/references/verification.md`.

4. **Dark mode: keep the app's existing source of truth.** `theme.css`
   ships wired via `prefers-color-scheme: dark` with a
   `[data-theme="dark"]`/`[data-theme="light"]` override (see `theme.css`'s
   header), but that's a default assumption, not the target project's
   actual mechanism. Before wiring anything, find out how the app already
   controls dark/light — an explicit toggle (a switch, a stored
   preference, a class/attribute a hook or context controls) or OS-only
   `prefers-color-scheme` — and match `theme.css`'s selectors to it. If
   the app has its own explicit toggle, that toggle stays authoritative;
   don't let `theme.css`'s shipped default silently override a user's
   explicit "light" choice with the OS's dark preference. See
   `${CLAUDE_PLUGIN_ROOT}/skills/neon-audit/references/theme-integration.md`
   §2 for the full procedure and worked example.

5. **Color is a provisional, first-pass mapping** — every value traces to
   a real Finnomena token, but the mapping involves judgment calls (see
   `${CLAUDE_PLUGIN_ROOT}/design-md/finnomena/functional-layout/DESIGN.md`'s
   Colors section and `${CLAUDE_PLUGIN_ROOT}/theme/cds/color-overrides.ts`).
   Flag to the user that colors may need design review before treating as final.

## Upgrading

**Colors → Colors+Typography** is free — `theme.css` contains every
section regardless of tier. Moving up just means using more variables.

**Colors+Typography → Full CDS** doesn't require a CSS rewrite, but isn't
a free pass either — `theme.css`'s variable names are byte-identical to
what CDS's `ThemeProvider` emits (verified — see `theme.css`'s header),
**but identical names don't guarantee `var(--color-fg)` markup keeps
working unchanged.** Before adopting
`${CLAUDE_PLUGIN_ROOT}/skills/neon-create` and removing `theme.css`, run
the integration check in
`${CLAUDE_PLUGIN_ROOT}/skills/neon-audit/references/theme-integration.md`
§3: inspect variable *scope* (CDS may inject its custom properties at a
different DOM node than `theme.css`'s `:root`), *cascade* (both can be
present simultaneously during migration — load order decides which
wins), *portal behavior* (does themed content still reach overlays
rendered by CDS's `PortalProvider`?), and *theme-state ownership* (§2
above). Verify both light and dark render correctly before removing the
old declarations. Migrate to real CDS components incrementally.

## Known limitations

- Dark-mode selectors are a default assumption — match them to the
  target project's actual mechanism per step 4 above (see
  `${CLAUDE_PLUGIN_ROOT}/skills/neon-audit/references/theme-integration.md`
  §2) rather than assuming the shipped `prefers-color-scheme` default is
  already correct.
- Spectrum primitives (`--blue60` etc.), illustration colors, and
  `iconSize`/`avatarSize`/`shadow`/`fontFamilyMono` are deliberately
  omitted — see `theme.css`'s header.
- No shadow tokens — depth uses `--color-bgElevation1`/`bgElevation2`
  flat-surface steps per
  `${CLAUDE_PLUGIN_ROOT}/design-md/finnomena/functional-layout/DESIGN.md`'s
  Spacing, Shapes & Depth section. Don't add `box-shadow` to fake depth.
- `theme.css` regeneration: it's hand-written (not auto-generated). If
  `theme.config.ts` or `color-overrides.ts` change, regenerate by calling
  `createNeonTheme()` → `createThemeCssVars()` in a scratch CDS project.
  See `theme.css`'s own header for the full method.
- Installer writes are only preflighted against a *known* conflict (a
  customized destination file) — an arbitrary disk/I/O failure mid-copy
  isn't automatically rolled back. If `install.mjs` errors after it
  starts reporting progress, check which theme file(s) actually landed
  before retrying; don't assume a clean state.

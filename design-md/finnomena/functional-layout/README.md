# Finnomena

Navy Ledger — a monochrome financial system where navy ink (`#01172b`) stands in for black on every surface, broken only by a single yellow signal (`#f2f93c`) reserved for the one moment that should stand out, and an indigo (`#1817e7`) locked to links and focus states. Flat elevation, an 8px spacing grid, and a single type family (IBM Plex Sans Thai) across the whole scale.

## Files

| File | Description |
|------|-------------|
| `DESIGN.md` | The complete design system specification in [DESIGN.md](https://github.com/google-labs-code/design.md) format — structured YAML design tokens (front matter) plus human-readable style guidance (markdown body). Drop it in a project root and any DESIGN.md-aware coding agent (Google Stitch, Claude, etc.) can generate on-brand Finnomena UI without installing anything. |
| `design_tokens.json` | A [Design Tokens Community Group](https://www.designtokens.org/) JSON file containing every token from the `DESIGN.md` front matter, including component-level tokens. Interoperable with Figma, Style Dictionary, and other token pipelines, and with the `@google/design.md` CLI's `lint`/`diff`/`export` commands. |
| `tailwind.config.js` | A Tailwind CSS v3 `theme.extend` config derived from the color/typography/radius/spacing tokens. Component tokens are intentionally excluded — Tailwind's utility-first approach composes those from the primitives instead. |

## Source of truth

`DESIGN.md` is the canonical Finnomena design reference for workspace/product screens — see [`../../README.md`](../../README.md) for how this guide relates to the standalone `immersive-layout` landing-page guide. Both [`skills/neon-create`](../../../skills/neon-create) (full Coinbase Design System theming, for a new or existing project) and [`skills/neon-redesign`](../../../skills/neon-redesign) (plain CSS custom properties, no CDS) route to whichever guide matches the screen, instead of duplicating their own copies. Every value traces back to Finnomena's raw, human-verified Figma token export in [`theme/tokens/`](../../../theme/tokens/) and the hand-reviewed brand-to-CDS color mapping in [`theme/cds/color-overrides.ts`](../../../theme/cds/color-overrides.ts) — nothing in this folder is invented. If Finnomena's raw tokens change, update those source files first, then regenerate this folder to match.

# Finnomena design.md guides

Two standalone [DESIGN.md](https://github.com/google-labs-code/design.md)-format guides live under `finnomena/`, each self-contained — a DESIGN.md-aware coding agent needs only the one file matching the screen it's building, not both:

| Guide | Use for |
| --- | --- |
| [`finnomena/functional-layout/DESIGN.md`](finnomena/functional-layout/DESIGN.md) | Workspace/product screens: dashboards, orders, holdings, forms, tables, persistent navigation. |
| [`finnomena/immersive-layout/DESIGN.md`](finnomena/immersive-layout/DESIGN.md) | Landing pages and focused acquisition flows: full-bleed, no persistent navigation. |

`skills/neon-create`, `skills/neon-redesign`, and `skills/neon-review` all route to whichever guide matches the screen being built or reviewed, rather than a combined file — there isn't one.

## Canonical source vs. optional exports

Each guide's own front matter (the YAML at the top of its `DESIGN.md`) is the canonical, resolvable token set — read that file alone and every `{colors.x}`-style reference resolves within it. That front matter traces back to Finnomena's raw, human-verified Figma token export in [`theme/tokens/`](../theme/tokens/) and the hand-reviewed brand-to-CDS mapping in [`theme/cds/color-overrides.ts`](../theme/cds/color-overrides.ts) — `theme/tokens/` is the actual source of truth; nothing in `design-md/` is invented independently of it.

`finnomena/functional-layout/` additionally ships two **optional**, derived exports for tooling that wants them instead of parsing YAML front matter — `design_tokens.json` (a [Design Tokens Community Group](https://www.designtokens.org/) JSON file, interoperable with Figma/Style Dictionary/the `@google/design.md` CLI) and `tailwind.config.js` (a Tailwind v3 `theme.extend` config derived from the same primitives). Neither is required to use the guide. `finnomena/immersive-layout/` does not yet have these derived exports — its `DESIGN.md` front matter is still the complete, standalone reference for that guide; regenerate the exports from `theme/tokens/` if immersive-layout needs them later, don't hand-write them.

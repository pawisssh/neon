# neon

A Claude Code plugin that lets any Finnomena employee vibe-code UI mockups
(via Claude Code or Cowork) that automatically follow Finnomena's branding,
built on top of the Coinbase Design System (`@coinbase/cds-web`).

## Installation

```
/plugin marketplace add https://github.com/pawisssh/neon
/plugin install neon
```

## Usage

Once installed, just ask Claude to build UI — a mockup, a screen, a React
component. The `neon-theme` skill activates automatically and makes sure the
result follows Finnomena's brand tokens (spacing, radius, typography, color)
instead of CDS's default Coinbase styling.

## What's here

```
neon/
├── LICENSE
├── marketplace.example.json          # template for a marketplace repo referencing this one
├── .claude-plugin/plugin.json        # plugin manifest (this repo IS the plugin)
└── skills/neon-theme/
    ├── SKILL.md                      # instructions Claude follows when theming UI
    ├── DESIGN.md                     # Finnomena style reference — colors, type, components
    ├── theme/
    │   ├── theme.config.ts           # companyTheme override of CDS defaultTheme
    │   ├── tokens/                   # raw Figma Variables export (source of truth)
    │   │   └── _archive/             # superseded token exports, kept for reference
    │   ├── tokens.resolved.json      # generated: flattened + alias-resolved
    │   └── tokens.report.json        # generated: what resolved / what's still blocked
    ├── scripts/
    │   ├── sync-tokens.mjs           # resolves tokens/*.json → tokens.resolved.json
    │   └── generate-theme-config.mjs # resolved tokens + report → theme.config.ts
    └── examples/
        └── app-entry.tsx             # correct provider setup + font loading
```

## Status

**Spacing, radius, typography (default web size class), and color are all
resolved** from Finnomena's Figma Variables export — 11,847 of 12,127 tokens
(~98%). The remaining unresolved tokens are typography values for non-default
size classes (mobile/tablet variants) and a handful of grid/layout tokens —
not color.

Known caveats, called out in `theme.config.ts`'s generated header:
- Color values use a 4-component `"r,g,b,a"` string for translucent shades
  (vs. 3-component `"r,g,b"` for opaque ones) — this hasn't been verified
  against `@coinbase/cds-web`'s real `ThemeVars` color type yet.
- Font family is deliberately pinned to `'IBM Plex Sans Thai', sans-serif`
  rather than the export's raw family name.
- Every field/shape in `theme.config.ts` is illustrative until
  `@coinbase/cds-web` is installed and its real `ThemeConfig`/`ThemeVars`
  shape is checked against it.

To regenerate the theme from a fresh Figma export:

```
cd skills/neon-theme
node scripts/sync-tokens.mjs && node scripts/generate-theme-config.mjs
```

This resolves `theme/tokens/*.json` into `tokens.resolved.json` and
`tokens.report.json`, then regenerates `theme.config.ts`. Never hand-edit
`theme.config.ts` — it's a generated file.

## Known limitations & roadmap

- Verify the color/shape assumptions above against a real
  `@coinbase/cds-web` install before shipping to production UI.
- Export the missing grid/layout and non-default-size-class typography
  tokens from Figma and re-sync.
- Longer term: sync `theme.config.ts` from Figma's published component
  library via Code Connect, with automated re-sync + governance instead of
  a manual export/run cycle.

## License

MIT — see [LICENSE](LICENSE).

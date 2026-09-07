# neon

A Claude Code plugin that lets any Finnomena employee vibe-code apps and UI
mockups (via Claude Code or Cowork) that automatically follow Finnomena's
branding, built on top of the Coinbase Design System (`@coinbase/cds-web`).
Ships two skills: `neon-starter` scaffolds a brand-new project; `neon-theme`
themes UI inside a project that already exists.

## Installation

```
/plugin marketplace add https://github.com/pawisssh/neon
/plugin install neon
```

## Usage (for Finnomena employees)

1. **Install the plugin once**, in Claude Code or Cowork:

   ```
   /plugin marketplace add https://github.com/pawisssh/neon
   /plugin install neon
   ```

2. **Starting a brand-new project?** Ask Claude to scaffold one:

   ```
   Start a new Finnomena app with the standard layout
   ```

   The `neon-starter` skill activates, scaffolds a Vite + React +
   TypeScript project pre-wired with Finnomena's theme and a responsive
   Sidebar/Content/Inspector app shell, and tells you how to run it
   (`npm install && npm run dev`). Confirm the app boots before assuming
   it's done.

3. **Already have a project? Just ask Claude to build UI** — a mockup, a
   screen, a React component, a whole page. For example:

   ```
   Build a login screen with email/password fields and a submit button
   ```

   ```
   Make a dashboard card showing portfolio value with a trend chart
   ```

   You don't need to mention "neon," "Finnomena," or "CDS" — the
   `neon-theme` skill activates automatically whenever Claude is asked to
   build UI, and takes care of:

   - installing `@coinbase/cds-web` in the project if it isn't there yet
   - wiring up the correct provider setup (`MediaQueryProvider` →
     `ThemeProvider` → `PortalProvider`) with Finnomena's `neonTheme`
     instead of CDS's default Coinbase theme
   - using Finnomena's brand tokens for spacing, radius, and typography
     (IBM Plex Sans Thai) — no hardcoded pixel values. **Color is not yet
     Finnomena-mapped** — CDS's own default brand colors render until a
     human maps Finnomena's palette onto CDS's color slugs (see
     `skills/neon-theme/theme/color-mapping.todo.md`)
   - picking the right CDS component and props via Coinbase's own
     `cds-code` / `cds-docs` skills and MCP server

4. **Review the result** like any AI-generated UI — check it against
   [DESIGN.md](DESIGN.md) if something looks off-brand, and flag it if a
   design needs a value that doesn't have a matching token yet.

That's it — no manual setup, no copying theme files by hand for a typical
mockup. Claude handles the plumbing described in "What's here" below.

## How to verify it's working

After asking Claude to build UI, check for these signs that `neon-theme`
actually activated:

- **Claude announces it.** You should see something like "Using neon-theme
  to apply Finnomena's brand theme..." before the UI is generated. If you
  don't see that, the skill probably didn't fire.
- **The generated code calls `createNeonTheme()`** (from `theme/createTheme.ts`)
  and passes the result to `ThemeProvider` — never CDS's `defaultTheme`
  passed through unmodified.
- **Provider order is exactly** `MediaQueryProvider` → `ThemeProvider` →
  `PortalProvider`.
- **No hardcoded hex colors or raw pixel values** (e.g.
  `color: "#1F3344"`, `padding: 16`) — only semantic props like
  `color="textPrimary"`, `padding="medium"`, `borderRadius="sm"`.
- **Font is IBM Plex Sans Thai**, not a default system font.
- **You can just ask** — "which skill did you use to style this?" Claude
  will name `neon-theme` if it applied.

If you're unsure the plugin is even installed, run `/plugin` to open the
plugin manager and confirm `neon` is listed and enabled.

If Claude builds UI without the theme applied (default Coinbase styling,
hardcoded colors), the most common cause is the prompt not reading as a
UI-building request — be explicit the first time, e.g. "build this as a
React component using our design system."

For `neon-starter`, check instead that: a `template/` copy landed in your
target directory (`package.json`, `src/app/`, `src/layout/`), `src/theme/`
got populated (not empty — it's copied in from `neon-theme`), and
`npm run dev` actually boots without console/import errors.

## What's here

```
neon/
├── LICENSE
├── DESIGN.md                          # Finnomena style reference — colors, type, layout, components
├── marketplace.example.json           # template for a marketplace repo referencing this one
├── .claude-plugin/
│   ├── plugin.json                    # plugin manifest — lists both skills below
│   └── marketplace.json               # self-hosted marketplace (source: ".")
├── skills/neon-theme/                 # themes UI in a project that already exists
│   ├── SKILL.md                       # instructions Claude follows when theming UI
│   ├── theme/
│   │   ├── theme.config.ts            # generated: neonTheme overrides (space/radius/typography)
│   │   ├── createTheme.ts             # createNeonTheme(): merges neonTheme onto CDS's defaultTheme
│   │   ├── color-mapping.todo.md      # generated: human handoff doc — color isn't mapped yet
│   │   ├── breakpoints.config.ts      # generated: 7-tier breakpoint/grid data
│   │   ├── tokens/                    # raw Figma Variables export (source of truth)
│   │   │   └── _archive/              # superseded token exports, kept for reference
│   │   ├── tokens.resolved.json       # generated: flattened + alias-resolved
│   │   └── tokens.report.json         # generated: what resolved / what's still blocked
│   ├── scripts/
│   │   ├── sync-tokens.mjs                    # resolves tokens/*.json → tokens.resolved.json
│   │   ├── generate-theme-config.mjs          # resolved tokens → theme.config.ts + color-mapping.todo.md
│   │   └── generate-breakpoints-config.mjs    # resolved tokens → breakpoints.config.ts
│   └── examples/
│       └── app-entry.tsx              # correct provider setup + font loading
└── skills/neon-starter/               # scaffolds a brand-new project
    ├── SKILL.md                       # instructions Claude follows when scaffolding
    └── template/                      # committed Vite + React + TS project to copy in
        └── src/
            ├── app/                   # AppRoot (providers) + example App
            └── layout/                # responsive Sidebar/Content/Inspector app shell
```

## Maintainer notes

Token resolution status, theme regeneration steps, known limitations, the
roadmap, and marketplace/publishing admin instructions live in
[notes/README.md](notes/README.md) — not needed for everyday UI-building
usage above.

## License

MIT — see [LICENSE](LICENSE).

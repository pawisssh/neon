# neon

A Claude Code plugin that lets any Finnomena employee vibe-code apps and UI
mockups (via Claude Code or Cowork) that automatically follow Finnomena's
branding — with a choice of depth. Ships three skills:

- `neon-audit` — for an *existing* project, checks it and recommends a
  theming depth, then hands off to one of the two below.
- `neon-redesign` — restyles existing UI with Finnomena's colors, or colors
  + typography/spacing/radius, as plain CSS variables. No CDS install,
  works with any framework.
- `neon-create` — full theming on top of the Coinbase Design System
  (`@coinbase/cds-web`): real CDS components, `ThemeProvider`, the works —
  either scaffolds a brand-new project (Vite + React + full CDS) or themes
  one that already exists, depending on what you ask for.

## Commands

Claude usually activates the right skill on its own from context (see
[Usage](#usage-for-finnomena-employees) below) — you don't need to type
these. Use them when you want to invoke a skill explicitly.

| Command | What it does |
| --- | --- |
| `/neon:neon-audit` | Check an *existing* project and recommend a theming depth (colors only, colors + typography, or full CDS). |
| `/neon:neon-redesign` | Restyle existing UI with Finnomena's colors, or colors + typography/spacing/radius, via plain CSS variables — no CDS install. |
| `/neon:neon-create` | Apply full theming on top of the Coinbase Design System — real CDS components, `ThemeProvider`, the works. Scaffolds a new Vite + React + TypeScript project, or themes an existing one, depending on what you ask for. |

Commands need a skill-capable host. In **Claude Code / Cowork**, once the
plugin is installed (see below), these work as typed slash commands. In
**Codex CLI**, skills are invoked by request rather than slash syntax — see
the Codex install steps below for how they get discovered.

## Installation

### Claude Code / Cowork

```
/plugin marketplace add https://github.com/pawisssh/neon
/plugin install neon
```

### OpenAI Codex CLI

Codex has no plugin marketplace — skills are installed per-folder. There
are two ways to get these in:

**Using the Codex Skill Installer (recommended)** — inside a Codex session:

```
$skill-installer https://github.com/pawisssh/neon
```

Run one invocation per skill (the repo holds three skill folders, not one) —
point it at each skill's own subfolder rather than the repo root, since a
"skill" to Codex is one directory containing a `SKILL.md`, and the repo
root has other files alongside the skills. If the installer's prompt
doesn't accept a URL directly, describe the request instead, e.g. "install
the skill at https://github.com/pawisssh/neon/tree/main/skills/neon-audit".

**Manual install (fallback)** — clone the repo and symlink the skill
folders into wherever your Codex version scans for skills
(`.agents/skills/` in a project for repo-scoped, `~/.agents/skills/` for
every project — some Codex releases have used `~/.codex/skills` instead;
check `codex --help` or your installed version's docs if the installer
above doesn't work):

```
git clone https://github.com/pawisssh/neon.git ~/finnomena/neon

mkdir -p ~/.agents/skills
ln -s ~/finnomena/neon/skills/neon-audit ~/.agents/skills/neon-audit
ln -s ~/finnomena/neon/skills/neon-redesign ~/.agents/skills/neon-redesign
ln -s ~/finnomena/neon/skills/neon-create ~/.agents/skills/neon-create
```

Either way, start a new Codex session afterward — skills are discovered at
startup.

## Usage (for Finnomena employees)

1. **Install the plugin once**, in Claude Code or Cowork:

   ```
   /plugin marketplace add https://github.com/pawisssh/neon
   /plugin install neon
   ```

   Every skill's activation guard requires your message to literally
   contain the word "Finnomena" or "neon" the *first* time in a
   conversation — a bare "build me a login screen" won't trigger any of
   these skills on its own. Mention Finnomena (or "neon") explicitly once
   branding intent is established, and every neon skill carries that
   decision forward for the rest of the conversation — see step 5 below
   for how that plays out on a follow-up request.

2. **Starting a brand-new project?** Ask Claude to scaffold one:

   ```
   Start a new Finnomena app with the standard layout
   ```

   The `neon-create` skill activates, scaffolds a Vite + React +
   TypeScript project pre-wired with Finnomena's theme, picks a
   responsive layout matching what you described, and builds the actual
   feature you asked for — not just an empty themed shell. Claude verifies
   its own work (build/typecheck, then rendering and interaction checks)
   before reporting back; running `npm install && npm run dev` yourself is
   a good final confirmation, not the only check that happened.

3. **Adding a new screen to an existing app?** Say so, mentioning
   Finnomena the first time:

   ```
   Add a Finnomena login screen to this app, with email/password fields
   and a submit button
   ```

   `neon-audit` activates first, checks the project (does it already use
   CDS? Tailwind? something else?), and either proceeds straight to the
   obvious theming depth or asks which one you want, then hands off to
   `neon-redesign` or `neon-create` to build the screen. Your existing
   routes, components, and providers are reused — this doesn't rescaffold
   the app.

4. **Restyling an existing app?** Say what scope you want, mentioning
   Finnomena the first time. A whole-app restyle:

   ```
   Restyle this app to Finnomena's brand — colors and typography
   ```

   ...or a partial, header-only restyle:

   ```
   Make just the header look like Finnomena — leave the rest of the app
   alone
   ```

   Both go through `neon-audit` → `neon-redesign` (or `neon-create` if you
   ask for real CDS components). A partial request stays scoped to what
   you named — the rest of the app's styling is left untouched.

   In every case above, `neon-audit` does a quick check of your project
   and either proceeds straight to the obvious choice or asks which
   theming depth you want:

   - **Colors only**, or **colors + typography/spacing/radius** — plain CSS
     variables (`neon-redesign`), no CDS install, works with any framework.
   - **Full CDS** (`neon-create`) — installs `@coinbase/cds-web`, wires up
     `MediaQueryProvider` → `ThemeProvider` → `PortalProvider` with
     Finnomena's `neonTheme`, and builds with real CDS components.

   Either way you get Finnomena's brand tokens for spacing, radius,
   typography (IBM Plex Sans Thai), and color — no hardcoded hex/pixel
   values. **Color is a provisional, first-pass mapping** (see
   `theme/finnomena/color-overrides.ts`) — real Finnomena colors,
   but the exact Finnomena-role → CDS-slug assignment hasn't had design
   sign-off yet, so treat it as a strong draft, not a final answer. If you
   later outgrow a lighter tier, upgrading doesn't mean starting over — see
   each skill's own "Upgrading" section.

   For Full CDS specifically, Claude also picks the right CDS component and
   props via Coinbase's own `cds-code` / `cds-docs` skills if they're
   available in your environment, otherwise reads real types from
   `@coinbase/cds-web` directly.

5. **Once branding intent is established, follow-ups don't need to repeat
   it.** After any of the requests above, a later, plainly generic request
   in the *same conversation* still gets Finnomena's theme — you don't
   need to say "Finnomena" or "neon" again:

   ```
   Make the buttons clearer
   ```

   This works because the neon skills carry a confirmed branding decision
   forward across the conversation rather than re-asking every time — it's
   not that generic UI requests silently opt into Finnomena branding on
   their own. A *fresh* conversation, or a request for a different,
   unrelated project, has no established intent yet, so it's back to
   mentioning Finnomena/neon explicitly once.

6. **Review the result** like any AI-generated UI — check it against
   [DESIGN.md](design-md/finnomena/DESIGN.md) if something looks off-brand, and flag it if a
   design needs a value that doesn't have a matching token yet.

That's it — no manual setup, no copying theme files by hand for a typical
mockup. Claude handles the plumbing described in "What's here" below.

## How to verify it's working

After asking Claude to build UI in an existing project, check for these
signs that theming actually activated:

- **Claude announces it.** You should see something like "Using neon-audit
  to check your project..." followed by either a brief confirmation or a
  question about theming depth, then "Using neon-redesign..." or "Using
  neon-create...". If you don't see any of that, the skills probably didn't
  fire.
- **No hardcoded hex colors or raw pixel values** anywhere, regardless of
  which tier was used:
  - **Full CDS** (`neon-create`): real CDS token keys like `color="fg"`,
    `padding={2}`, `borderRadius="200"`; the generated code calls
    `createNeonTheme()` (from `theme/createTheme.ts`) and passes the result
    to `ThemeProvider` — never CDS's `defaultTheme` passed through
    unmodified; provider order is exactly `MediaQueryProvider` →
    `ThemeProvider` → `PortalProvider`.
  - **CSS-only** (`neon-redesign`): `var(--color-fg)`, `var(--space-2)`,
    `var(--borderRadius-200)`, etc. — a `theme.css` file should exist
    somewhere in the project and be imported once.
- **Font is IBM Plex Sans Thai**, not a default system font, in both cases.
- **You can just ask** — "which skill did you use to style this?" Claude
  will name `neon-redesign` or `neon-create` depending on which tier was
  used.

If you're unsure the plugin is even installed, run `/plugin` to open the
plugin manager and confirm `neon` is listed and enabled.

If Claude builds UI without the theme applied (default Coinbase styling,
hardcoded colors), the most common cause is the prompt not reading as a
UI-building request — be explicit the first time, e.g. "build this as a
React component using our design system."

For a brand-new project scaffolded by `neon-create`, check instead that: a
`starters/vitejs-cds/` copy landed in your target directory (`package.json`,
`src/app/`, `src/layout/`), `src/theme/` got populated (not empty — it's
copied in from `neon-create`), and `npm run dev` actually boots without
console/import errors.

## What's here

```
neon/
├── LICENSE
├── marketplace.example.json           # template for a marketplace repo referencing this one
├── .claude-plugin/
│   ├── plugin.json                    # plugin manifest — lists all three skills below
│   └── marketplace.json               # self-hosted marketplace (source: ".")
├── design-md/finnomena/               # standalone Finnomena brand spec, Google Stitch DESIGN.md format
│   ├── DESIGN.md                      # canonical token + component reference — no install required
│   ├── design_tokens.json             # same tokens as DTCG JSON, for Figma/Style Dictionary/design.md CLI
│   ├── tailwind.config.js             # derived Tailwind v3 theme.extend config
│   └── README.md
├── starters/vitejs-cds/               # committed Vite + React + TS project, copied in by neon-create
│   ├── package.json
│   └── src/
│       ├── app/                       # AppRoot (providers) + example App
│       ├── layout/                    # 5 responsive page-layout patterns (see neon-create/SKILL.md)
│       └── theme/                     # theme.config.ts/color-overrides.ts/createTheme.ts/breakpoints.config.ts
│                                       #   pre-wired here, kept in sync via install.mjs --sync-starter
├── theme/finnomena/                   # all Finnomena theme assets — CDS-tier + CSS-tier, one source of truth
│   ├── theme.config.ts                # generated: neonTheme overrides (space/radius/typography)
│   ├── color-overrides.ts             # hand-written: provisional Finnomena color mapping
│   ├── createTheme.ts                 # createNeonTheme(): merges neonTheme + color-overrides onto CDS's defaultTheme
│   ├── color-mapping.todo.md          # generated: reference dump used to build color-overrides.ts
│   ├── breakpoints.config.ts          # generated: 7-tier breakpoint/grid data
│   ├── theme.css                      # hand-written: real CDS createThemeCssVars() output (CSS-variable tier)
│   ├── tokens/                        # raw Figma Variables export (source of truth)
│   ├── tokens.resolved.json           # generated: flattened + alias-resolved
│   ├── tokens.report.json             # generated: what resolved / what's still blocked
│   ├── scripts/
│   │   ├── sync-tokens.mjs                    # resolves tokens/*.json → tokens.resolved.json
│   │   ├── generate-theme-config.mjs          # resolved tokens → theme.config.ts + color-mapping.todo.md
│   │   ├── generate-breakpoints-config.mjs    # resolved tokens → breakpoints.config.ts
│   │   └── install.mjs                        # deploys the theme: new project / existing project / CSS-only / sync starter
│   └── examples/
│       └── app-entry.tsx              # correct provider setup + font loading (existing-project branch)
├── skills/neon-audit/                 # entry point: checks an existing project, recommends a theming depth
│   └── SKILL.md
├── skills/neon-redesign/              # restyles existing UI — colors / colors+typography via plain CSS variables, no CDS
│   └── SKILL.md
└── skills/neon-create/                # full CDS theming — scaffolds a new project or themes an existing one
    └── SKILL.md                       # instructions Claude follows when scaffolding/theming UI
```

## Maintainer notes

Token resolution status, theme regeneration steps, known limitations, the
roadmap, and marketplace/publishing admin instructions live in
[notes/README.md](notes/README.md) — not needed for everyday UI-building
usage above.

## License

MIT — see [LICENSE](LICENSE).

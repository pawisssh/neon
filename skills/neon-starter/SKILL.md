---
name: neon-starter
description: ONLY use this skill if the user's message literally contains the word "Finnomena" or "neon" — do not infer from related terms like "CDS", "Coinbase Design System", or a generic "start a new app/project" request alone. Scaffolds a new, ready-to-run Vite + React + TypeScript project pre-wired with Finnomena's CDS brand theme and a choice of 5 responsive page-layout patterns (Detailed, Content, Simple, Multi-column, Immersive). Do NOT use this to add theming to UI inside a project that already exists — use neon-audit for that instead.
---

# Finnomena Starter (Vite + React + CDS)

This skill scaffolds a **whole new project**. If the user already has a
project and just wants Claude to build on-brand UI inside it, use
`../neon-audit` instead, which will recommend and hand off to the right
theming skill — this skill and that one are complementary, not overlapping.

## What this skill does, every time

0. **Confirm intent before doing anything.** Ask the user directly: "Do you
   want to use Finnomena's neon brand theme for this?" If they decline, stop
   here — don't apply this skill's steps. Scaffold a plain Vite + React +
   TypeScript project without the Finnomena theme/layout wiring instead (or
   ask what they'd like), rather than applying the brand theme anyway. Only
   continue past this point once they've confirmed yes.

1. **Confirm the target directory and project name** with the user before
   writing any files — never scaffold into a non-empty directory without
   asking first.

2. **Copy `template/` from this skill into the target directory verbatim.**
   This is a working Vite + React + TypeScript project — don't regenerate it
   from scratch or "improve" it ad hoc; if something in it needs to change,
   change the template's source files under this skill's own `template/`
   folder, not the copy in the user's project.

3. **Copy four files from `../neon-theme/theme/` into the new project's
   `src/theme/`** — not the whole `theme/` directory (the rest is source
   data and generator output nothing in the template imports):
   - `theme.config.ts`
   - `color-overrides.ts`
   - `createTheme.ts`
   - `breakpoints.config.ts`

   This is the same narrowed copy step `neon-theme/SKILL.md` documents for
   existing projects — do not hand-author any of these files a second time.
   The template's `AppRoot.tsx` and layout components import from
   `../theme/...`, so this step must happen before the app will type-check
   or run.

4. **Enforce provider order** in `src/app/AppRoot.tsx` — it must always be:

   ```
   MediaQueryProvider → ThemeProvider → PortalProvider
   ```

   Do not reorder, skip, or nest these differently — same rule as
   `neon-theme`, since it's CDS's own requirement, not specific to either
   skill.

5. **`App.tsx` boots into `AppShell` (Detailed Layout) by default** — leave
   it as-is unless the user's request calls for a different page pattern.
   Five layout patterns ship in `src/layout/`, all from the same Figma
   component set and sharing `Sidebar`/`ContentView`/`InspectorView` pane
   primitives plus `src/theme/breakpoints.config.ts` for sidebar width.
   Pick the one that matches what the user is describing, don't default to
   `AppShell` for everything:

   `Sidebar` ships with real Finnomena navigation out of the box, not an
   empty placeholder — a logo (`Logo.tsx`) and a 5-item ecosystem nav rail
   (`SidebarNav.tsx`, items in `navItems.ts`: Home/Search/Portfolio/
   Profile/Notifications, each linking to its real `finnomena.com`/
   `port.finnomena.com`/`auth.finnomena.com` destination in a new tab).
   The same items also power `BottomNav.tsx` at phone width. The `sidebar`
   prop passed into any layout is for *extra*, app-specific content
   rendered below this built-in nav — pass `null` if there isn't any.

   | Component | Panes | Use for |
   |---|---|---|
   | `AppShell` (Detailed Layout) | Sidebar + Content + Inspector, inspector-weighted | The default — general-purpose screens needing a detail/inspector panel |
   | `ContentLayout` | Sidebar + Content + Inspector, content-weighted | Screens where the main content should dominate over a secondary inspector |
   | `SimpleLayout` | Sidebar + Content only | Screens with no need for a third pane |
   | `MultiColumnLayout` | Sidebar + N horizontally-scrolling fixed-width columns | Kanban/board-style views |
   | `ImmersiveLayout` | Content only, full-bleed, logo-only header (no nav icons, no `BottomNav`) | Focus/distraction-free flows — full-screen editors, walkthroughs, single-task screens |

   All 5 are hand-maintained, Figma-sourced constants in
   `src/layout/layoutPanes.ts` (plus inline logic in the simpler
   components) — see that file's own header for exactly which numbers are
   corroborated vs. extrapolated, and re-verify before treating any as
   pixel-final in a real product.

6. **Install and hand off to the user.** Run `npm install`, then tell the
   user to run `npm run dev` and confirm the app boots. Don't claim the
   scaffold "works" without that confirmation — the same rule this repo
   applies to any UI change.

7. **Reuse `neon-theme`'s font-loading pattern** (IBM Plex Sans Thai — Google
   Fonts quick-start vs. self-hosted `@fontsource` for production) rather
   than inventing a new one. See `template/src/main.tsx` for the quick-start
   version already wired in.

8. **Forbid hardcoded colors and spacing** in any UI the user asks Claude to
   add inside `App.tsx` or new components — same rule as `neon-theme`: go
   through real CDS token keys via style props (`color="fg"`, `padding={2}`,
   `borderRadius="200"` — see `../neon-theme/SKILL.md` step 4 for the full
   reference), not raw hex/pixel values. (The layout components under
   `src/layout/` are the one exception — their pixel widths are structural
   breakpoint geometry sourced from `breakpoints.config.ts` /
   `layoutPanes.ts`, not colors or spacing that should route through
   theme tokens.) Note: color tokens are a provisional, first-pass mapping
   — see `../neon-theme/SKILL.md`'s known limitations.

## Regenerating breakpoints.config.ts

`src/theme/breakpoints.config.ts` (copied in from `neon-theme/theme/`) is a
**generated file** — mechanically projected from
`neon-theme/theme/tokens/breakpoint.json`. Never hand-edit it. To update it,
from `../neon-theme/`:

```
node scripts/sync-tokens.mjs && node scripts/generate-theme-config.mjs && node scripts/generate-breakpoints-config.mjs
```

Then re-copy the four files listed in step 3 into any already-scaffolded
project to pick up the change.

`layoutPanes.ts`, by contrast, is **not** generated by any script — it's a
hand-maintained set of constants (one per layout pattern) sourced from
individual Figma frame reads (see its own file header for each pattern's
source node and confirmation status). To update one: re-read the relevant
frame (`get_design_context`, `get_metadata`, or `get_screenshot` on the
node), edit `template/src/layout/layoutPanes.ts` directly (or the relevant
component's own inline logic for `SimpleLayout`/`ImmersiveLayout`/
`MultiColumnLayout`, which don't use `layoutPanes.ts`), and update the
provenance note in the relevant header comment.

## Known limitations

- **Content/Inspector pane widths in `layoutPanes.ts` come from individual
  Figma frame reads**, not the token pipeline (confirmed: the raw
  `breakpoint.json` export's per-variant numbers don't reliably predict
  actual pane visibility — see `layoutPanes.ts`'s header) — re-verify
  against fresh screenshots before treating them as pixel-final in a real
  product. Only the 1440px (xxxl) frame was checked per pattern for the 4
  non-default layouts; other breakpoints are extrapolated, not
  independently confirmed.
- **Observed sidebar-width inconsistency**: Content Layout and
  Multi-column Layout's own 1440px Figma frames show a 320px sidebar,
  while Detailed/Simple Layout (and `breakpoints.config.ts`) show 360px at
  the same nominal breakpoint. All 5 patterns use the shared
  `breakpoints.config.ts` value for a visually consistent app shell — flag
  to the design owner if this should actually vary per pattern.
- **Bottom Navigation is now implemented** (`src/layout/BottomNav.tsx`),
  rendered by every layout except `ImmersiveLayout` (which keeps a
  logo-only header at every tier instead — no nav icons, by design, since
  it has no room for the nav rail). It activates only at the `sm` tier
  (`sidebarWidth === 0`, where
  `Sidebar` renders nothing) and shows the same 5 items as
  `src/layout/navItems.ts`/`SidebarNav.tsx` — icon-only, no labels. This was
  a fresh build, not sourced from the Figma "Bottom Navigation" frames
  (their activation condition still isn't confirmed) — re-verify against
  Figma/design review before treating its current icon-only phone layout as
  final.
- **Confirmed: `MediaQueryProvider` does NOT accept a custom-breakpoints
  prop** (checked against the real `@coinbase/cds-web@9.26.1` types — its
  only props are `children` and `defaultValues`, a one-time initial snapshot,
  not a breakpoint config). `useBreakpointTier.ts`'s plain `matchMedia`-based
  hook is therefore the correct approach here, not a placeholder pending
  verification.
- **`package.json` pins `@coinbase/cds-web` to `^9.26.1`** — a real,
  confirmed-installable version (verified by installing it and typechecking
  the template against it). `framer-motion` is declared too — CDS's own
  `peerDependencies` requires it (`^10.18.0`); omitting it works under npm
  (which auto-installs peers) but not under pnpm or yarn-classic.
- Color tokens are a provisional, first-pass mapping, not a final brand
  sign-off — see `../neon-theme/SKILL.md`'s known limitations and
  `../neon-theme/theme/color-overrides.ts`.
- **Two independent responsive-breakpoint systems run in parallel with no
  reconciliation.** CDS's own `ResponsiveProp` style values switch at
  `phone`/`tablet`/`desktop` (`0`/`768`/`1280`px — confirmed in
  `dts/styles/media.d.ts`); this app shell's Sidebar/Content/Inspector
  panes switch at Finnomena's own 7 tiers
  (320/500/988/1080/1272/1440/1920px, from `breakpoints.config.ts`). A
  component using a CDS `ResponsiveProp` (e.g.
  `padding={{tablet: 2, desktop: 4}}`) will change at a different width
  than the shell around it reflows. Whether these should be unified is a
  real design/architecture decision — not something to silently resolve one
  way. Flag it if a user reports inconsistent-feeling responsive behavior;
  don't invent an alignment between the two on your own.

## Roadmap context

Ask the maintainer for the project roadmap if asked about future phases —
it isn't shipped in this repo.

# Project inspection methodology

This is the **how** behind `neon-audit`'s step 1 ("Check quick signals... /
resolve the target"): how to gather evidence and fill in the shared
`NeonContext` record before recommending a tier. For the record's shape,
field meanings, tier terminology, and routing rules, see
`${CLAUDE_PLUGIN_ROOT}/skills/neon-audit/references/workflow-contract.md` —
this doc doesn't redefine `NeonContext`, it explains how to populate it
with real evidence for a real project.

## Guardrails

These are the acceptance bar for this step — hold to them every time:

- **Inspection is read-only.** Reading `package.json`, source files, config
  files, and running non-mutating shell commands (`ls`, `grep`, `cat`) is
  fine. Never edit, create, or delete a file while gathering evidence —
  writes only happen after a tier is confirmed and a downstream skill takes
  over.
- **Never recommend `neon-create` (Full CDS) for a non-React target.** CDS
  is a React component library — if `framework` is `'vue'`, `'svelte'`, or
  `'other'`, Full CDS isn't a real option, not even one to present and let
  the user reject. Route to `neon-redesign` and say why.
- **Don't re-ask an already-settled question.** If `NeonContext.brandConfirmed`
  is already `true` (per the contract's intent policy), don't ask the brand
  question again during inspection. If a prior turn already answered the
  scope/tier question, don't re-ask that either — inspection adds evidence,
  it doesn't reopen settled decisions.
- **Unknown evidence stays unknown** (per the contract). If you can't find
  supporting evidence for a field, record `'unknown'`/`null` and say so
  instead of guessing. This methodology is still what the audit's "Known
  limitations" calls **signal-level and best-effort** — a handful of
  targeted checks, not a full codebase scan. Don't imply more confidence
  than that.

## Exclude from every search

When inspecting a target project's files, always skip:

- `node_modules/`
- `dist/`, `build/`, `out/`
- `.next/`, `.nuxt/`, `.svelte-kit/` (framework build caches)
- `.git/`, `coverage/`, and any other generated/vendor directory

Searching these wastes time, produces false signals (a dependency's own
`package.json` inside `node_modules` isn't the target app's), and risks
picking up stale build output instead of current source. This applies to
grepping for styling patterns, hunting for a source entry, or anything
else below — always scope searches to source directories.

## What to inspect, and which `NeonContext` field it fills

Work through these in order. Stop early once a question is answered by
decisive evidence — this is meant to be a fast pass, not exhaustive.

### 1. Workspace root and target app → `projectRoot`, `targetPaths`

Before anything else, resolve *which* project you're inspecting:

- If the request names an app or path (e.g. "restyle `apps/portal`"), or
  the current working directory is already inside one app's source tree,
  use that — don't ask.
- Otherwise, check for monorepo signals at the current root: a
  `"workspaces"` field in `package.json`, a `pnpm-workspace.yaml`, or an
  `apps/`/`packages/` directory containing multiple app-shaped
  subdirectories (each with its own `package.json` and source entry).
- **If it's a monorepo and neither the request nor the working directory
  disambiguates the target app, ask the user which app before inspecting
  further.** Don't guess by picking the first app alphabetically or the
  biggest directory.
- **Never select the repository root just because it has a `package.json`.**
  A monorepo root's `package.json` is usually workspace tooling
  (`"private": true`, a `workspaces` array, maybe some shared lint/build
  scripts) — not an app with a framework, a source entry, or global
  styles. If the root's `package.json` has no framework dependency and no
  `src`/`app` entry of its own, it's not the target; keep looking inside
  the workspace.

### 2. Manifest evidence → `framework`, `packageManager`, `styling`, `verificationCommands`

Read the target app's `package.json` (not the workspace root's, unless
that root *is* the target):

- `dependencies`/`devDependencies` for `react`, `react-dom`, `vue`,
  `svelte`, `next`, `@coinbase/cds-web`, `tailwindcss`,
  `styled-components`, `@emotion/react`, etc. Presence is *evidence*, not
  proof of active use (a leftover devDependency isn't proof the app
  renders with it) — corroborate with the source entry (step 4) before
  committing to `framework`.
- The `"packageManager"` field, if declared — a standard npm/corepack
  convention, e.g. `"packageManager": "pnpm@9.0.0"`. This is a strong,
  explicit signal for `packageManager` when present; don't override it
  with a weaker signal.
- `"scripts"` — `build`, `typecheck`/`tsc`, `test`, `lint` and similar →
  candidates for `verificationCommands`. Record the ones that actually
  exist; don't invent a `typecheck` script if there isn't one.

### 3. Lockfiles → `packageManager`

Look for `package-lock.json`, `pnpm-lock.yaml`, `yarn.lock`, `bun.lockb` in
the target app directory (and the workspace root, for a monorepo — a
single lockfile usually lives there). One distinct lockfile is decent
corroborating evidence. **Conflicting lockfiles, or a declared
`packageManager` that disagrees with the lockfile present, is not decisive
evidence** — record what you saw and let the resolution/error handling
happen where the write actually occurs (installer-level, not this skill's
job — see Task 3's `project-config.mjs`); don't silently pick one here.

### 4. Source entry and rendering mode → `framework`, `rendering`

Find the app's real entry point (`src/main.tsx`, `src/index.tsx`,
`app/layout.tsx`, `pages/_app.tsx`, etc. depending on framework) and skim
it — this is what corroborates the manifest guess from step 2:

- Client-rendered SPA (Vite/CRA-style `src/main.tsx` calling
  `createRoot(...).render(<App />)`) → `rendering: 'client'`.
- Next.js-style app (`next` dependency, `app/` or `pages/` directory) →
  `rendering: 'ssr'`. See the **SSR section** below before recommending
  any provider integration here — this is the case the old signal-only
  audit gets wrong (see Worked examples).
- If neither is clearly evidenced, record `rendering: 'unknown'` rather
  than guessing.

### 5. Global styles and existing theming → `themeDir`, `styling`, `darkMode`

- Find the project's global stylesheet (`src/index.css`, `src/App.css`,
  `app/globals.css`, a Tailwind entry with `@tailwind` directives, etc.)
  and note where it's imported from.
- Check for a prior `neon-redesign`/`neon-create` run: does
  `src/theme/theme.css` (or similar) already exist? → the project is
  already on Colors or Colors+Typography; this is an upgrade decision (see
  `SKILL.md` step 3), not a from-scratch one.
- Look for the project's dark-mode mechanism: a `.dark`/`[data-theme]`
  class toggle, a `prefers-color-scheme` media query, a theme context/hook,
  or a UI toggle component. Record what you actually found in `darkMode`
  (e.g. `"class toggle: .dark on <html>, via useTheme() hook"`) — if you
  can't find one, record `"none found"` rather than assuming
  `prefers-color-scheme` is in play.

### 6. Shared/reusable component library → `styling`, `preserve`

Separate from CDS specifically (step 7 below): does the project already
have its own general-purpose component library, and does it need to
survive this change untouched? Look for:

- A component-library dependency in `package.json` — `@mui/material`,
  `antd`, `@chakra-ui/react`, `@headlessui/react`, `react-bootstrap`, and
  similar. Presence is evidence the app's buttons/inputs/dialogs/etc.
  already come from that library, not just ad-hoc markup.
- A homegrown shared-component directory — `src/components/`, `src/ui/`,
  or similar — containing reusable pieces (`Button.tsx`, `Card.tsx`,
  `Modal.tsx`) that other screens compose from, rather than one-off
  per-screen styling.

Record what you found in `styling` (e.g. `styling: ['mui', 'tailwind']`)
and add the library/shared-component directory to `preserve` — per the
plan's design decision that an existing app keeps its component library
unless the employee asks to change it. Concretely: theming a project that
already uses MUI (or a homegrown component set) should restyle *through*
that library's own theming surface (MUI's `ThemeProvider`/`createTheme`,
or the homegrown components' own CSS variables) rather than silently
introducing CDS as a second, parallel component system — unless the
employee has explicitly chosen `tier: 'cds'` and understands that means
adopting CDS's components going forward. If there's a real conflict (the
employee wants Full CDS but the app is heavily invested in another
component library), surface that as a decision for the user rather than
picking silently. If no shared library or component directory is found,
record that plainly (`styling` stays whatever else was found; no
`preserve` entry needed here) rather than assuming one exists.

### 7. Existing CDS provider tree → `targetPaths`, `preserve`

If `@coinbase/cds-web` is already a dependency (step 2), don't stop at
"it's installed" — look at the entry file/root component tree for an
existing `MediaQueryProvider` → `ThemeProvider` → `PortalProvider` wrap
(per `neon-create`'s required order). If one already exists:

- Record its location in `targetPaths` and add it to `preserve` — the
  handoff to `neon-create` must edit *that* existing wiring (the
  `createNeonTheme()` call, the theme object passed to `ThemeProvider`)
  rather than adding a second provider tree around an already-wrapped app.
  A duplicate `ThemeProvider`/`MediaQueryProvider`/`PortalProvider` nested
  inside an existing one is a real bug, not just redundant — CDS's
  responsive and theming behavior is keyed to that exact provider order
  and identity.

### 8. Routes, handlers, and data flow → `preserve`

Theming work must leave the app's actual behavior alone — restyling a
screen is not license to touch how it routes, fetches, or handles data.
`NeonContext` doesn't carry dedicated fields for these (there's no
`routes`/`dataFlow` field — don't invent one; per the contract, new fields
aren't this doc's call to make), so record what you find as `preserve`
entries: named things a downstream skill must leave untouched.

- **Routes.** Look for a router config: `react-router-dom` in
  `package.json` plus a `<Routes>`/`createBrowserRouter(...)` call (often
  in `src/routes.tsx`, `src/App.tsx`, or a `src/routes/` directory);
  Next.js's own routing via the `app/` or `pages/` directory structure
  itself; `vue-router` config for a Vue app; or similar. Note the file(s)
  that own routing and add them to `preserve` (e.g. `"src/routes.tsx —
  route table, do not modify"`).
- **Handlers and data flow.** Look for API route handlers (Next.js
  `app/api/**/route.ts`, an Express/Fastify routes directory, a tRPC
  router) and the app's data-fetching layer (React Query/SWR hooks, a
  Redux/Zustand/Context store, an Apollo/GraphQL client setup, or a plain
  `fetch`/`axios` service layer). These are almost never in scope for a
  theming request — note their location briefly (e.g. `"src/api/ and
  src/hooks/useQuery* — data layer, do not modify"`) so an implementation
  skill recognizes them and stays out, rather than needing to rediscover
  that boundary mid-edit.
- If a project has no distinguishable routing (a true single-screen app)
  or no separate data layer worth naming, say so plainly instead of
  inventing structure that isn't there — this is evidence for "nothing to
  preserve here," not a gap to fill with a guess.
- This inspection is about *locating and preserving* these, not
  evaluating or auditing them — don't review routing/data-fetching code
  quality here, that's out of scope for a theming audit.

### 9. Representative requested screens → `targetPaths`, `preserve`

Look at the specific screen(s)/component(s) the request actually names
(e.g. "just the header" → the header component and whatever renders it),
not the whole app. This is also where you check for a **scope conflict** —
see the next section.

## Server-rendered (Next-style) React — inspect before recommending providers

Before recommending any CDS provider integration for an SSR React app,
inspect:

- **Client/server component boundaries.** In Next.js App Router, a
  component is server-rendered by default; CDS's providers are client-side
  React context and must live inside a component marked `"use client"`.
  Check whether a client boundary component already exists (e.g. an
  `app/providers.tsx` with `"use client"` at the top, imported into
  `app/layout.tsx`) or whether one needs to be introduced. Don't assume
  `app/layout.tsx` itself can hold the providers directly unless it's
  already a client component (rare, and usually wrong for a root layout).
- **Where a global style import is legal.** In Next.js App Router, a
  global CSS import (e.g. `theme.css`, `globals.css`) is only legal from
  the root layout (`app/layout.tsx`) — importing global CSS from a nested
  or client component throws a build error. Locate the actual legal import
  site before telling `neon-create`/`neon-redesign` where to add the
  import; don't default to "wherever the request happens to touch."

Record what you found (client boundary component path, or its absence;
global-CSS-legal file path) in `targetPaths`/`preserve` so the
implementation skill doesn't have to re-derive it — and doesn't guess
wrong and hit a build error mid-implementation.

## Partial scope — local vs. shared/global tokens

When the request targets part of the UI (e.g. "just the header," "just
this dashboard card"), check whether the styles/tokens involved are:

- **Local** to that scope — a component-scoped class, a CSS module, inline
  styles, or a styled-components definition that only that component
  uses, or
- **Shared/global** — root-level CSS custom properties, a Tailwind
  `theme.extend` config, or a token the rest of the app also references.

If satisfying the request as scoped would require touching a shared/global
token (e.g. the header's color comes from `--color-primary` defined at
`:root` and consumed by a dozen other components), **that's a scope
conflict — surface it to the user and propose a local override** (a
scoped class, a CSS-module override, a wrapper with its own token
overrides) instead of silently widening the change to redefine the global
token. Record the conflict and the proposed local-override approach in
`preserve`/`targetPaths` so the implementation skill (`neon-redesign`,
per its own scoped-restyling rules) doesn't re-litigate it or widen scope
on its own.

## Worked examples

Five baseline scenarios, each showing the evidence gathered, the
`NeonContext` fields it resolves, the recommendation, and — where the
*current* `neon-audit` prose (before this doc existed) would have gotten
it wrong or left it unhandled.

### 1. React/Tailwind app (client-rendered)

**Evidence:** `package.json` has `react`, `react-dom`, `tailwindcss`
(dev), a `tailwind.config.ts`; no `@coinbase/cds-web`; `src/main.tsx`
calls `createRoot(...).render(<App />)`; `src/index.css` has `@tailwind`
directives; a `package-lock.json` present, no `packageManager` field
declared.

**Resolves:** `framework: 'react'`, `rendering: 'client'`,
`packageManager: 'npm'` (from lockfile — not decisive-strength since no
declared field, but only one lockfile present so no conflict),
`styling: ['tailwind']`, `darkMode: 'none found'`.

**Recommendation:** Tailwind is already a full styling system in place —
reasoning favors Colors+Typography (`visual-system`) via CSS variables
over introducing CDS's separate component library alongside Tailwind.
Present this reasoning and ask per `SKILL.md` step 4 unless the request
already states a tier.

**Old assumption this corrects:** none, specifically — this is the case
the old "quick signals" step already handled reasonably. It's included as
the baseline control case.

### 2. Vue app

**Evidence:** `package.json` has `vue`, `vite`, `@vitejs/plugin-vue`; no
`react`; `.vue` single-file components; `src/main.ts` calls
`createApp(App).mount('#app')`.

**Resolves:** `framework: 'vue'`.

**Recommendation:** Route straight to `neon-redesign`. Full CDS is never
offered as one of the tier options in step 4 for this project — not
presented and rejected, just absent, since it's structurally
incompatible (CDS is React-only).

**Old assumption this corrects:** the pre-existing `SKILL.md` never
checked `framework` at all before step 4's three-option question — it
would have presented "Full CDS" as a live option to a Vue project and
only relied on the user noticing it doesn't apply. Detecting `framework`
during inspection and gating the option list on it is what this task
adds.

### 3. Existing CDS app

**Evidence:** `@coinbase/cds-web` is a real `dependencies` entry (not just
transitively present); `src/app/AppRoot.tsx` already wraps
`<MediaQueryProvider><ThemeProvider theme={...}><PortalProvider>...` around
the app.

**Resolves:** `framework: 'react'`, existing provider tree located at
`src/app/AppRoot.tsx` → recorded in `targetPaths` and `preserve`.

**Recommendation:** One-line confirmation (per `SKILL.md` step 2), route
to `neon-create`. Because the provider tree already exists,
`neon-create`'s work here is to edit the existing `ThemeProvider`'s `theme`
prop (swap in `createNeonTheme()`) — not add a second
`MediaQueryProvider`/`ThemeProvider`/`PortalProvider` wrap around the
already-wrapped app.

**Old assumption this corrects:** the old step 2 said "if `cds-web`
already installed, skip the question and hand off to `neon-create`" with
no instruction to look for an existing provider tree first. Combined with
`neon-create`'s own instructions (which describe wiring `ThemeProvider`
"from scratch," at module scope, in an entry file) this was one bad
handoff away from wrapping a duplicate provider tree around a working app.
Inspecting for and preserving the existing wrap is the fix.

### 4. Next-style SSR app

**Evidence:** `next` in `dependencies`; `app/layout.tsx` exists (App
Router); no existing `"use client"` providers file; `app/globals.css`
imported once, from `app/layout.tsx`.

**Resolves:** `framework: 'react'`, `rendering: 'ssr'`. No existing client
boundary component for providers — one needs to be introduced. Legal
global-style import site: `app/layout.tsx` only.

**Recommendation:** If routing to `neon-create` (Full CDS), hand off with
`targetPaths` pointing at `app/layout.tsx` and instructions to introduce a
`"use client"` providers component (e.g. `app/providers.tsx`) that holds
`MediaQueryProvider`/`ThemeProvider`/`PortalProvider`, imported into the
server `app/layout.tsx`. Global theme CSS imports go in `app/layout.tsx`
(or a file it imports), never in a nested client component.

**Old assumption this corrects:** neither the old `SKILL.md` nor the
contract said anything about SSR beyond having the `rendering` field exist
— nothing instructed checking for client/server boundaries or legal CSS
import locations before recommending provider integration. A
naive "wire `ThemeProvider` in your root component" recommendation would
either violate the client-component boundary (context providers used
directly in a server component) or the global-CSS-only-in-root-layout
constraint, and only surface as a build error during implementation
instead of being caught during inspection.

### 5. Monorepo with two apps

**Evidence:** repo root `package.json` has `"private": true` and
`"workspaces": ["apps/*"]`, no framework dependency, no `src/`; `apps/admin`
and `apps/portal` each have their own `package.json` (one React, one
Vue), source entry, and lockfile evidence pointing at a shared root
`pnpm-lock.yaml`.

**Resolves:** depends on the request. "Restyle `apps/portal` with
Finnomena branding" → `projectRoot` resolves to `apps/portal` directly,
no question asked. A bare "restyle this with Finnomena branding" run from
the repo root with no other signal → ask which app first.

**Old assumption this corrects:** the old flow implicitly treated "the
target project" as singular and had no rule against defaulting to
whichever `package.json` was closest/first found — which for a monorepo
root is usually workspace tooling, not an app (no framework dependency,
no source entry of its own). This task adds the explicit rule: resolve
from the request or cwd first, ask only if genuinely ambiguous, and never
settle for the root just because a `package.json` is there.

## Handing off

Once evidence is gathered and `NeonContext` is populated (framework,
rendering, packageManager, styling, darkMode, themeDir, targetPaths,
preserve, verificationCommands — `'unknown'`/`null` where genuinely
unresolved), return to `SKILL.md`'s remaining steps (decisive-signal
shortcut, upgrade framing, the tier question, or hand-off) — this doc's
job ends at "evidence gathered," it doesn't re-decide the tier or the
handoff itself. Follow the contract's routing rules and intent policy for
what happens next; don't re-ask brand confirmation or a scope question
this pass already resolved.

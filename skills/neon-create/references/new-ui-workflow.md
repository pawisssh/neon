# Building new UI: scaffolding a project vs. adding a screen

`neon-create`'s `SKILL.md` steps 0–9 cover how to wire Finnomena's theme
correctly (installer, `createNeonTheme()`, provider order, tokens, layout
picking, fonts). This doc covers the part that comes *after* that's
wired: what "done" means for the UI the employee actually asked for, for
both of `neon-create`'s branches — a brand-new project
(`operation: 'new-project'`) and a screen added to an app that already
exists (`operation: 'new-screen'`). See
`${CLAUDE_PLUGIN_ROOT}/skills/neon-audit/references/workflow-contract.md`
for what these `NeonContext` fields mean and how routing decides between
them.

## 1. Template boundary: non-React requests

The shipped starter (`starters/vitejs-cds/`) is Vite + React + TypeScript.
Use it whenever the request doesn't name a different framework — React is
the default, not an assumption to double-check every time.

If the employee's request **explicitly** names a different framework (Vue,
Svelte, Angular, plain HTML, etc.), don't silently substitute React and
hand them a React app anyway. State the template boundary plainly: the
shipped starter can't scaffold that framework directly, so the path is to
scaffold with that framework's own normal tooling (`npm create vue@latest`,
the SvelteKit CLI, etc.) and then adapt Finnomena's theme assets into it by
hand — `theme.config.ts`/`color-overrides.ts`/`theme.css` are framework-
agnostic data, but `createTheme.ts` and any CDS component usage are
React-specific and won't port. Per
`workflow-contract.md`'s routing rules, a non-React `framework` also can't
take `tier: 'cds'` — route to
`${CLAUDE_PLUGIN_ROOT}/skills/neon-redesign` for the colors/typography
layer instead of trying to force CDS onto a non-React scaffold.

## 2. New-project vs. new-screen: what to preserve

These are different jobs, not the same job at two scales:

- **New project** (`operation: 'new-project'`) — there's nothing to
  preserve. Run the installer's `--new` branch, get a fresh
  `starters/vitejs-cds/` copy, wire it up per `SKILL.md`.
- **New screen** (`operation: 'new-screen'`) — an app already exists.
  Reuse its existing routes/router, layout/shell components, and any
  already-configured providers (routing, state, auth context,
  `ThemeProvider` if CDS is already wired — see `workflow-contract.md`'s
  existing-CDS routing rule). Add only the requested screen. If the
  request also asks to restyle shared elements (a header, a nav), keep
  that within the agreed scope — don't widen it to a global retheme on
  your own, the same discipline `neon-redesign` applies to partial
  restyles.

**Never scaffold over an existing app to fulfill an add-screen request.**
Creating a new screen inside an existing app is a distinct job from
scaffolding a new project — running the installer's `--new` branch, or
otherwise replacing/restructuring the existing app to "make room" for one
new screen, is the specific failure mode this rule exists to prevent. See
Baseline 2 in the worked examples below.

## 3. Build the requested content — don't stop at the scaffold

The starter's own `App.tsx` ships intentionally empty —
`<div>Content</div>` and `<div>Inspector — start building here</div>` —
because it's a starting point, not a deliverable. Scaffolding (or adding a
screen) and then reporting done at that point under-delivers: the employee
asked for a dashboard, a login screen, a feature — not an empty shell with
the right theme on it.

After scaffolding/adding the screen, build the actual requested feature:
real, populated content (mock data is fine — it should be shaped like the
real thing, not a placeholder string), and the loading/empty/error/
disabled/success states the specific interaction actually needs (a list
view needs loading/empty/error; a form needs loading/error/success; don't
mechanically add every state to every screen regardless of whether it
applies).

## 4. Do not fabricate auth or backend persistence

Build genuinely interactive UI — real client-side validation, real
loading/error/success states, real keyboard and focus behavior. That's
required, not optional, per §3. What's forbidden is *pretending* that
interactive UI is backed by a real server that doesn't exist:

- A login screen's submit handler must not silently behave as if it
  authenticated against a real backend when there is none.
- Either make the mock obvious in the UI itself (visible copy like "Demo
  only — not connected to a real account" near the form, or in an inline
  note) or tell the employee explicitly that real authentication needs to
  be wired to an actual backend separately. A code comment alone
  (`// mock auth`) is not sufficient on its own if the rendered UI gives no
  indication to someone just using the app.
- This is about honesty in what ships, not a reason to under-build the
  UI — the form still needs real validation and real interactive states,
  it just can't misrepresent what it's connected to.

## 5. Layout selection

`SKILL.md` step 8 has the authoritative 5-pattern table
(`AppShell`/`ContentLayout`/`SimpleLayout`/`MultiColumnLayout`/
`ImmersiveLayout`) — don't duplicate it here. The rule that matters for
this task: **pick based on what the specific task needs, don't default to
`AppShell` because it's what `App.tsx` boots into out of the box.** This
is a **new-project-only** rule, matching `SKILL.md` step 8's own scoping
("New-project branch only — pick the right layout") — the 5 patterns
ship as part of the starter copy, and the existing-project installer
branch (`SKILL.md` step 2) copies only the 4 theme files, never
provider wiring or component code. Introducing this layout system into
an app that doesn't already have it has no supported procedure in this
skill today — porting `layoutPanes.ts`, `breakpoints.config.ts`, and the
layout components themselves into an arbitrary existing app is a bigger
structural change than a new-screen request. If a new-screen request
seems to call for one of these 5 patterns and the app doesn't already
have them, flag that to the employee as out of scope rather than
attempting it — reuse whatever layout/shell the app already has instead
(per §2 above).

Configure the `navigation` prop from destinations that actually exist for
this app/request — not left empty as a placeholder, and not populated with
invented links. Pass `finnomenaEcosystemNav` only when the employee is
explicitly opting into linking out to Finnomena's own ecosystem.

## 6. Fonts and dark mode

Full procedure lives in
`${CLAUDE_PLUGIN_ROOT}/skills/neon-audit/references/theme-integration.md`
(§1 fonts, §2 dark mode) — reused here by reference, not restated. How it
applies to each branch:

- **New project:** the starter's `main.tsx` already loads IBM Plex Sans
  Thai — nothing to set up at scaffold time. As you build the requested
  content (this doc's §3), apply `theme-integration.md` §1's "load only
  the weights actually in use" rule to whatever type roles the new
  content introduces.
- **New screen:** inspect how the existing app already loads fonts and
  integrate into that mechanism per `theme-integration.md` §1 — never
  bolt on a second, different font-loading path alongside whatever it
  already does.
- **Both branches, dark mode:** follow `theme-integration.md` §2 — find
  and preserve the app's (or, for a brand-new app, the starter's)
  existing source of truth for dark/light; never introduce a second,
  competing mechanism for the new screen.

## 7. Verification and delivery

Full procedure — build/typecheck first, viewport inspection, interaction
checks, and the required delivery format — lives in
`${CLAUDE_PLUGIN_ROOT}/skills/neon-redesign/references/verification.md`'s
"For new-UI creation" section (the shared verification doc both
`neon-create` and `neon-redesign` use). Read it before claiming a
scaffold or new screen is done — it is not restated here.

## Worked examples

Two baseline prompts, worked through concretely — calibration fixtures for
this task, not an automated test suite.

### Baseline 1 (new project): "Start a Finnomena approval dashboard"

`operation: 'new-project'`. Run the installer's `--new` branch, get the
themed starter copy.

**Wrong outcome:** report the scaffold as done — theme wired, a layout
picked, `App.tsx` still showing `<div>Content</div>` — and tell the
employee to run `npm run dev` to "see their dashboard." This is exactly
the under-delivery §3 exists to prevent: nothing about approvals was
actually built.

**Right outcome:** pick a layout matching the task — an approval workflow
needs to show a list of items *and* a detail/action view for whichever one
is selected, so `AppShell` (Sidebar + Content + Inspector,
inspector-weighted) or `ContentLayout` fits better than `SimpleLayout`.
Configure real navigation (e.g. "Pending", "History"). Then build the
actual feature: a list of pending approval requests with realistic shaped
mock data (requester, description/amount, submitted date, status), a
detail panel for the selected item with Approve/Reject actions, a loading
state while the list "loads," an empty state ("No approvals pending"), and
success/error feedback after acting on an item. Verify per §7 that this
renders as real, populated content — not placeholder text.

### Baseline 2 (new screen): "Add a Finnomena login screen to this app"

`operation: 'new-screen'` — an existing app, not an empty target
directory.

**Wrong outcome:** treat this like a new-project request — run the
installer's `--new` branch, or otherwise restructure/replace parts of the
existing app to fit the login screen in. Per §2's rule: never scaffold
over an existing app to fulfill an add-screen request.

**Right outcome:** reuse the existing app's router (add one new
route/page), reuse its existing layout/shell, and preserve whatever
providers are already wired (theme, any auth context, state management).
Add only the login screen: email/password fields with real client-side
validation (required fields, email format, minimum password length) and
real loading/error/success states on submit. Since there's no real backend
for this request, follow §4: the submit handler is an obvious mock (e.g. a
visible note near the form indicating this is a demo, or a comment plus an
explicit callout to the employee that real auth needs separate backend
wiring) — not a form that quietly behaves as if it authenticated for real.

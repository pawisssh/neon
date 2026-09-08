# Theme integration: fonts, dark mode, upgrades, and installer conflicts

Shared by `neon-create` and `neon-redesign` — the procedures below apply
whenever either skill actually wires Finnomena's theme into a real app,
not just copies files. `neon-audit`'s
`${CLAUDE_PLUGIN_ROOT}/skills/neon-audit/references/project-inspection.md`
already covers *discovering* the project's existing font/dark-mode
mechanisms (its steps 5–7 populate `darkMode`/`styling`/`targetPaths`);
this doc covers what to *do* with that evidence once `tier` and
`operation` are settled and implementation starts.

## 1. Font loading (`tier: 'visual-system'` or `'cds'` only)

**`tier: 'colors'` never touches font loading — no `<link>`, no
`@font-face`, no `@fontsource` import, nothing.** Colors-only means
exactly that; if the affected UI isn't already loading a Thai-capable
font, it keeps rendering in its existing fallback stack.

At `tier: 'visual-system'` or `'cds'`, before adding anything:

1. **Inspect how the target app currently loads fonts.** Check the entry
   file / root layout / global stylesheet for one of:
   - A `<link>` to Google Fonts (or another web-font CDN).
   - A self-hosted `@font-face` block or an `@fontsource`-style package
     import.
   - A framework font loader (e.g. Next.js's `next/font/google` or
     `next/font/local`).
   - Nothing — the app currently ships no extra web font at all.
2. **Prefer that same mechanism** for adding IBM Plex Sans Thai rather
   than introducing a second, different one. An app already on
   `next/font` should get IBM Plex Sans Thai via `next/font`, not a
   hand-rolled `<link>` tag alongside it; an app with no font loading at
   all is free to pick either a CDN `<link>` or a self-hosted package —
   prefer self-hosting for a production app, a CDN link is fine for a
   quick prototype (see
   `${CLAUDE_PLUGIN_ROOT}/theme/finnomena/examples/app-entry.tsx` for both
   forms side by side).
3. **Support local/self-hosted font files as an alternative to a CDN
   link.** Some target apps can't or won't load from Google Fonts
   (offline builds, strict CSP, internal-only deployment). `@fontsource/
   ibm-plex-sans-thai` (or manually vendored `.woff2` files behind
   `@font-face`) covers this — don't insist on the CDN link as the only
   option.
4. **Load only the weights the affected UI actually uses.** This repo's
   own type scale (`${CLAUDE_PLUGIN_ROOT}/theme/finnomena/theme.config.ts`'s
   `fontWeight` export, corroborated by `theme.css`'s `--fontWeight-*`
   variables) uses four distinct weights across all roles: `400` (most
   text roles — body, title1–3, display1/2, legal, label2), `500`
   (headline), `600` (label1, caption), `700` (display3 only). Don't
   blindly request all four for every change — a screen that only ever
   renders `body`/`headline` text needs `400` and `500`, not all four. If
   you can't tell which roles are in play, `400;500;600;700` (the set the
   starter's own `main.tsx` and `app-entry.tsx` request) is the safe
   default, not an invented value.
5. **Verify with Thai *and* Latin sample text — this is the one step that
   actually catches a broken font load.** A font can report as "loaded"
   by family name while still falling back to a system font for Thai
   glyphs specifically, if the wrong file/subset was loaded (e.g. a Latin-
   only subset, or a stale cached version). Two checks, both required:
   - **Computed style.** Inspect `getComputedStyle(el).fontFamily` (or the
     equivalent in devtools) on an element actually using the Finnomena
     type scale, and confirm it resolves to `'IBM Plex Sans Thai'` — not
     just that no error was thrown.
   - **Visual render of real Thai text.** Render actual Thai-script sample
     text (not a placeholder or lorem ipsum) in the affected UI and
     visually confirm it renders in IBM Plex Sans Thai's actual glyph
     shapes, not a fallback Thai typeface substituted by the OS/browser —
     the two can look similar enough at a glance that only checking Latin
     text ("Aa Bb") misses a Thai-specific fallback entirely.

## 2. Dark mode: preserve the existing source of truth

Before wiring `ThemeProvider`'s `activeColorScheme` (CDS) or adjusting
`theme.css`'s dark-mode selectors (CSS-only), find out how the target app
**already** controls dark/light — `project-inspection.md` step 5 should
already have recorded this in `NeonContext.darkMode`; if it's missing or
this is a direct invocation, check now:

- **An explicit toggle** — a settings switch, a stored preference (e.g.
  `localStorage`), a class/attribute (`.dark`, `[data-theme="dark"]`) that
  a React context, hook, or state variable controls.
- **OS-only** — the app has no toggle of its own and just follows
  `prefers-color-scheme: dark`.
- **Nothing** — the app is single-scheme, no dark mode at all.

**If the app has its own explicit toggle, CDS's `ThemeProvider`
`activeColorScheme` prop must read from that same state** — derive it
from the existing hook/context/stored preference, don't introduce a
second, independent mechanism that could disagree with the app's own.
For `theme.css`, match its dark-mode selector to the app's actual
mechanism (its class/attribute name), not the shipped default — see
`theme.css`'s header for the selectors to adapt.

**If the app has no explicit toggle and just follows OS preference,
that's fine to preserve as-is** — don't invent a toggle that didn't exist
before.

**The failure mode this prevents:** an app where the user explicitly
chose "light" (overriding their OS's own dark preference) suddenly
rendering dark because CDS's own default, or a mismatched selector,
ignored that explicit choice. Preserving the *existing* source of truth —
whatever it is — is the whole rule; never let CDS's or `theme.css`'s
defaults silently override it.

## 3. Upgrading Colors+Typography → Full CDS: an integration check, not a promise

`theme.css`'s variable *names* are byte-identical to what real CDS's
`ThemeProvider` emits (`var(--color-fg)`, `var(--fontWeight-headline)`,
etc. — verified, see `theme.css`'s header). **That is not, by itself, a
guarantee that existing `var(--color-fg)` markup keeps working unchanged
after adopting `neon-create`.** Identical variable *names* don't
guarantee identical variable *scope*, *cascade order*, or *theme-state
ownership* — check all three before removing the old `theme.css` import:

- **Scope.** `theme.css` defines its variables on `:root` (document-wide).
  CDS's `ThemeProvider` may inject its CSS custom properties at a
  different DOM node — e.g. scoped to a wrapper `<div>` rather than the
  document root. If it does, anything rendered *outside* that wrapper
  (see **Portals** below) won't inherit CDS's variables even though the
  variable names match.
- **Cascade.** During a migration, the old static `theme.css` and CDS's
  runtime-injected variables can both be present in the DOM at once —
  load order and specificity decide which one a given element actually
  sees, not just "the names match so it doesn't matter." Inspect which
  declaration order actually applies before assuming the CDS value wins
  (or that the old value harmlessly falls away).
- **Portals.** CDS's `PortalProvider` renders overlays (modals, tooltips,
  dropdowns) outside the normal DOM tree, often appended near
  `document.body` rather than inside the app's root wrapper. If
  `ThemeProvider` scopes its variables to a wrapper node rather than
  `:root`, portaled content can end up outside that scope and lose access
  to the theme variables entirely — confirm a portaled component (open a
  modal or tooltip) still renders themed, not unstyled/default.
- **Theme-state ownership.** See §2 above — who controls dark/light must
  be explicitly reconciled between the old `theme.css` selectors and
  CDS's `activeColorScheme`, not assumed to already agree.

**The check, concretely:** inspect variable scope (where does
`ThemeProvider` actually inject its custom properties — `:root` or a
descendant node?), inspect cascade/load order (is `theme.css` still
imported after CDS mounts, or before?), inspect portal behavior (does a
portaled overlay render themed?), and inspect theme-state ownership (does
toggling dark/light produce the same result via both mechanisms?).
**Verify both light and dark render correctly** before removing the old
`theme.css` import or declarations — don't remove it based on matching
variable names alone.

## 4. Installer conflict: `install.mjs` already refuses to overwrite a customized file

`copyThemeFiles` in
`${CLAUDE_PLUGIN_ROOT}/theme/finnomena/scripts/install.mjs` validates
every source/destination pair *before* copying any of them: if a
destination theme file's content differs from the source about to be
copied, it throws `Refusing to overwrite customized file: <path>` and
exits nonzero without touching anything. This is existing, tested
behavior — nothing here adds new code for it. What's missing is what
*you* (the agent) do when you hit that error:

1. **Diff the incoming theme file against the existing customized one.**
   Read both — the repo's source file (`${CLAUDE_PLUGIN_ROOT}/theme/
   finnomena/<file>`) and the target's customized destination — and
   identify exactly what changed on each side.
2. **Merge the legitimate incoming changes with normal file edits.** Apply
   the parts of the incoming update that are genuinely new (a fixed
   token value, a new export) into the customized file directly, the same
   way you'd resolve any other manual merge — don't blindly overwrite the
   destination with the source, and don't delete the customized file to
   force a clean re-run of the installer (that discards whatever the
   target project customized it for).
3. **Retain the user's custom selectors/tokens.** If the destination file
   has project-specific additions (an extra color token, an adapted
   dark-mode selector), keep them — the merge target is "incoming update
   applied on top of the customization," not "incoming file wins."
4. **Ask one precise question only if there's a genuine irreconcilable
   conflict** — e.g. the incoming file changed the *same* token the
   customization also changed, to a different value, and it's not obvious
   which should win. Show the actual conflicting values when asking; don't
   ask a vague "is it OK to update this file?" when the merge is actually
   unambiguous.
5. **Never bypass the safeguard** — no `--force` flag exists and none
   should be invented; don't hand-edit `install.mjs` to skip the check
   just to get a script to complete.

## 5. Non-atomic multi-file writes: preflighted conflicts are safe, disk errors mid-copy aren't

`copyThemeFiles` validates all files in a batch *before* writing any of
them — a **known** conflict (a customized destination file, §4 above) is
always caught pre-write, so a run that fails on that check leaves the
target directory completely untouched. That preflight does not extend to
**unknown** failures during the copy itself: if an I/O error (e.g. disk
full) happens after 2 of 4 files have already been written, there's no
automatic rollback — the target is left with a partially-updated
`src/theme/` directory.

**If `install.mjs` ever exits with an error *after* it has started
reporting progress** (as opposed to failing the upfront preflight check),
don't just blindly re-run it. First check which of the four theme files
(`theme.config.ts`, `color-overrides.ts`, `createTheme.ts`,
`breakpoints.config.ts`, or just `theme.css` for `--css-only`) actually
landed in the target directory, then decide whether to finish the copy
manually or re-run — a naive re-run after a partial failure can now hit
the preflight's "already-identical, skip" path for the files that did
land and only attempt the ones that didn't, which is fine, but don't
assume that without checking first.

## Worked examples

Three baseline scenarios, worked through concretely — calibration
fixtures, not an automated test suite.

### Case 1: Missing brand font in visual-system mode

A target app is being upgraded from Colors-only to Colors+Typography
(`tier: 'visual-system'`). It's a Vite/React app with no prior web-font
loading at all — `index.html` has no font `<link>`, and there's no
`@font-face` anywhere in the source. The employee wants the brand's
typography (fonts, sizes, weights) applied to the dashboard.

- **Inspect:** no existing font-loading mechanism found — the app is
  currently rendering everything in the browser's default sans-serif
  fallback.
- **Decide:** since there's no existing mechanism to match, either a CDN
  `<link>` or a self-hosted `@fontsource` import is acceptable; prefer
  self-hosting since this is a real app, not a prototype.
- **Load only what's needed:** the dashboard uses `title2`, `body`, and
  `label1` text roles per the type scale → weights `400` (title2, body)
  and `600` (label1) are the ones that matter; request `400` and `600`
  from `@fontsource/ibm-plex-sans-thai` rather than all four.
- **Verify:** `getComputedStyle` on the dashboard's heading and body text
  resolves to `'IBM Plex Sans Thai'`; render a dashboard string containing
  real Thai sample text (not the English-only mock content the dashboard
  ships with by default) and visually confirm Thai glyphs render in the
  correct typeface, not a system fallback.

### Case 2: Existing `.dark` selector

A target app already has dark mode: a `useTheme()` hook backed by
`localStorage`, toggled by a settings switch, that adds/removes a `.dark`
class on `<html>`. The employee wants Full CDS (`tier: 'cds'`).

- **Inspect:** `darkMode` evidence from `project-inspection.md`'s step 5
  already recorded `"class toggle: .dark on <html>, via useTheme() hook"`.
- **Wire it correctly:** `ThemeProvider`'s `activeColorScheme` prop is
  derived from the same `useTheme()` hook's current value
  (`isDark ? 'dark' : 'light'`), not a separate `prefers-color-scheme`
  check and not a hardcoded `"light"`. The existing `.dark` class toggle
  keeps controlling any non-CDS styling that still depends on it during
  migration.
- **What NOT to do:** don't default `activeColorScheme` to
  `useMediaQuery('(prefers-color-scheme: dark)')` — if the user's OS is
  set to dark but they explicitly chose "light" via the app's own switch
  (stored in `localStorage`), that default would render CDS content dark
  while the rest of the app (still on the `.dark` class) stays light — an
  immediate, visible disagreement.
- **Verify:** toggle the app's own switch to both light and dark and
  confirm CDS-rendered content follows it correctly both ways, not just
  the state it happened to load in.

### Case 3: Customized theme file rejected by the installer

Running `node install.mjs <target-dir>` (existing-project, full CDS)
against a target that already has `src/theme/color-overrides.ts` from an
earlier `neon-redesign`/`neon-create` run — but a developer since added a
project-specific accent color to it — fails with:

```
Error: Refusing to overwrite customized file: <target-dir>/src/theme/color-overrides.ts
```

This is real, current `install.mjs` behavior (§4 above) — the preflight
validation caught that the destination differs from the source about to
be copied, and exited before writing *anything* (the other three theme
files weren't touched either, since the preflight runs across the whole
batch first).

- **What to do:** read the repo's current `color-overrides.ts` and the
  target's customized version side by side. Suppose the repo's version
  fixed a wrong hex value for `accentBoldBlue` and the target's
  customization added an unrelated `accentTeamOrange` entry the repo
  doesn't have. Both changes are legitimate and don't conflict — apply
  the corrected `accentBoldBlue` value into the target's file with a
  normal edit, keep `accentTeamOrange` as-is, then re-run the installer
  (now a no-op for this file, since the content matches) to pick up the
  other three theme files.
- **What NOT to do:** don't delete `color-overrides.ts` and re-run to
  force a clean copy (destroys `accentTeamOrange`), and don't hand-edit
  `install.mjs` to skip the check.
- **If it were a real conflict** — e.g. the repo's update changed
  `accentBoldBlue` to a new value *and* the target's customization also
  changed `accentBoldBlue` to a different value for a stated reason — ask
  one precise question showing both values ("the incoming update sets
  `accentBoldBlue` to `#1817e7`; your project's customization sets it to
  `#2244aa` — which should win?") rather than guessing.

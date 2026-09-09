# Verifying UI changes were actually checked

A general checklist for confirming a UI change actually works, not just
that files were edited or copied. Any neon skill that finishes a UI change
follows this — it isn't specific to restyling. Where a step needs
restyling-specific detail, that's called out under **For restyling
specifically**; everything else applies equally to a new-UI-creation
workflow (e.g. `neon-create` scaffolding a new screen) or any other
UI-producing task.

## Why this exists

Editing a file, or copying a theme file into place, is not verification.
"I updated `Button.tsx`" and "I confirmed `Button.tsx` renders correctly
and still works" are different claims — only the second is something you
can responsibly report as done. The gap between them is exactly the
gap this checklist closes.

## The core checklist

Run all four before claiming a UI change is complete:

1. **Render the affected screens.** Actually view the UI the change
   touches — run the dev server and load the page/component, or use
   whatever preview mechanism the project has (Storybook, a test
   renderer with a snapshot you inspect, a screenshot tool). Don't infer
   correctness from reading the diff alone; CSS and markup changes
   routinely look right in a diff and render wrong.
2. **Compare before/after.** Know what the screen looked like before the
   change (a baseline render, a description, or a prior screenshot) and
   what it looks like after. A change with no visible difference from
   baseline when one was expected is a signal something didn't take
   effect (wrong specificity, unimported stylesheet, stale build cache,
   wrong file edited) — investigate rather than reporting success.
3. **Check interaction outcomes, not just appearance.** Click the
   button, submit the form, open the modal, trigger the state that was
   supposedly preserved or added. A visual change can silently break a
   click handler, a form validator, keyboard navigation, or a
   loading/error state — appearance-only verification misses all of
   these. Where a `NeonContext.verificationCommands` list exists (build/
   typecheck/test commands discovered for the project), run it — a
   passing build doesn't substitute for checking the rendered UI, but a
   failing one means don't claim done regardless of how the UI looks.
4. **Report what was actually inspected, not what was assumed.** State
   plainly which files/screens were rendered and checked versus which
   were edited but not individually re-verified (e.g. "verified the
   button renders correctly on the dashboard and settings pages;
   the same shared component also appears on 12 other routes not
   individually checked"). Do not claim a whole-codebase or
   whole-app verification when only representative screens were
   actually inspected — say what scope was covered.

## For restyling specifically

When this checklist is applied to a `neon-redesign` restyle (see
`${CLAUDE_PLUGIN_ROOT}/skills/neon-redesign/references/style-migration.md`
for the full migration procedure this feeds into):

- **Rendered styles**, concretely: confirm the new Finnomena tokens are
  actually applied (computed background/text/border colors match the
  mapped role, not just "a change happened somewhere") and that the
  overall visual identity reads as branded per
  `${CLAUDE_PLUGIN_ROOT}/design-md/finnomena/DESIGN.md`.
- **Unchanged behavior**, concretely: existing handlers, form validation,
  navigation, data calls, loading states, and accessibility semantics
  (focus order, ARIA roles/labels, contrast) must be unchanged from
  before the restyle — a restyle is a visual-layer change only, and
  regressing any of these is a failure even if the colors look right.
- **Scope boundaries respected**: for a partial restyle (e.g. "just the
  header"), explicitly re-render an unrelated screen/component that was
  out of scope and confirm it is pixel-for-pixel/token-for-token
  unchanged — this is the concrete check behind "don't widen scope to
  global tokens on your own" from
  `${CLAUDE_PLUGIN_ROOT}/skills/neon-audit/references/workflow-contract.md`'s
  `preserve` field.
- **Before/after list required**: produce one list of shared
  components/tokens actually changed and one list of known exceptions
  (values intentionally left hardcoded — e.g. arbitrary chart series
  colors — or files touched but not individually re-verified). This is
  the artifact that makes the "report what was actually inspected" rule
  above concrete for a restyle, and satisfies
  `style-migration.md` step 5.
- **Acceptance bar**: a restyle is done when (a) the branding change is
  visibly present on the in-scope screens, (b) form/route/interaction
  behavior is unchanged, and (c) any unrelated screen in a partial-scope
  request is confirmed unchanged. All three, not just the first.

## For new-UI creation (e.g. a new screen or component)

When this checklist is applied to newly created UI rather than a
restyle: "before" is the absence of the screen/component, and "after" is
its first working render. The same four core steps apply — render it,
confirm it looks like what was specified (brand tokens, layout, content),
exercise its interactions (form submission, navigation, empty/loading/
error states), and report exactly what was rendered and checked versus
assumed. There is no "unrelated screen must stay unchanged" check here
the way there is for a partial restyle, since nothing existing was
touched — but if the new UI was wired into existing navigation or shared
layout, confirm that integration point still works for the screens that
already used it. Used by both a `neon-create` new-project scaffold and a
new-screen addition to an existing app — the procedure below doesn't
distinguish between them; the difference is only in what "the affected
UI" refers to (a whole fresh app vs. one added screen plus its
integration points).

### Verification procedure, concretely

Run all of these before claiming a new screen or scaffold is complete:

1. **Build/typecheck first.** Run `NeonContext.verificationCommands` (or
   the project's normal build/typecheck/test commands if that list wasn't
   populated) before anything else — this needs no browser and catches a
   large class of problems for free. A failing build means stop here;
   don't proceed to visual inspection to "see how close it is."
2. **Launch and inspect the rendered UI**, not just the diff. Confirm it
   renders at **375px** (mobile) and **1440px** (desktop) — the two
   viewport widths any layout in `src/layout/` is expected to handle —
   plus whatever transition is specific to the layout pattern in use
   (e.g. `AppShell`/`ContentLayout`/`MultiColumnLayout` collapsing their
   sidebar into `BottomNav` at the mobile breakpoint; confirm that
   transition actually happens, not just that both fixed widths look
   fine in isolation).
3. **Exercise keyboard navigation and the primary interaction.** Tab
   through the new UI's interactive elements in a sane order, confirm
   focus is visible, and actually perform the screen's main action (submit
   the form, select the list item, open the dialog) rather than only
   checking that the elements are present.
4. **Check Thai text wrapping.** Render real Thai-script sample text (not
   English placeholder copy) in the new UI's text-bearing elements and
   confirm it wraps/truncates sensibly at both viewport widths — Thai
   script has no word-space characters, so wrapping behavior that looks
   fine for English content routinely breaks for Thai.
5. **Check dialogs/portals.** If the new UI opens a modal, tooltip, or
   dropdown, confirm it actually renders themed (not unstyled/default) —
   see
   `${CLAUDE_PLUGIN_ROOT}/skills/neon-audit/references/theme-integration.md`
   §3's portal-scope check for why this can silently fail even when
   everything else looks right.
6. **Confirm font loading**, not just that no error was thrown — see
   `theme-integration.md` §1's computed-style + visual-Thai-render check.
7. **Check the console for errors/warnings** introduced by the new UI —
   a screen can render acceptably while still throwing on mount, on the
   primary interaction, or on unmount.

**How to actually do the rendering step:** run it yourself first, don't
default straight to asking the employee. Use whatever browser/UI
inspection tooling is available in the current session (e.g. Claude
Code's browser tools) to launch the app and inspect it at the widths
above. Fall back to "ask the employee to confirm in their own browser"
only when this session genuinely has no way to render or inspect the UI
itself — that's a fallback/handoff step for when local inspection isn't
possible, not the default verification strategy. (This replaces the
older guidance to tell the employee to run `npm run dev` and confirm the
app boots as the primary check — that's still a reasonable last step to
mention, just not a substitute for Claude checking its own work first.)

### Delivery format

Report, in this order:

1. **Changed scope** — which screens/files were added or touched (new
   project: the whole scaffold; new screen: the added route/component
   plus any integration points).
2. **Verification actually run** — which of the 7 checks above were
   performed, on which screens/viewports, and their results. Don't claim
   a check happened if it was skipped (e.g. no browser tool was
   available, so viewport inspection was asked of the employee instead —
   say so explicitly).
3. **Explicit remaining limitations** — anything not verified (untested
   viewport sizes, browsers, or interaction paths), any demo/mock
   behavior shipped per
   `${CLAUDE_PLUGIN_ROOT}/skills/neon-create/references/new-ui-workflow.md`
   §4 (no fabricated auth/backend), and anything the employee still needs
   to confirm themselves.

### Acceptance bar

New UI is done when: (a) build/typecheck passes, (b) it renders correctly
at both required viewports plus its layout-specific transition, (c)
keyboard navigation and the primary interaction work, and (d) the delivery
report above was actually produced — not just "it's done, run `npm run
dev`."

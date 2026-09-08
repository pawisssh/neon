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
already used it.

# Flow refactor evaluation protocol

This protocol evaluates the September 2026 flow refactor. Generated apps and raw evidence belong under `.local/evals/flow-refactor/`, not in distributed skills.

## Comparable inputs

Baseline revision: `8fb3349f91c70fbee73b5439b35d0b6914bee934`. The complete baseline plugin was frozen before skill edits. Revised workers use a separately packaged snapshot. Each sample uses a fresh copy of the same fixture and shared, unchanged installed dependencies. Independent workers inherit the same parent model/reasoning settings; temperature/seed are not exposed by this harness and are not claimed controlled.

Run three independent samples per variant for each request below. Workers receive only their variant's skill package, fixture, request and reporting instructions; they do not receive expected results or the browser harness. Record references actually read and commands actually run. Do not infer runtime improvements from document length.

## Paired app requests

**Existing React/CDS feature**

> Add a Finnomena status filter to this existing request list. Offer All, Pending, Approved, Rejected; combine it with existing search, show an empty message when nothing matches, preserve services, providers, theme, routes and detail behavior. Keep Thai/English text usable on mobile and desktop.

**Vue header restyle**

> Change only this header to Finnomena colors in existing light/dark modes. Preserve fonts, spacing, geometry, body/status colors, framework, routes and handlers. No CDS adoption.

## Additional composition request

> Reorganize this Finnomena Vue request overview. On mobile, place Team notes and its existing controls before the request list; on desktop, keep notes and requests in two columns. Make reading and keyboard order coherent. Keep the existing theme, framework, navigation, handlers, service data and note/guidelines state. Do not add product behavior.

## Independent outcome checks

React: build/typecheck; all four status options and combined search; no-match message; existing details/navigation; keyboard access; no overflow at 375/1440; protected service/provider/theme files unchanged. Inspect the new control's actual CDS import and theme use.

Vue colors: build; header colors change to traceable semantic roles in both modes; same header geometry/fonts and unrelated body/status styles at the same width/state; existing navigation, note counter, disclosure and mode toggle still work.

Vue composition: build; notes precede requests visually and in reading/focus order on narrow screens; desktop columns remain; existing handlers/service/theme unchanged; counters/disclosures/navigation survive relevant interactions. Geometry change inside the named scope is expected.

For all runs record source hashes, diffs, build output, screenshots, browser errors, tested widths/modes/states, questions and setup actions. Missing/failed checks remain missing/failed, not a pass inferred from another sample.

## Routing coverage

In addition to these actual app runs, use document-driven routing scenarios for new React app, colorful immersive page, explicit composition scope, screenshot-only review, established-brand follow-up, generic CDS without Finnomena context, ambiguous monorepo target and customized-file conflict. Reports must label simulated decisions separately from executed actions.

## Acceptance

All revised app samples must satisfy applicable task, scope and interaction checks; every routing scenario must preserve its stated boundaries. Fully specified reuse cases should ask no unnecessary questions and perform no installer/setup changes. Reference reading should be task-relevant. Baseline parity is acceptable where baseline already succeeds; do not invent an improvement claim when measurements show only parity. Representative app checks do not certify every future screen, full accessibility, Thai glyph provenance or formal design approval.

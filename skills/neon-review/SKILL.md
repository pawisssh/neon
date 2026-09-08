---
name: neon-review
description: Use when reviewing existing Finnomena or neon UI for brand consistency, responsive behavior, accessibility, or interaction states, including screenshots and source-only reviews with limited evidence. Applies to explicit neon-review requests and established branding context; use neon-audit for integration or theming-depth decisions.
---

# Neon UI Review

Produce actionable findings about the requested UI, with evidence and coverage limits. This is a read-only review phase, not a theme installer or a general backend/security audit. Review any framework; CDS adoption is not a prerequisite.

## Scope and evidence

1. Reuse the requested target and established brand intent; do not repeat settled questions. Identify the page/component and requested dimensions. Colors-only excludes typography/spacing changes. A header-only review stays within the header and directly affected behavior. Ask only if the missing target prevents useful inspection.
2. Read the relevant sections of [Finnomena design guidance](../../design-md/finnomena/DESIGN.md). For disputed CDS color mappings, inspect [color-overrides.ts](../../theme/finnomena/color-overrides.ts). Resolve paths from this loaded skill's real directory, not the working directory. If references are unavailable, report that limitation; do not invent brand rules. The mapping is provisional: distinguish documented mismatches from design judgment.
3. Record the evidence available: live UI, screenshots, source, or supplied test results. A screenshot establishes only the visible state; source establishes implementation details. Neither alone proves runtime behavior. Use [review-checks.md](references/review-checks.md) for checks relevant to the selected dimensions and evidence.

## Inspect

Use available read-only browser, DOM, screenshot, and source tools. Inspect the supplied URL or existing local preview first. Starting a local preview is appropriate only after inspecting its command for side effects. Do not install dependencies, alter app configuration, edit application files, or run unknown lifecycle scripts to enable a review. If runtime access is blocked, complete the supported static review and list unavailable checks.

Exercise navigation, focus, and reversible UI states where safe. Do not submit, approve, purchase, delete, send messages, or change real records to test a live interface. Use an explicitly disposable test environment for such actions, within the user's authorization; otherwise mark them untested. Save evidence artifacts only when useful, within an authorized output location, and avoid exposing sensitive screen content.

Verify suspected defects against available evidence before reporting them. Attribute supplied findings and source locations to their report; do not claim independent reproduction or line verification. For your own findings, cite an observed UI location or an inspected source line; never infer file lines from screenshots. Record viewport/theme/state for visual findings. Do not manufacture issues, compliance claims, numerical scores, or measurements from appearance alone.

## Deliver

Follow the user's requested format; otherwise return:

- **Coverage:** target, evidence mode, viewports/themes/states actually inspected.
- **Findings:** severity, location, observed evidence, user impact, suggested fix, and a concrete recheck. Order by impact; group repeated instances with a shared cause.
- **Unverified:** relevant checks unavailable or deliberately not exercised.

Use High for a blocked primary task or inaccessible essential control, Medium for a meaningful usability/brand defect, and Low for a minor inconsistency. Explain the impact rather than escalating by category alone. If none are supported, say “No actionable findings in the inspected scope”; this is not certification of the entire app. When no inspectable UI or source was supplied, state that evidence is insufficient instead of implying a clean review.

Stop after a review-only request. If fixes are already authorized, finish the findings first, then continue the authorized work carrying scope and evidence forward. Use neon-redesign for restyling and neon-create for new UI/CDS integration; a small behavior or accessibility fix follows the app's normal repair workflow without installing a theme. Honor any explicit findings-approval gate; never require a new approval solely because this skill was used.

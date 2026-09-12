# Feature implementation

Read for complex feature states or integration into an existing app. New-project mechanics live in [scaffold](scaffold.md); theme changes live in [CDS integration](cds-integration.md).

## Existing app integration

Find the relevant screen/component, service contract and route. Reuse existing shell, providers, state and authentication. Inspect only missing evidence. A new-screen request does not authorize scaffolding over the app or replacing its layout system. Follow explicit composition scope for existing UI.

Use real CDS components where available; inspect installed exports/types rather than guessing component names or props. Choose [task-based composition](../../INSTRUCTION.md#task-based-choices). Existing wrapper components can preserve local conventions and behavior.

## States and services

Build populated content and real interactions. For lists, handle loading, empty/no-match and error/retry where relevant; for submissions, handle validation, pending/duplicate prevention, failure and completion. Retain entered data after recoverable errors. Use the existing data service and validation contract; do not invent a password rule or backend endpoint because it seems customary.

Mock data is appropriate for a requested demo. Make its status visible in the demo and report missing integration. A code comment alone does not prevent the user believing a simulated approval/login persisted. Do not fabricate authentication or server persistence.

## Responsive task access

Make the task reachable in narrow and wide layouts. A detail panel can move behind a selection with a clear return path; hiding it must not remove essential actions. Use actual destinations for navigation, and preserve the app's reading and keyboard order. Do not add external ecosystem links unless requested.

For the starter's Detailed Layout default, preserve its frame-confirmed visibility contract: SM shows Inspector only, MD shows the Sidebar rail plus Inspector, and LG upward shows Sidebar, Content, and Inspector. Do not add a mobile bottom bar merely because the Sidebar is hidden at SM. In a list-to-detail product flow, put the return or pane-switch action in the narrow Inspector UI and verify it with keyboard and touch input.

## Verification

Use the [shared checklist](../../neon-redesign/references/verification.md#shared-checklist) and [creation additions](../../neon-redesign/references/verification.md#creation-additions). For explicitly adapted existing composition, apply the composition additions too. A copied template or a source-only inspection is not completion.

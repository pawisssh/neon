---
name: neon-create
description: Use when building Finnomena or neon features, screens, components, or new React apps with Coinbase Design System. Applies to established Finnomena branding context and explicit invocation. For CSS-only restyling use neon-redesign; for uncertain integration in an existing app use neon-audit.
---

# Build Finnomena features with CDS

Deliver the requested feature using real `@coinbase/cds-web` components, Finnomena tokens, and the right visual mode: functional screens use restrained navy/white with indigo interaction highlights; immersive pages may use colorful Finnomena surfaces and illustrations. Uber informs composition; CDS supplies implementation.

## Find the resources

Resolve this skill's real directory (follow symlinks). The Neon root is two directories above it and contains `theme/`, `templates/`, `design/`, and `scripts/`. In these documents, `${CLAUDE_PLUGIN_ROOT}` means that resolved root when the host does not supply it. Never resolve it from the employee app's working directory. If sibling assets are missing, identify the incomplete installation before running setup.

## Work from the task

1. Read [workflow-contract.md](../neon-audit/references/workflow-contract.md) for scope, existing project evidence and routing. Reuse established branding intent. New apps default to React/CDS; an existing app keeps its framework, providers, routes and customized theme.
2. Read [the design contract](../../design/FINNOMENA.md) before making visual decisions. Identify the audience, main task, primary action and relevant states. Infer routine choices from the brief; ask only for missing information that materially changes the result. Keep this short direction in conversation, not a new file in the employee app.
3. Choose **new project**, **new screen/component**, or **theme integration**. For installation or changes to providers/tokens, read [cds-integration.md](references/cds-integration.md). Reuse an already working installation. Never scaffold over an existing app or overwrite customized theme files.
4. For feature implementation, read [new-ui-workflow.md](references/new-ui-workflow.md). Reuse the app's components and service contracts. Choose CDS components from official tooling if available, otherwise inspect installed exports and prop types. Do not guess imports or emulate available CDS controls with generic HTML merely for styling convenience.
5. Build the requested content and interactions. Use semantic tokens with real CDS keys. Preserve the app's theme-mode source of truth; use a stable `createNeonTheme()` result and the documented provider setup. Component-specific changes belong in supported component configuration or scoped wrappers, not global token hacks.
6. Run the app's relevant build/typecheck and behavior checks. Inspect narrow/wide layouts, long Thai/English text, keyboard focus and relevant states when a preview is available. Follow [verification.md](../neon-redesign/references/verification.md) for delivery and evidence limits. A copied starter alone is not completion.

Report what was built, where to view it, checks actually performed and material limitations. Distinguish provisional token mappings, mock services and unverified runtime checks from confirmed behavior.

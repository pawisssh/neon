---
name: neon
description: Control Finnomena UI guidance with “neon” or “neon off”, and route feature, styling and review requests to the matching Neon workflow. Applies to Finnomena UI requests and relevant follow-ups; explicit deactivation blocks automatic reuse until explicitly reactivated. Incidental mentions and unrelated tasks do not activate it.
---

# Neon

## Purpose

Build Finnomena interfaces around the user's task, established visual guidance and existing app patterns. This skill controls conversational guidance and selects a workflow; it does not enable or disable the installed plugin.

## Activation and persistence

- Read commands as user intent, not substrings in quoted text, filenames or examples. Handle “neon off”, “stop neon” and “deactivate neon” before considering activation.
- Standalone “neon”, “activate neon”, or explicit invocation of any Neon skill activates the mode. A Finnomena UI request or established Finnomena project intent also activates guidance unless the user has explicitly turned it off in this conversation.
- While active, retain guidance for relevant UI follow-ups without repeated branding questions. Unrelated tasks receive no Neon guidance and do not reset the mode.
- Deactivation stops automatic Neon guidance. A later ordinary Finnomena mention or brand request does not clear that choice: continue the user's task normally without automatically loading Neon workflows. Explicit activation or direct invocation of a Neon skill reactivates it. An explicit off instruction in the same request takes precedence.
- Activation or deactivation alone gets a brief acknowledgment, with no app edits, installation, scaffolding or audit. Deactivation never reverts work, removes dependencies or discards the app's existing brand requirements.
- Keep the mode in working conversation context only, including any conversation summary. Do not write state files or promise persistence across new conversations. A host loading a skill automatically is not a user explicitly invoking it.

## Decision ladder

1. Understand the requested task and inspect only the evidence needed to carry it out.
2. Reuse working components, theme, shell, providers, routes and services.
3. Select the matching workflow below; an audit is not a required first step.
4. Load only that workflow and its task-relevant references. Stop investigating when the approach is clear.
5. Implement within the requested scope, or report findings for review-only work.
6. Verify the affected behavior and appearance using the selected workflow; report unavailable checks.

## Workflow routing

| Request | Workflow |
| --- | --- |
| New React app, React/CDS feature, or explicit CDS adoption | [neon-create](../neon-create/SKILL.md) |
| CSS styling, colors-only changes, or requested presentation redesign | [neon-redesign](../neon-redesign/SKILL.md) |
| UI or screenshot review | [neon-review](../neon-review/SKILL.md) |
| Unresolved target or theme integration choice | [neon-audit](../neon-audit/SKILL.md) |

Non-React functionality uses the app's normal framework workflow, with neon-redesign for requested styling. Read the [shared workflow contract](../neon-audit/references/workflow-contract.md) only when scope or routing needs clarification. Resolve package resources two levels above this skill's real directory, not from the target app.

## Boundaries

Preserve explicit scope and existing infrastructure. Colors-only stays colors-only; composition is preserved unless change is requested; review-only stays read-only. Styling depth and composition remain separate choices, with no intensity levels. Activation does not authorize unrelated edits, deployment or replacement of the app.

Do not simplify away requested behavior, accessibility, relevant loading/error states or verification. Use the existing [design contract](../INSTRUCTION.md) for visual decisions through the selected workflow; preserve the provisional status of token mappings rather than duplicating or inventing design policy here.

## Done

Briefly report the result, what was verified and material limitations. Provide detailed explanations when requested. Mode-only commands need only an acknowledgment.

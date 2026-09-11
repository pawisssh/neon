# Build a reviewed example library

Keep a small set of real, inspectable examples: functional list/detail, a functional form or table, and an immersive landing page. Evaluation fixtures test workflows; they are not automatically visual exemplars.

## Start with illustrative examples

Use synthetic content and distributable assets. Keep the runnable source plus desktop/mobile screenshots at recorded widths and states. Each example should describe the user's task, why its composition fits, what expresses Finnomena, what can vary by task, and what was actually verified. Do not label an example approved simply because it builds or an AI prefers it.

## Review by property

Ask the team's designated design reviewer to record the decision, date, source revision and approved properties. Composition, typography, color mapping and interaction behavior can have different approval states. A pending color mapping does not become approved because the layout was accepted.

Use this compact record alongside each candidate:

```yaml
status: illustrative
source_revision: <actual revision>
reviewer: null
reviewed_on: null
approved_properties: []
viewports: [375, 1440]
```

Below it, link the runnable source, screenshots with viewport/theme/state, rationale, allowed variation, verification results and unresolved issues. Replace the example placeholders with evidence before treating the record as complete. For partial approval, use `status: partially-reviewed` and list the actual approved properties; `reviewed` means the stated review scope is complete, not universal certification.

## Use examples in skills

Link only the example relevant to the task, after its review status and resource packaging are settled. Use it as a composition/reference aid, not a mandatory template for every page. Keep canonical token values in `theme/` and visual policy in `design/FINNOMENA.md`. When an example and current policy disagree, identify the stale property and update/review it instead of silently creating a second authority.

No approved examples are introduced by the flow refactor. Current prose examples are illustrative; locally generated evaluation apps are behavioral evidence only.

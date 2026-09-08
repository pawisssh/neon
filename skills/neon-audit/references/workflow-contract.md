# Neon workflow contract

Shared by all three skills — `neon-audit`, `neon-create`, `neon-redesign`.
Read this before beginning work in any of them. It defines the one handoff
record the skills pass between each other, the routing rules that decide
which skill handles a request, and the single intent policy all three
follow (so it's stated once here, not restated three slightly-different
ways in each `SKILL.md`).

## NeonContext

The shared handoff record. Keep it in working conversation context — it is
**not** a file written into the employee's app.

```ts
type NeonContext = {
  brandConfirmed: boolean;
  operation: 'new-project' | 'new-screen' | 'restyle';
  projectRoot: string;
  targetPaths: string[];
  tier: 'colors' | 'visual-system' | 'cds';
  framework: 'react' | 'vue' | 'svelte' | 'other' | 'unknown';
  rendering: 'client' | 'ssr' | 'unknown';
  packageManager: 'npm' | 'pnpm' | 'yarn' | 'bun' | null;
  themeDir: string;
  styling: string[];
  darkMode: string;
  preserve: string[];
  verificationCommands: string[];
};
```

**Unknown evidence stays unknown.** Don't guess `framework`, `rendering`,
`packageManager`, or any other field when there's no supporting evidence —
record `'unknown'` (or `null` for `packageManager`) instead. The presence
of a file or dependency is *evidence* toward a value, not proof a feature
is actually used (e.g. a `vue` devDependency alongside an unused template
isn't proof the app renders with Vue) — if the evidence is thin or
conflicting, say so and ask rather than filling in a guess.

### Field notes

- `tier` — see **Tier terminology** below; this is the field the three
  skills' own docs used to call "colors only / colors + typography / full
  CDS."
- `operation` — which of the three employee journeys this is. Determines
  routing (below) together with `tier`.
- `preserve` — things explicitly out of scope for this change (routes,
  handlers, data flow, an existing dark-mode mechanism, etc.) that must
  survive untouched. Carry this forward so a downstream skill doesn't
  widen scope on its own.
- `verificationCommands` — build/typecheck/test commands discovered for
  this project, so the skill doing the work knows what to run before
  claiming completion.

## Tier terminology

The three skills' own prose predates this contract and still says "colors
only / colors + typography / full CDS" in places — that's the same thing
as `NeonContext.tier`, reconciled here:

| `tier` value | Also known as (skill prose) | What it means |
| --- | --- | --- |
| `'colors'` | "Colors only" | Brand colors via CSS variables. No CDS. |
| `'visual-system'` | "Colors + typography", "colors + typography/spacing/radius" | Colors plus brand fonts, spacing, and radius via CSS variables. No CDS. |
| `'cds'` | "Full CDS" | Install `@coinbase/cds-web`, wire `ThemeProvider`, build with real CDS components. |

Use `tier` (`'colors'` / `'visual-system'` / `'cds'`) when recording or
passing along a `NeonContext`; the "colors only" / "colors + typography" /
"full CDS" phrasing is fine in user-facing conversation, but don't invent
a fourth term for any of these three.

## Routing rules

- **`operation: 'new-project'`** — always `${CLAUDE_PLUGIN_ROOT}/skills/neon-create`
  (its scaffold branch). `neon-audit` doesn't apply — there's no existing
  project to inspect — so redirect straight to `neon-create` instead of
  running an audit.
- **`operation: 'new-screen'` or `'restyle'`** (an existing project) —
  `neon-audit` is the normal entry point: it inspects the project, decides
  or confirms `tier`, then hands off by `tier`:
  - `tier: 'colors'` or `'visual-system'` → `${CLAUDE_PLUGIN_ROOT}/skills/neon-redesign`.
  - `tier: 'cds'` → `${CLAUDE_PLUGIN_ROOT}/skills/neon-create` (its
    existing-project branch).
- Any skill may be invoked directly, skipping `neon-audit`, when the
  employee's request already makes `tier` and `operation` unambiguous
  (e.g. "just the colors" → `neon-redesign`; "start a new Finnomena app" →
  `neon-create`). Direct invocation still follows the intent and handoff
  rules below — it doesn't get a separate policy.
- A non-React target (`framework` is `'vue'`, `'svelte'`, or `'other'`)
  cannot take `tier: 'cds'` — route to `neon-redesign` regardless of what
  tier would otherwise be recommended, and say why.

## Intent policy — carry-forward, not repeat

> Use explicit or previously confirmed Finnomena branding intent. Carry
> that decision across handoffs. Ask only when brand intent or requested
> scope is missing.

Concretely:

- `brandConfirmed` becomes `true` the moment Finnomena/neon branding
  intent is established — either the employee's request states it
  explicitly (mentions "Finnomena" or "neon", per each skill's own
  activation guard), or they've already confirmed it earlier in the
  *current* conversation, including in a different neon skill.
- Once `true`, every neon skill treats it as settled for the rest of the
  conversation. Handing off from `neon-audit` to `neon-create` or
  `neon-redesign` (or between them) carries `brandConfirmed` forward —
  none of them re-asks "do you want Finnomena branding?" on a handoff.
- Ask a brand-intent question only when `brandConfirmed` is genuinely
  unset for this conversation — i.e. nothing in the conversation so far
  established it.
- Independently, ask about **scope** (`tier`, `operation`, `targetPaths`)
  only when it's actually missing or ambiguous from the request and
  project signals — a confirmed brand doesn't imply a confirmed scope,
  and vice versa. Don't conflate the two questions into one, and don't
  re-ask a scope question that a prior turn already answered.

## Verification before claiming done

Whichever skill does the implementation work is responsible for actually
running `verificationCommands` (build/typecheck/tests) and checking the
affected UI, not just copying theme files — see that skill's own
completion guidance. This contract only carries the record; it doesn't
replace each skill's own verification steps.

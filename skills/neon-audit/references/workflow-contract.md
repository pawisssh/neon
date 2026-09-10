# Neon workflow contract

Shared by the three implementation-routing skills — `neon-audit`, `neon-create`, `neon-redesign`.
Read this before beginning work in any of them. It defines the one handoff
record the skills pass between each other, the routing rules that decide
which skill handles a request, and the single intent policy all three
follow (so it's stated once here, not restated three slightly-different
ways in each `SKILL.md`). For *how* to gather the evidence that fills in
`NeonContext` for a real project — what to inspect, what to exclude, and
stack-specific judgment calls (monorepos, SSR, existing CDS, partial
scope) — see
`${CLAUDE_PLUGIN_ROOT}/skills/neon-audit/references/project-inspection.md`;
this doc stays the shape and the rules, that one stays the method.

## Resource resolution and visual decisions

Resolve `${CLAUDE_PLUGIN_ROOT}` from the loaded skill's real directory when unavailable; sibling assets must come from the same complete Neon checkout/package. Branding can be established by explicit request, prior conversation, explicit Neon invocation, or project instructions naming Finnomena. An unrelated generic CDS request does not establish branding.

Read `design/FINNOMENA.md` before visual decisions. Preserve the main task, primary action, chosen composition and relevant states across handoffs; no separate design file is required. Colors-only work does not reopen composition, typography or layout.

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
  handlers, data flow, an existing dark-mode mechanism, an already-wired
  CDS provider tree, etc.) that must survive untouched. Also where a
  detected local-vs-shared/global scope conflict on a partial-screen
  request gets recorded (see `project-inspection.md`'s scope-conflict
  section) so a downstream skill proposes a local override instead of
  widening scope to global tokens on its own. Carry this forward so a
  downstream skill doesn't widen scope on its own.
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

- **UI review requests** route to **neon-review**, which has its own read-only
  evidence/report workflow. Review is not a theming tier or a `NeonContext`
  implementation operation; do not force it through tier selection. Carry
  known target/scope and established intent into review without restarting
  onboarding. Review-only requests end with findings; explicit authorized
  fixes may continue afterward, subject to any user-specified approval gate.


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
- An existing CDS app (`@coinbase/cds-web` already a dependency) still
  routes to `neon-create` — but if a provider tree
  (`MediaQueryProvider`/`ThemeProvider`/`PortalProvider`) is already
  wired, the integration must edit that existing wiring, not wrap a second
  provider tree around it. `neon-audit` inspects for this before handoff;
  see `project-inspection.md`'s existing-CDS section.

## Intent policy — carry-forward, not repeat

> Use explicit or previously confirmed Finnomena branding intent. Carry
> that decision across handoffs. Ask only when brand intent or requested
> scope is missing.

Concretely:

- `brandConfirmed` becomes `true` the moment Finnomena/neon branding
  intent is established — either the employee's request states it
  explicitly (mentions "Finnomena" or "neon", or explicitly invokes a Neon skill), or they've already confirmed it earlier in the
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

## Preparation contract

Inspect the target manifest, lockfile, app entry, and existing theme/provider usage. Reuse an active installation. Compare required React/CDS APIs and versions before changing dependencies; a major-version mismatch is a migration decision.

Apply explicit user scope before dependency signals. A colors-only request stays CSS-only even when CDS appears in package.json.

## Completion contract

After scaffolding, implement the employee's requested UI in the generated project. A copied starter is not completion. Use existing data/services where present; local mock data is appropriate for a mockup request.

Reuse relevant loading/empty/disabled/validation-state guidance. Do not invent backend authentication or persistence to make a UI demo appear functional.

Require actual build and browser checks when available. Inspect narrow/wide layouts, long Thai/English labels, keyboard focus, primary interactions, and relevant collapsing regions. Check existing/requested color schemes; do not add dark mode simply to satisfy testing instructions.

## Verification before claiming done

Whichever skill does the implementation work is responsible for actually
running `verificationCommands` (build/typecheck/tests) and checking the
affected UI, not just copying theme files — see that skill's own
completion guidance. This contract only carries the record; it doesn't
replace each skill's own verification steps.

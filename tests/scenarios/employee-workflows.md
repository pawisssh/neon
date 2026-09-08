# Employee UI workflow scenarios — Task 8 validation record

Validates the plan's 14-row scenario table
(`.superpowers/sdd/2026-09-09-employee-ui-workflows/task-8-brief.md`)
against Tasks 1–7's implementation as committed. See
`../../docs/employee-workflow-validation.md` for the full release-readiness
report this table feeds into — this file is the row-by-row record only.

**Method key**, per row, stated explicitly (never blended):

- **Real fixture** — a disposable scratch project was built and the real
  script (`install.mjs`, `npm`) was actually invoked as a subprocess;
  outcome is observed file/process state, not predicted.
- **Desk-check** — no scratch project was run for this row. The governing
  `SKILL.md`/reference-doc prose was read and traced step-by-step against
  the exact prompt to determine what an agent following it verbatim would
  do. This is weaker evidence than a real fixture — it validates that the
  *instructions* are unambiguous and point to the required result, not
  that a live agent run actually produced it.

All scratch fixtures were built under this session's scratchpad
(`/private/tmp/.../scratchpad/task8/`), never inside the repo working tree.

---

## 1. New project — "Start a Finnomena approval dashboard"

**Required result:** Requested UI beyond the shell; working local navigation; build and render checked.

**Method:** Hybrid — real fixture for scaffold/install/build/render machinery; desk-check for the "requested UI beyond the shell" content requirement (no live agent conversation was run to actually build an approval dashboard).

**Setup:** `git archive HEAD` clean checkout → `node theme/finnomena/scripts/install.mjs <scratch>/new-project-fixture --new` → `npm install` → `npm run build` → `npx vite preview --port 4173` → `curl`.

**Result:**
- Scaffold: real `install.mjs --new` copied `starters/vitejs-cds/` into the scratch dir, exit 0.
- Install: real `npm install`, 238 packages, exit 0.
- Build: real `npm run build` (`tsc --noEmit && vite build`), exit 0, produced `dist/` with hashed JS/CSS/font assets.
- Render (partial): `vite preview` served the built `dist/` at `http://localhost:4173/` — HTTP 200, `<title>Finnomena App</title>`, exactly one `<div id="root">` present, `<script type="module">`/`<link rel="stylesheet">` correctly reference the hashed build assets. This confirms the **static shell serves correctly**. It does **not** confirm client-side JS actually mounted content into `#root` — this session's Chrome browser automation tool reported "Browser extension is not connected," so no headless/real-browser DOM check was possible here. Treat render as "build output serves and is well-formed," not "confirmed interactive render."
- Working local navigation: cited via existing coverage, not re-run for this task — `node tests/run-starter-navigation.mjs`, 12/12 passing (reconfirmed at current HEAD `de6941b`). These are `react-dom/server`-based **static-markup** tests (hrefs, `aria-current`, target/rel on `Sidebar`/`BottomNav`) — real component code, but no jsdom/browser, so they don't exercise click-driven navigation interactively.
- "Requested UI beyond the shell" (desk-check): `skills/neon-create/references/new-ui-workflow.md` §3 states plainly the starter's `App.tsx` ships intentionally empty and that stopping there "under-delivers." §7/Baseline 1 gives this exact prompt ("Start a Finnomena approval dashboard") as a worked example, spelling out the wrong outcome (report the scaffold as done) vs. right outcome (build a real pending-approvals list + detail/action panel with loading/empty/success/error states). The instruction is unambiguous and directly on-point for this prompt.

**Pass/fail:** PASS with limitations — the installer/build/scaffold machinery is verified end-to-end with real commands; the "build actual requested content" and "confirmed interactive render" halves of the required result rest on unambiguous skill prose and a partial (non-interactive) render check, respectively, not a live agent run.

**Versions recorded:** node v26.7.0, npm 11.19.0, `@coinbase/cds-web@9.26.1`, `react@18.3.1`, `react-dom@18.3.1`, `vite@5.4.21`, `typescript@5.9.3`.

---

## 2. New screen — "Add a Finnomena login screen to this React app"

**Required result:** Existing stack/routes retained; no replacement scaffold.

**Method:** Desk-check.

**Governing text:** `skills/neon-create/references/new-ui-workflow.md` §2: "**Never scaffold over an existing app to fulfill an add-screen request.** ... running the installer's `--new` branch, or otherwise replacing/restructuring the existing app to 'make room' for one new screen, is the specific failure mode this rule exists to prevent." Baseline 2 in the same doc is this exact prompt verbatim, contrasting the wrong outcome (run `--new`) against the right one: "reuse the existing app's router (add one new route/page), reuse its existing layout/shell, and preserve whatever providers are already wired." `SKILL.md` step 2 also only runs the installer's existing-project branch (theme files only, "It never touches provider wiring or component code") unless `--new` is explicitly invoked, and step 1 requires confirming new-vs-existing before running anything.

**Pass/fail:** PASS — the instruction is explicit, names this exact prompt as a worked example, and the installer itself structurally can't scaffold-over (existing-project branch never touches routes/components).

---

## 3. Full restyle — "Restyle this Tailwind app to Finnomena"

**Required result:** Existing semantic variables/components adapted; form behavior preserved.

**Method:** Desk-check.

**Governing text:** `skills/neon-redesign/references/style-migration.md` Example 4 (Tailwind v4 login form) is close to this exact scenario shape — walks through mapping `bg-brand`→Navy Ink, `focus:border-brand`→Indigo Interactive (a *different* role from the source's collapsed single token), `text-red-600`→Negative red, and explicitly calls out that `disabled:opacity-50 disabled:cursor-not-allowed` is untouched (state utility, not a color). The verify step is explicit: "confirm the submit button is still disabled until both fields pass validation; fill in valid values and confirm submit still calls `onLogin` and the loading spinner still shows." `references/verification.md`'s "For restyling specifically" section makes this a required acceptance-bar item, not optional: "(b) form/route/interaction behavior is unchanged... All three, not just the first."

**Pass/fail:** PASS — the sequence (inventory → map by role, not literal value → update shared tokens → update remaining → verify behavior explicitly) is unambiguous and the worked example is concretely form-shaped, matching the scenario.

---

## 4. Colors only — "Use only Finnomena colors"

**Required result:** Font, spacing, and layout unchanged.

**Method:** Desk-check.

**Governing text:** `skills/neon-redesign/SKILL.md` step 2: "**Colors only**: reference only `--color-*` variables... **Never touch font loading at this tier.**" `style-migration.md`'s "Tier scope" section: "`tier: 'colors'` ... only `--color-*` ... changes. Fonts, spacing, radii, and all structural dimensions stay exactly as they are." This is stated twice, unconditionally, with no caveat.

**Pass/fail:** PASS — unambiguous, redundant statement of the constraint across both `SKILL.md` and its reference doc.

---

## 5. Partial scope — "Make just the header look like Finnomena"

**Required result:** Unrelated content/computed styles unchanged.

**Method:** Desk-check.

**Governing text:** `skills/neon-audit/references/project-inspection.md` "Partial scope — local vs. shared/global tokens" section: if satisfying a partial request would require touching a shared/global token, "**that's a scope conflict — surface it to the user and propose a local override**... instead of silently widening the change." `style-migration.md` Example 2 works exactly this prompt shape (header-only restyle) and shows the scope check concretely — local CSS Module vs. a shared `--brand-color` — and the resulting rule to keep `:root` untouched if the header uses a local override. `verification.md`'s "Scope boundaries respected" bullet requires explicitly re-rendering an unrelated component "and confirm it is pixel-for-pixel/token-for-token unchanged."

**Pass/fail:** PASS — the conflict-detection rule, the worked example, and the verification requirement all agree and are unambiguous.

---

## 6. Non-React — "Restyle this Vue app with Finnomena branding"

**Required result:** CSS path; no CDS dependency.

**Method:** Real fixture.

**Setup:** Built a minimal Vue 3 + Vite fixture (`package.json` with only `vue`/`vite`/`@vitejs/plugin-vue`, a `src/main.ts`, `src/App.vue`) with no `@coinbase/cds-web` anywhere. Ran `node theme/finnomena/scripts/install.mjs <fixture> --css-only --skip-install`.

**Result:** Exit 0. Output: "Copied 1 theme files into `<fixture>/src/theme`" — only `theme.css` landed (verified by listing the directory). `package.json` byte-identical before/after (no `@coinbase/cds-web` added to `dependencies`), no lockfile created or touched.

**Pass/fail:** PASS — real execution confirms the CSS-only path never touches `package.json`/installs CDS, independent of any agent-level routing decision. (The agent-level routing decision itself — that a non-React `framework` must route to `neon-redesign` and never offer `tier: 'cds'` — is desk-checked separately via `workflow-contract.md`'s routing rules and `project-inspection.md`'s Vue worked example, both unambiguous on this point.)

---

## 7. Follow-up — "Make the buttons clearer" (after accepted branding)

**Required result:** Same brand/scope context; no repeated brand question.

**Method:** Desk-check.

**Governing text:** `skills/neon-audit/references/workflow-contract.md`'s Intent policy: "`brandConfirmed` becomes `true` the moment Finnomena/neon branding intent is established... Once `true`, every neon skill treats it as settled for the rest of the conversation... none of them re-asks 'do you want Finnomena branding?' on a handoff." And: "Ask a brand-intent question only when `brandConfirmed` is genuinely unset for this conversation." Independently, `NeonContext.tier`/`operation` (scope) is separately carried forward once resolved — a follow-up doesn't reopen a settled scope question either.

**Pass/fail:** PASS — this is the exact mechanism the contract exists to guarantee, stated unconditionally, in one shared doc all three skills read before starting.

---

## 8. Fresh generic request — "Build a login screen" (no Finnomena context)

**Required result:** No promise of automatic Finnomena branding without context.

**Method:** Desk-check.

**Governing text:** Every skill's YAML frontmatter `description` states the activation guard identically: "ONLY use this skill if the user's message literally contains the word 'Finnomena' or 'neon' — do not infer from related terms... or generic theming/UI requests alone." `workflow-contract.md`: "Ask a brand-intent question only when `brandConfirmed` is genuinely unset for this conversation — i.e. nothing in the conversation so far established it." A bare "Build a login screen" in a fresh conversation contains neither trigger word, so no neon skill activates at all — the request is handled as ordinary UI work with no Finnomena branding applied or promised.

**Pass/fail:** PASS — the activation guard is restated identically across all three (now four) skills' descriptions, leaving no ambiguity about the trigger condition.

---

## 9. Existing CDS — "Theme this CDS app with Finnomena"

**Required result:** One provider setup; installed API inspected.

**Method:** Desk-check.

**Governing text:** `skills/neon-audit/SKILL.md` step 2: if `@coinbase/cds-web` is already installed, "give a brief one-line confirmation... If CDS is already installed, also record whether a provider tree already exists... so `neon-create` edits that existing wiring instead of wrapping a second `ThemeProvider`/`MediaQueryProvider`/`PortalProvider` around it." `project-inspection.md` §7 and Worked Example 3 make this concrete: locate the existing `MediaQueryProvider → ThemeProvider → PortalProvider` wrap, and `neon-create`'s job becomes "edit the existing `ThemeProvider`'s `theme` prop... not add a second... wrap." "Installed API inspected": `neon-create/SKILL.md`'s opening line: "for 'which component'/'what props,' prefer `cds-code`/`cds-docs`/the CDS MCP server if available; otherwise read real prop types from the installed `@coinbase/cds-web` package's `dts/` folder rather than guessing."

**Pass/fail:** PASS — both halves of the required result (one provider setup, installed API inspected) are explicit, named instructions, not inferred.

---

## 10. Font/dark mode — "Restyle an app with `.dark` and Thai copy"

**Required result:** Font loaded; existing toggle still controls all affected UI.

**Method:** Desk-check.

**Governing text:** `skills/neon-audit/references/theme-integration.md` §2, Case 2 is this exact scenario: an app with a `.dark`-class toggle backed by `useTheme()`/`localStorage`. Required wiring: "`ThemeProvider`'s `activeColorScheme` prop is derived from the same `useTheme()` hook's current value... not a separate `prefers-color-scheme` check and not a hardcoded `'light'`." Explicit "what NOT to do": don't default to `useMediaQuery('(prefers-color-scheme: dark)')`, since that could visibly disagree with an explicit stored light choice. §1 covers font loading: "Inspect how the target app currently loads fonts... Prefer that same mechanism," with a mandatory two-part verification (computed-style check + real Thai-glyph visual render, not just Latin "Aa Bb") because "a font can report as 'loaded' by family name while still falling back to a system font for Thai glyphs specifically." `verification.md` step 4 (new-UI checklist) independently requires checking Thai text wrapping at both required viewports.

**Pass/fail:** PASS — both the dark-mode-preservation rule and the font-loading procedure are concrete, include an explicit "what NOT to do," and directly name the Thai-glyph-specific failure mode this scenario is testing for.

---

## 11. Customized rerun — "Update an existing customized theme"

**Required result:** Conflict explained and merged; custom state retained.

**Method:** Real fixture.

**Setup:** Built a fixture with `@coinbase/cds-web` already a dependency and all 4 theme files pre-copied from the real repo source, then hand-edited `color-overrides.ts` to append a custom export (`customAccentTeamOrange`) simulating a developer's prior customization. Recorded MD5 hashes of the other 3 files before running. Ran `node theme/finnomena/scripts/install.mjs <fixture>` (existing-project, full-CDS branch — the mode that would run on an "update this theme" request).

**Result:** Exit 1 (nonzero). Error: `Refusing to overwrite customized file: <fixture>/src/theme/color-overrides.ts`. Verified after: the other 3 theme files' MD5 hashes are byte-identical to before the run (untouched), and `customAccentTeamOrange` is still present in `color-overrides.ts` (customization retained, not deleted or overwritten).

**Minor finding:** the refusal surfaces as a raw uncaught Node exception with a full stack trace (`throw new Error(...)` in `copyThemeFiles`, uncaught up to the top level), not a clean one-line CLI error message. The required result (nonzero exit before any write) is still satisfied, but the presentation is rougher than a typical CLI error — worth a follow-up polish, not a correctness defect.

**Pass/fail:** PASS for the required result (conflict causes a safe refusal, custom state retained, nothing overwritten). The "conflict explained and merged" half beyond the installer's own refusal (i.e., an agent actually diffing/merging per `theme-integration.md` §4/Case 3, which walks through exactly this scenario) is desk-check only — no live agent merge was performed here, only the installer's refusal-and-preservation guarantee was exercised for real.

---

## 12. Monorepo — "Restyle apps/portal using pnpm"

**Required result:** Correct app path and manager; no second lockfile.

**Method:** Real fixture (two iterations — see Result).

**Setup (v1, unintentional but instructive):** `apps/portal/package.json` (react app) + root `package.json` (`"workspaces": ["apps/*"]`) + root `pnpm-lock.yaml`, with **no `package.json` in the intermediate `apps/` directory** — the normal shape for a pnpm/yarn workspace (nobody puts a manifest in the glob-matched parent, only in the workspace root and each member app). Ran `node theme/finnomena/scripts/install.mjs <fixture>/apps/portal` for real (no `--skip-install`).

**Result (v1) — FAIL, real defect found:** `install.mjs`'s package-manager evidence walk (`findPackageManagerEvidence` in `theme/finnomena/scripts/install.mjs`) stops early at `apps/` because that directory has no `package.json` of its own (its documented "safety valve": "gives up ... at whichever comes first: the filesystem root, or an ancestor with no `package.json` at all"). It never reaches the workspace root's `pnpm-lock.yaml`, silently falls back to **npm**, and ran a real `npm install @coinbase/cds-web@^9.26.1` in `apps/portal`. Because the fixture's root `package.json` declares `"workspaces": ["apps/*"]`, **npm's own workspace auto-detection** walked up past the same `apps/` directory (npm's workspace detection isn't gated on an intermediate manifest the way `install.mjs`'s evidence walk is) and wrote a real `package-lock.json` (81KB) **at the workspace root, next to the pre-existing `pnpm-lock.yaml`.** Confirmed by listing the fixture root after the run — both lockfiles present simultaneously. This directly contradicts the scenario's required result ("no second lockfile") for what is the *common* real-world monorepo shape, not a contrived edge case.

**Setup (v2, corrected fixture matching the existing unit test's shape):** Added a minimal `apps/package.json` (`{"private": true}`) so the evidence walk doesn't stop early, matching `tests/install.test.mjs`'s own "walks up to a workspace root" test fixture shape. Ran with `PATH=''` for the child process (this repo's own test technique — see `tests/install.test.mjs` line 19 — since pnpm is not installed in this environment; see npm scaffold section of the validation report) so the manager-resolution log line is observable without needing pnpm to actually be present.

**Result (v2) — PASS for this corrected shape:** stdout showed `> pnpm add @coinbase/cds-web@^9.26.1` (correct manager, resolved by walking up to the root's `pnpm-lock.yaml`); theme files landed in `apps/portal/src/theme` (correct app path, not the workspace root); the child process then failed with `ENOENT` (pnpm genuinely not installed here — expected, matches the existing test suite's own workaround) before any lockfile could be written; the root `pnpm-lock.yaml` content was unchanged.

**Pass/fail: FAIL for the realistic monorepo shape (v1); PASS only for a fixture where every intermediate directory happens to carry its own `package.json` (v2).** This is a real, previously-undetected defect in Task 3's workspace-walk fix, not a fixture-construction mistake — `apps/<name>` having no manifest of its own is the standard pnpm/yarn/npm workspace convention (see e.g. `pnpm-workspace.yaml: packages: ['apps/*']`), and the existing unit test suite's "stops walking upward at an ancestor with no package.json" test actually **encodes this wrong behavior as a passing assertion** rather than catching it. **Flagged for the controller's attention — see the validation report's Findings section; this affects the release gate's "correct package/destination selection" criterion.**

---

## 13. Invalid CLI — Misspelled flag or escaping destination

**Required result:** Nonzero exit before writes.

**Method:** Real fixture + existing real-execution unit coverage.

**Existing coverage cited:** `tests/install.test.mjs` already real-subprocess-tests 4 invalid-argument cases (`--css-onyl`, extra positional, `--sync-starter` with a target dir, `--new`+`--css-only` together) plus a dedicated escaping-`--theme-dir` test and a `--theme-dir`+`--new` rejection test — all asserting nonzero exit and `existsSync(...)` false for anything that would have been written. Reconfirmed passing at current HEAD (44/44, see validation report).

**Fresh real invocation for this record:** `node theme/finnomena/scripts/install.mjs <fixture> --css-onyl` (misspelled) → Node's own `parseArgs` throws `ERR_PARSE_ARGS_UNKNOWN_OPTION`, exit 1, target directory left holding only the pre-existing `package.json` (no `src/` created). `node theme/finnomena/scripts/install.mjs <fixture> --theme-dir ../../etc/evil` → `install.mjs` throws "`--theme-dir` escapes the target directory," exit 1, same — nothing written.

**Minor finding:** same as scenario 11 — both failures surface as raw uncaught-exception stack traces (Node's own `parseArgs` error for the misspelled flag; `install.mjs`'s own `throw new Error` for the escaping path) rather than a clean CLI error message. Nonzero exit before writes is fully satisfied; presentation is rough.

**Pass/fail:** PASS.

---

## 14. SSR — "Add a branded screen to an SSR React app"

**Required result:** Valid client/provider boundary; build succeeds.

**Method:** Desk-check. (No real Next.js fixture was built/built for this row — see limitation below.)

**Governing text:** `skills/neon-audit/references/project-inspection.md`'s "Server-rendered (Next-style) React" section requires inspecting, before recommending any provider integration: "**Client/server component boundaries** — CDS's providers are client-side React context and must live inside a component marked `'use client'`... Don't assume `app/layout.tsx` itself can hold the providers directly unless it's already a client component," and "**Where a global style import is legal** — a global CSS import... is only legal from the root layout... importing global CSS from a nested or client component throws a build error." Worked Example 4 in the same doc gives the concrete recommendation for exactly this shape: introduce a `'use client'` providers component (e.g. `app/providers.tsx`) holding `MediaQueryProvider`/`ThemeProvider`/`PortalProvider`, imported into the server `app/layout.tsx`; global theme CSS import stays in `app/layout.tsx` only.

**Pass/fail:** PASS for "valid client/provider boundary" — the instruction correctly identifies both real Next.js App Router constraints (client-context-in-server-component, global-CSS-only-in-root-layout) that would otherwise surface only as a build error, and gives the correct fix (a dedicated `'use client'` providers file). **"Build succeeds" is NOT verified by this row** — no real Next.js project was scaffolded and built to confirm the prose's recommendation actually compiles; this is traced-correct prose, not a build result. Flagged as a limitation, not silently passed.

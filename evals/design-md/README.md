> Legacy harness: the original `design-md/finnomena/` guides referenced by these scenarios are absent from the current repository. This harness is not a validated gate for `design/FINNOMENA.md`. Use `evals/skills/README.md` for current skill scenarios; recalibrate visual oracles before claiming current-brand coverage.

# Two-guide layout evaluation

This harness evaluates a disposable React showcase generated from exactly one scene prompt and its matching guide: [generation/functional.md](generation/functional.md) + [functional layout guide](../../design-md/finnomena/functional-layout/DESIGN.md), or [generation/immersive.md](generation/immersive.md) + [immersive layout guide](../../design-md/finnomena/immersive-layout/DESIGN.md). `prompt.md` is an orchestration index only — hand a generation agent exactly one of the two scene prompts above, never `prompt.md` itself and never the other scene's prompt.

Directory separation between `generation/` and `harness/` does not by itself enforce access isolation — it only makes it possible to hand each agent exactly what it needs. A generation agent must see only its one `generation/*.md` prompt and matching guide; never `harness/` (specs, oracles, or `harness/review/`'s rubrics and report template), the `selftest/` fixture, or prior run artifacts. An evaluation/review agent, conversely, is meant to receive the `harness/review/`-produced review package (`visual-review-manifest.json`, `visual-review-prompt.md`) and a run's screenshots — not the generation prompts or oracle values.

The scope is three functional workspace layouts—Detailed, Content, and Simple—and one standalone Immersive landing page. Multi-column is intentionally retired.

## Run

Use Node 20+ and start the generated app separately. It must listen on the origin passed to `--base-url`.

```bash
cd evals/design-md
npm ci
npx playwright install chromium
npm test -- --base-url http://localhost:5173
```

Run either guide independently when only one screen family is under review:

```bash
npm run test:functional -- --base-url http://localhost:5173
npm run test:immersive -- --base-url http://localhost:5173
```

Pass the exact two guide files supplied to the generation agent when they are outside this checkout:

```bash
npm test -- --base-url http://localhost:5173 \
  --functional-design-file /absolute/path/functional-layout/DESIGN.md \
  --immersive-design-file /absolute/path/immersive-layout/DESIGN.md \
  --model model-name --run-label attempt-01
```

`--functional-design-file` and `--immersive-design-file` default to the two checked-in guides. `--scene functional` reads and hashes only the functional guide; `--scene immersive` reads and hashes only the immersive guide; `--scene all` is the default. `--model`, `--recognition-model`, and `--run-label` are report annotations. Other arguments are passed to Playwright. The test command never starts or stops the app server.

## Results

Every invocation writes `.local/evals/design-md/artifacts/<run-id>/` (resolved from the repository root, not from this directory):

- `run.json` records both guide paths and SHA-256 hashes, prompt/oracle hashes, base URL, labels, and exit status.
- `results.json`, `html/`, and `results/` contain Playwright output, screenshots, and traces.
- `visual/` contains full-page captures at 375px, 1440px, and 1920px for the selected scene.
- `visual-review-manifest.json` and `visual-review-prompt.md` are the provider-neutral review package for an AI reviewer.

Open a report with:

```bash
npx playwright show-report ../../.local/evals/design-md/artifacts/<run-id>/html
```

## Automated coverage

| Area | Evidence |
| --- | --- |
| Routes | Index links and direct loads for Detailed, Content, Simple, and Immersive |
| Functional geometry | Desktop panes and responsive sidebar transitions at 499/500, 1079/1080, 1271/1272, 1439/1440, and 1919/1920px |
| Functional behavior | Selection, narrow Back behavior, saved-fund search, state previews, and reset |
| Immersive structure | Logo-only header; CTA, tier label, proof, media, footer, multi-asset visual; no workspace chrome or form |
| Immersive tokens | Palette scales, tier mappings, and all ten multi-asset CSS variables |
| Responsive health | No page-level horizontal overflow at narrow and wide widths |

The automated checks validate observable conformance, not the quality of the content, all accessibility criteria, font availability, or financial accuracy. A passing run does not prove that the generation agent saw only the two guides.

## AI visual review

Give an AI reviewer the run's `visual-review-prompt.md`, `visual-review-manifest.json`, listed screenshot files, and `results.json`. The reviewer must write `recognition-report.md` in that artifact directory. It should keep Playwright's contract result separate from a visual verdict, cite every conclusion to a screenshot, and give the multi-asset visual its own label/value/color-leakage verdict.

## Visual review

Functional screens:

- Confirm hierarchy supports the workspace task and pane density stays readable.
- Confirm Thai text, numbers, focus rings, and selected-record details are not clipped.
- Confirm semantic colours and pane chrome match the functional guide.

Immersive screen:

- Confirm the wordmark header and content feel like one full-bleed landing page rather than a workspace.
- Confirm editorial asymmetry, image crops, and yellow emphasis are purposeful and text stays unobscured.
- Confirm the Finnomena Exclusive colorway, proof copy, and labeled multi-asset visual follow the immersive guide.
- Confirm motion is restrained and reduced-motion behavior is usable.

Record visual findings separately in `artifacts/<run-id>/recognition-report.md`, with the reviewing model, both guide hashes, a verdict per item, and the screenshot paths inspected.

## Harness self-test

```bash
npm run selftest
```

The self-test serves `selftest/fixtures/showcase.html` in memory, runs the full suite, injects one wrong functional sidebar width, one missing immersive logo, and one wrong immersive palette variable, verifies each targeted failure, then verifies recovery. It validates harness mechanics only; the fixture is not a polished reference implementation.

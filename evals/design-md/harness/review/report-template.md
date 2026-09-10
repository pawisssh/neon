# Visual review

Review only the screenshots listed in `visual-review-manifest.json`, using the matching guide hash and scene brief. Do not infer compliance from source code or Playwright results.

For each rubric item, write **pass**, **needs-review**, or **fail**, with a screenshot filename and concise visual evidence.

Create `recognition-report.md` with:

- Scene and guide hash(es)
- Contract result copied from `results.json`
- Visual verdict: pass / needs-review / fail
- Functional and/or immersive rubric verdicts with screenshot evidence
- A separate multi-asset verdict covering category label, value, color association, and decorative-color leakage
- Concrete remediation for every needs-review or fail

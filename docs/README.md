# docs/

Maintained, tracked documentation about this repository itself — not the distributed plugin's own docs (those are `README.md` at the repo root, `design-md/README.md`, and each skill's `SKILL.md`).

- [`architecture/repository-structure.md`](architecture/repository-structure.md) — the full directory map: what's here, who owns it, what's actually packaged into the distributed plugin, and where local/generated material (research, notes, evaluator runs) lives instead.
- [`superpowers/plans/`](superpowers/plans/) — active implementation plans (see `superpowers:executing-plans`). Completed/superseded plans move to `.local/notes/superpowers/` once no longer active; this directory holds only the plan currently being executed.

Local research, working notes, and generated evaluator output are deliberately **not** here — see `architecture/repository-structure.md`'s "Local material" section for where they live and why.

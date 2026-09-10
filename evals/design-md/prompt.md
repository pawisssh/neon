# Finnomena design.md generation prompts — index

Orchestration instructions, not a generation scenario. This evaluator runs two independent generation scenarios; each has its own self-contained prompt:

- [`generation/functional.md`](generation/functional.md) — the functional workspace showcase (`/`, `/detailed`, `/content`, `/simple`).
- [`generation/immersive.md`](generation/immersive.md) — the immersive landing showcase (`/`, `/immersive`).

Each prompt supplies its own guide path and needs no input from the other. Give a generation agent exactly one of the two files, never this index — it is a map for whoever is running the evaluator, not itself a build brief.

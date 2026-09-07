# Archived token files

These files are excluded from `scripts/sync-tokens.mjs`'s scan (it skips
directories). Kept for traceability, not deleted.

- `theme.legacy.json` — superseded by the new `theme.json` (full semantic
  color graph from `collections/tokens/theme/theme.json`). Also used the
  `<family>-opaque` root-collection naming convention, which the new export
  doesn't use at all (verified: zero `-opaque` occurrences in the new file).
- `color_palette.json`, `color_palette_1.json`, `color_palette_2.json`,
  `color_palette_3.json` — self-referential `tag.*` alias placeholders
  (e.g. `"value": "{tag.yellow.primary.background}"`). These are the source
  of a real bug in `sync-tokens.mjs`'s suffix-matching fallback: resolving
  through them mis-tags unresolved color tokens as `circular` instead of
  `missing`, hiding blocked root collections from `tokens.report.json`.
  Superseded by the new `theme.json`'s own `Tag` group, which uses clean
  family+shade refs instead of self-references.
- `breakpoints.legacy.json` (old, plural filename) — superseded by the new
  `breakpoint.json` (singular), which has 7 breakpoints vs. the old file's 4.
- `column_span.json` — was an empty `{}`. Dead weight, no data lost.

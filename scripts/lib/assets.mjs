/**
 * assets.mjs — explicit ownership list for the canonical theme assets, so
 * install.mjs and assemble-starter.mjs share one definition of "the 4 CDS
 * files" instead of each hardcoding it. Paths are relative to the resolved
 * plugin root (theme/) — no directory guessing.
 */
export const CDS_FILES = ["theme.config.ts", "color-overrides.ts", "createTheme.ts", "breakpoints.config.ts"];
export const CSS_FILE = "theme/css/theme.css";

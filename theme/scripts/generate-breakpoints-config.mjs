#!/usr/bin/env node
/**
 * generate-breakpoints-config.mjs
 *
 * Mechanically emits theme/cds/breakpoints.config.ts from
 * ../tokens.resolved.json's "<tier>.Detailed Layout.*" entries (sourced
 * from ../tokens/breakpoint.json). Run `node sync-tokens.mjs` first to
 * (re)produce tokens.resolved.json.
 *
 * Only the fields corroborated against the Figma app-shell frame (file
 * C9Usn2yP1dRpE9iTxyW3B2, node 732:842) are projected here: viewport
 * min/max-width, Sidebar View width, Gutter, End margins, Columns. This
 * file's "Detailed Layout" token variant models a single-active-pane state
 * (its own Content View width / Inspector View width are never both
 * nonzero at once) and is NOT the same thing as the simultaneous
 * Sidebar+Content+Inspector app shell — that lives in
 * ${CLAUDE_PLUGIN_ROOT}/templates/vitejs-cds/src/layout/layoutPanes.ts as a
 * separately hand-maintained, Figma-session-sourced constant. Do not merge
 * the two.
 *
 * breakpoints.config.ts is a generated file — do not hand-edit it. Change
 * ../tokens/breakpoint.json and re-run this pipeline instead.
 *
 * Usage (full regeneration pipeline — run all three in order after changing
 * anything in tokens/*.json):
 *   node theme/scripts/sync-tokens.mjs && node theme/scripts/generate-theme-config.mjs && node theme/scripts/generate-breakpoints-config.mjs
 *
 * Nothing needs to sync a starter copy afterward — see sync-tokens.mjs's
 * header for why.
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const THEME_DIR = join(__dirname, "..");
const CDS_DIR = join(THEME_DIR, "cds");
const OUT_FILE = join(CDS_DIR, "breakpoints.config.ts");

mkdirSync(CDS_DIR, { recursive: true });

const resolved = JSON.parse(readFileSync(join(THEME_DIR, "tokens.resolved.json"), "utf8"));

// Ordered narrowest to widest — order here drives emission order below.
const TIERS = [
  { key: "sm_320px", name: "sm" },
  { key: "md_500px", name: "md" },
  { key: "lg_988px", name: "lg" },
  { key: "xl_1080px", name: "xl" },
  { key: "xxl_1272px", name: "xxl" },
  { key: "xxxl_1440px", name: "xxxl" },
  { key: "max_1920px", name: "max" },
];

function field(tierKey, field) {
  const entry = resolved[`${tierKey}.Detailed Layout.${field}`];
  if (entry === undefined) {
    throw new Error(`Missing "${tierKey}.Detailed Layout.${field}" in tokens.resolved.json`);
  }
  return entry.value;
}

const rows = TIERS.map(({ key, name }) => ({
  name,
  minWidth: field(key, "Viewport min-width"),
  maxWidth: field(key, "Viewport max-width"),
  sidebarWidth: field(key, "Sidebar View width"),
  gutter: field(key, "Gutter"),
  endMargins: field(key, "End margins"),
  columns: field(key, "Columns"),
}));

const output = `/**
 * Finnomena responsive breakpoint/grid tiers — projected from
 * tokens/breakpoint.json's "Detailed Layout" variant.
 *
 * GENERATED FILE — do not hand-edit. Regenerate with:
 *   node theme/scripts/sync-tokens.mjs && node theme/scripts/generate-breakpoints-config.mjs
 *
 * This file covers viewport ranges, sidebar rail/full width, and grid
 * rhythm (gutter/end-margins/columns) only. It does NOT cover Content/
 * Inspector pane widths for the 3-pane app shell — those come from a
 * separate Figma frame read, not this token export (see
 * templates/vitejs-cds/src/layout/layoutPanes.ts for that data
 * and why it's kept separate).
 */
export interface BreakpointTier {
  name: ${rows.map((r) => JSON.stringify(r.name)).join(" | ")};
  minWidth: number;
  maxWidth: number;
  /** Sidebar width at this tier: 0 = hidden, 64 = icon-rail, >64 = full sidebar. */
  sidebarWidth: number;
  gutter: number;
  endMargins: number;
  columns: number;
}

export const breakpoints: readonly BreakpointTier[] = [
${rows
  .map(
    (r) =>
      `  { name: ${JSON.stringify(r.name)}, minWidth: ${r.minWidth}, maxWidth: ${r.maxWidth}, sidebarWidth: ${r.sidebarWidth}, gutter: ${r.gutter}, endMargins: ${r.endMargins}, columns: ${r.columns} },`
  )
  .join("\n")}
] as const;

export type BreakpointName = BreakpointTier["name"];
`;

writeFileSync(OUT_FILE, output);

console.log(`Wrote ${OUT_FILE}`);
console.log(`  tiers: ${rows.map((r) => `${r.name}(${r.minWidth}-${r.maxWidth})`).join(", ")}`);

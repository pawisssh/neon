#!/usr/bin/env node
/**
 * generate-theme-config.mjs
 *
 * Mechanically emits ../theme/theme.config.ts from ../theme/tokens.resolved.json,
 * ../theme/tokens.report.json, and the raw ../theme/tokens/theme.json semantic
 * color graph. Run `node sync-tokens.mjs` first to (re)produce the two JSON
 * inputs from whatever is currently in ../theme/tokens/.
 *
 * theme.config.ts is a generated file — do not hand-edit it. Change the
 * source token exports in ../theme/tokens/ and re-run this pipeline instead.
 *
 * Usage:
 *   node scripts/sync-tokens.mjs && node scripts/generate-theme-config.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const THEME_DIR = join(__dirname, "..", "theme");
const TOKENS_DIR = join(THEME_DIR, "tokens");
const OUT_FILE = join(THEME_DIR, "theme.config.ts");

const resolved = JSON.parse(readFileSync(join(THEME_DIR, "tokens.resolved.json"), "utf8"));
const report = JSON.parse(readFileSync(join(THEME_DIR, "tokens.report.json"), "utf8"));
const rawTheme = JSON.parse(readFileSync(join(TOKENS_DIR, "theme.json"), "utf8"));
const rawTypePrimitives = JSON.parse(readFileSync(join(TOKENS_DIR, "type_primitives.json"), "utf8"));

const TODO_RGB = "TODO_RGB";

// ---------------------------------------------------------------------------
// Fixed by explicit decision (see SKILL.md) — do not source from
// font_family.json, whose export names the family "Finnomena Trek".
// ---------------------------------------------------------------------------
const FONT_FAMILY_PRIMARY = "'IBM Plex Sans Thai', sans-serif";
const FONT_FAMILY_EXPORT_NAME = resolveFontFamilyExportName();

function resolveFontFamilyExportName() {
  const entry = Object.values(resolved).find((e) => e.sourceFile === "font_family.json");
  return entry ? entry.value : "(unknown — font_family.json not found in resolved tokens)";
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function toCamel(key) {
  const camel = key
    .trim()
    .replace(/[^A-Za-z0-9]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ""))
    .replace(/^[A-Z]/, (c) => c.toLowerCase());
  return /^[0-9]/.test(camel) ? `_${camel}` : camel;
}

/** Emit an object-literal key: bare if it's a valid JS identifier, else quoted. */
function jsKey(key) {
  return /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(key) ? key : JSON.stringify(key);
}

function isLeaf(node) {
  return node && typeof node === "object" && "value" in node && "type" in node;
}

const ALIAS = /^\{([^}]+)\}$/;

/** Split a "{Family.Shade}" alias into [family, shade], else null. */
function parseFamilyShadeAlias(raw) {
  if (typeof raw !== "string") return null;
  const m = raw.match(ALIAS);
  if (!m) return null;
  const dot = m[1].indexOf(".");
  if (dot === -1) return null;
  return [m[1].slice(0, dot), m[1].slice(dot + 1)];
}

// ---------------------------------------------------------------------------
// 1. spaceScale — resolved numeric entries from size.json (kept as the
//    space-scale source: a strict superset of the new export's sizing.json).
//    CDS requires the `space` scale to be multiples of its 8px base unit;
//    non-conforming values are recorded, not silently dropped.
// ---------------------------------------------------------------------------
function buildSpaceScale() {
  const values = new Set();
  for (const entry of Object.values(resolved)) {
    if (entry.sourceFile === "size.json" && entry.type === "number") values.add(entry.value);
  }
  const sorted = [...values].sort((a, b) => a - b);
  const base8 = sorted.filter((v) => v % 8 === 0);
  const nonConforming = sorted.filter((v) => v % 8 !== 0);
  return { base8, nonConforming };
}

// ---------------------------------------------------------------------------
// 2. radiusScale — resolved entries from radius.json, keyed by the
//    "<label> (radius-<slug>)" naming convention the export uses.
// ---------------------------------------------------------------------------
function buildRadiusScale() {
  const RADIUS_KEY = /\(radius-([\w]+)\)/;
  const RENAME = { 0: "none" };
  const entries = [];
  const seenSlugs = new Set();
  for (const [path, entry] of Object.entries(resolved)) {
    if (entry.sourceFile !== "radius.json") continue;
    const m = path.match(RADIUS_KEY);
    if (!m) continue;
    let slug = m[1];
    if (RENAME[slug]) slug = RENAME[slug];
    if (seenSlugs.has(slug)) continue;
    seenSlugs.add(slug);
    entries.push([slug, entry.value]);
  }
  entries.sort((a, b) => (a[0] === "round" ? 1 : b[0] === "round" ? -1 : a[1] - b[1]));
  return entries;
}

// ---------------------------------------------------------------------------
// 3. typeScale — read explicitly from type_primitives.json's
//    Dynamic["Large (Default)"][role] tree, NOT typography.json's own
//    per-role fields, which are self-referential placeholders in this
//    export (e.g. "Large Title".Size -> "{Large Title.Size}") and only
//    ever resolved before by accident of the old suffix-matching fallback.
// ---------------------------------------------------------------------------
function buildTypeScale() {
  const roles = Object.keys(rawTypePrimitives.Dynamic["Large (Default)"]);
  const rows = [];
  for (const role of roles) {
    const base = `Dynamic.Large (Default).${role}.`;
    const size = resolved[base + "Size"]?.value;
    const lineHeight = resolved[base + "Line height"]?.value;
    const letterSpacing = resolved[base + "Letter spacing"]?.value;
    const fontWeight = resolved[base + "Weight"]?.value;
    if (size === undefined || lineHeight === undefined) continue; // skip incomplete roles rather than emit gaps
    rows.push({ role, size, lineHeight, letterSpacing: letterSpacing ?? 0, fontWeight: fontWeight ?? "Regular" });
  }
  return rows;
}

// ---------------------------------------------------------------------------
// 4. Color — walk the raw theme.json light/dark trees directly (excluding
//    the "Figma" group, which is Figma-tool-only swatch data, "Mode", which
//    is a "Light"/"Dark" string marker, and "Colors", which is a redundant
//    re-exposure of the same ramp lightSpectrum/darkSpectrum already
//    covers). Family/shade sets for the spectrum are collected live from
//    whatever aliases are actually referenced — not a hand-typed list — so
//    a future re-export with more/fewer families "just works".
// ---------------------------------------------------------------------------
const EXCLUDED_GROUPS = new Set(["Figma", "Mode", "Colors"]);

// theme.json's top-level group names (Text, Icon, Field, Border, Support, ...).
// Some leaves alias a DIFFERENT semantic group instead of a primitive family
// directly — e.g. Tag.White.Primary.border-disabled -> "{Border.border-disabled}"
// and Tag.*.color-disabled -> "{Text.text-disabled}". Naively parsed as
// "Family.Shade" those would fabricate fake primitive families "Border" and
// "Text". resolveFamilyShade() below follows these intra-theme references
// (bounded depth, cycle-safe) until it lands on a real primitive.
const GROUP_NAMES = new Set([...Object.keys(rawTheme.light), ...Object.keys(rawTheme.dark)]);

/**
 * Resolve a "{Family.Shade}" (or intra-theme "{Group.leaf}") alias down to a
 * real [family, shade] primitive pair, or null if it bottoms out unresolved.
 */
function resolveFamilyShade(mode, raw, depth = 0) {
  if (depth > 10) return null; // guard against unexpected cycles
  const fs = parseFamilyShadeAlias(raw);
  if (!fs) return null;
  const [head, tail] = fs;
  if (!GROUP_NAMES.has(head)) return fs; // head is a primitive family — done
  const target = rawTheme[mode]?.[head]?.[tail];
  if (!isLeaf(target) || target.type !== "color") return null;
  return resolveFamilyShade(mode, target.value, depth + 1);
}

function collectFamilyShades(mode) {
  const families = new Map(); // family -> Set(shade)
  function walk(node) {
    if (isLeaf(node)) {
      if (node.type !== "color") return;
      const fs = resolveFamilyShade(mode, node.value);
      if (!fs) return;
      const [family, shade] = fs;
      if (!families.has(family)) families.set(family, new Set());
      families.get(family).add(shade);
      return;
    }
    if (node && typeof node === "object") {
      for (const child of Object.values(node)) walk(child);
    }
  }
  for (const [group, node] of Object.entries(rawTheme[mode])) {
    if (EXCLUDED_GROUPS.has(group)) continue;
    walk(node);
  }
  return families;
}

/** Build the nested semantic color tree as {groupKey: {leafKey: [family, shade] | null}}. */
function buildColorTree(mode) {
  const tree = {};
  for (const [group, node] of Object.entries(rawTheme[mode])) {
    if (EXCLUDED_GROUPS.has(group)) continue;
    tree[group] = walkGroup(node);
  }
  return tree;

  function walkGroup(node) {
    if (isLeaf(node)) {
      if (node.type !== "color") return null;
      const fs = resolveFamilyShade(mode, node.value);
      return fs ?? { unresolvedAlias: node.value };
    }
    const out = {};
    for (const [key, child] of Object.entries(node)) {
      out[key] = walkGroup(child);
    }
    return out;
  }
}

// ---------------------------------------------------------------------------
// Emission
// ---------------------------------------------------------------------------

/** Real "r,g,b" value for a primitive family+shade, if the palette resolved it. */
function primitiveValue(family, shade) {
  const entry = resolved[`${family}.${shade}`];
  return entry && entry.type === "color" ? entry.value : undefined;
}

function emitSpectrum(varName, families) {
  const familyNames = [...families.keys()].sort();
  const lines = familyNames.map((family) => {
    const shades = [...families.get(family)].sort((a, b) => {
      const na = parseFloat(a);
      const nb = parseFloat(b);
      if (na !== nb) return na - nb;
      return a.localeCompare(b);
    });
    const shadeLines = shades
      .map((shade) => {
        const real = primitiveValue(family, shade);
        const value = real !== undefined ? JSON.stringify(real) : TODO_RGB;
        return `    ${JSON.stringify(shade)}: ${value},`;
      })
      .join("\n");
    return `  ${JSON.stringify(family)}: {\n${shadeLines}\n  },`;
  });
  return `export const ${varName} = {\n${lines.join("\n")}\n} as const;`;
}

function emitColorTree(varName, tree, spectrumVarName, indent = "") {
  const inner = Object.entries(tree)
    .map(([key, value]) => emitColorNode(key, value, spectrumVarName, indent + "  "))
    .join("\n");
  return `export const ${varName} = {\n${inner}\n} as const;`;
}

function emitColorNode(key, value, spectrumVarName, indent) {
  const outKey = jsKey(toCamel(key));
  if (Array.isArray(value)) {
    const [family, shade] = value;
    return `${indent}${outKey}: ${spectrumVarName}[${JSON.stringify(family)}][${JSON.stringify(shade)}],`;
  }
  if (value === null) {
    return `${indent}${outKey}: ${TODO_RGB}, // unresolved: "${key}" was not a color-typed leaf`;
  }
  if (typeof value === "object" && "unresolvedAlias" in value) {
    return `${indent}${outKey}: ${TODO_RGB}, // unresolved: "${key}" aliases ${value.unresolvedAlias} (an intra-theme reference into another still-unresolved group, not a direct primitive)`;
  }
  const inner = Object.entries(value)
    .map(([k, v]) => emitColorNode(k, v, spectrumVarName, indent + "  "))
    .join("\n");
  return `${indent}${outKey}: {\n${inner}\n${indent}},`;
}

// ---------------------------------------------------------------------------
// Build everything
// ---------------------------------------------------------------------------
const { base8: spaceScale, nonConforming: spaceNonConforming } = buildSpaceScale();
const radiusEntries = buildRadiusScale();
const typeScaleRows = buildTypeScale();
const lightFamilies = collectFamilyShades("light");
const darkFamilies = collectFamilyShades("dark");
const lightColorTree = buildColorTree("light");
const darkColorTree = buildColorTree("dark");

/** Count of family/shade pairs referenced by the spectrum that still lack a real value. */
function countUnresolvedSpectrum(families) {
  let n = 0;
  for (const [family, shades] of families) {
    for (const shade of shades) {
      if (primitiveValue(family, shade) === undefined) n++;
    }
  }
  return n;
}

/** Count of {unresolvedAlias} leaves remaining in a built color tree. */
function countUnresolvedTreeLeaves(node) {
  if (node && typeof node === "object" && "unresolvedAlias" in node) return 1;
  if (Array.isArray(node) || node === null || typeof node !== "object") return 0;
  return Object.values(node).reduce((sum, v) => sum + countUnresolvedTreeLeaves(v), 0);
}

const unresolvedColorCount =
  countUnresolvedSpectrum(lightFamilies) +
  countUnresolvedSpectrum(darkFamilies) +
  countUnresolvedTreeLeaves(lightColorTree) +
  countUnresolvedTreeLeaves(darkColorTree);

const missingColorFamilies = Object.keys(report.missingRootCollections)
  .filter((root) => lightFamilies.has(root) || darkFamilies.has(root))
  .sort();

const colorStatusBlock =
  unresolvedColorCount === 0
    ? ` *   ✅ color — RESOLVED. Every color token in theme.json's light/dark trees
 *      (including the ${lightFamilies.size}/${darkFamilies.size} primitive families referenced by
 *      light/dark and the intra-theme cross-references like Tag's
 *      border-disabled/color-disabled) now traces back to a real "r,g,b"
 *      value sourced from tokens/colors.json. lightSpectrum/darkSpectrum
 *      hold the primitives; lightColor/darkColor reference them by key
 *      rather than duplicating values.`
    : ` *   ⚠ color — PARTIALLY RESOLVED. ${unresolvedColorCount} color value(s) still could not be
 *      traced to a primitive (see TODO_RGB occurrences below and their
 *      inline comments). Missing/blocked root collections, live from
 *      tokens.report.json's missingRootCollections (do not hand-copy this
 *      list elsewhere — it can drift; re-run the pipeline instead):
 *        ${missingColorFamilies.length ? missingColorFamilies.join(", ") : "(none — remaining gaps are intra-theme references, not missing primitive families)"}
 *
 *      To unblock further: export any still-missing primitive family
 *      collections (with real hex/rgb per shade) from Figma into ./tokens/,
 *      then re-run
 *      \`node scripts/sync-tokens.mjs && node scripts/generate-theme-config.mjs\`.
 *      Never hand-edit the TODO_RGB values below — this file is
 *      regenerated wholesale.`;

// ---------------------------------------------------------------------------
// Render theme.config.ts
// ---------------------------------------------------------------------------
const header = `/**
 * Finnomena companyTheme — override of CDS's defaultTheme.
 *
 * GENERATED FILE — do not hand-edit. Regenerate with:
 *   node scripts/sync-tokens.mjs && node scripts/generate-theme-config.mjs
 *
 * Source of truth: the raw Figma Token Studio export in ./tokens/*.json,
 * resolved by ../scripts/sync-tokens.mjs into ./tokens.resolved.json
 * (alias-resolved tokens) and ./tokens.report.json (what's still missing).
 *
 * STATUS (regenerated ${report.generatedAt}):
 *   Resolved ${report.totals.resolved} / ${report.totals.tokensSeen} tokens.
 *   ✅ space, radius, typography (type scale for the "Large (Default)" web
 *      size class) — fully resolved from the Figma export, used directly
 *      below.
${colorStatusBlock}
 *
 *   ⚠ Base-unit conflict (flagged, not auto-fixed): the Figma spacing
 *      export includes values that are not multiples of CDS's 8px base
 *      unit — ${spaceNonConforming.length ? spaceNonConforming.join(", ") : "(none currently)"}px. These are excluded from
 *      spaceScale below rather than rounded or invented. Precedent: the
 *      previous hand-authored version of this file already excluded the
 *      same class of values from the old export for the same reason. If
 *      these are load-bearing in real designs, confirm with design whether
 *      they're intentional exceptions or export drift to fix at the source.
 *
 *   ⚠ fontFamily is deliberately fixed to ${JSON.stringify(FONT_FAMILY_PRIMARY)} rather
 *      than the export's actual family name ("${FONT_FAMILY_EXPORT_NAME}") —
 *      a confirmed decision, not a missed sync step.
 *
 *   ⚠ typeScale's fontWeight values are font-variant names (e.g. "Regular",
 *      "SemiBold") taken from the "${FONT_FAMILY_EXPORT_NAME}" export, not
 *      verified against IBM Plex Sans Thai's actual available weight set,
 *      nor against @coinbase/cds-web's expected typography weight type.
 *
 *   ⚠ Color values are "r,g,b" strings for opaque colors, but "r,g,b,a"
 *      (4 components, a as a 0-1 fraction) for any primitive shade that
 *      was an 8-digit hex in tokens/colors.json (every "*A" opacity
 *      variant — used throughout overlays, hover/disabled states, subtle
 *      borders). The project brief's documented convention was 3-component
 *      "r,g,b" only; dropping alpha would have silently turned every
 *      translucent color opaque, so this was a deliberate fix, not
 *      invented data — but the 4-component form is UNVERIFIED against
 *      @coinbase/cds-web's real ThemeVars color type. Confirm CDS actually
 *      accepts "r,g,b,a" before shipping; if not, alpha will need to be
 *      applied a different way (e.g. a separate opacity prop) per color.
 *
 *   ⚠ Every shape below (lightColor/darkColor's nested-by-group structure,
 *      typeScale's per-field names, lightSpectrum/darkSpectrum's
 *      PascalCase family keys) is illustrative — @coinbase/cds-web is not
 *      installed anywhere in this repo, so ThemeConfig/ThemeVars's real
 *      shape from "@coinbase/cds-web/core/theme" could not be verified.
 *      Confirm field names against the real types before shipping.
 *
 * DO NOT hand-edit resolved values below without also updating
 * tokens/*.json and re-running the generator — this file should stay a
 * mechanical projection of the Figma export, not a second source of truth.
 */
import type { ThemeConfig } from "@coinbase/cds-web/core/theme";
`;

const spaceSection = `
// ---------------------------------------------------------------------------
// Spacing — resolved from tokens/size.json. Values not divisible by 8
// (CDS's base unit) are recorded above in the file header, not included here.
// ---------------------------------------------------------------------------
export const spaceScale = [
  ${spaceScale.join(", ")},
] as const;
`;

const radiusSection = `
// ---------------------------------------------------------------------------
// Radius — resolved from tokens/radius.json.
// ---------------------------------------------------------------------------
export const radiusScale = {
${radiusEntries.map(([slug, value]) => `  ${jsKey(slug)}: ${value},`).join("\n")}
} as const;
`;

const fontSection = `
// ---------------------------------------------------------------------------
// Typography — fontFamily is a deliberate fixed override (see file header).
// ---------------------------------------------------------------------------
export const fontFamily = {
  primary: "${FONT_FAMILY_PRIMARY}",
} as const;

// Per-role type scale for the web "Large (Default)" size class, resolved
// from tokens/type_primitives.json. fontWeight is a variant name string,
// not a numeric CSS weight — see file header caveat.
export const typeScale = {
${typeScaleRows
  .map(
    (r) =>
      `  ${JSON.stringify(toCamel(r.role))}: { fontSize: ${r.size}, lineHeight: ${r.lineHeight}, letterSpacing: ${r.letterSpacing}, fontWeight: ${JSON.stringify(r.fontWeight)} },`
  )
  .join("\n")}
} as const;
`;

const colorSection = `
// ---------------------------------------------------------------------------
// Color — BLOCKED, see file header. Family/shade sets below are collected
// live from every "{Family.Shade}" alias actually referenced in
// tokens/theme.json's light/dark trees — every value is a TODO_RGB
// placeholder standing in for a primitive that hasn't been exported yet.
// ---------------------------------------------------------------------------
const ${TODO_RGB} = "0,0,0"; // placeholder — replace once primitive families are exported (see file header)

${emitSpectrum("lightSpectrum", lightFamilies)}

${emitSpectrum("darkSpectrum", darkFamilies)}

// Semantic color map — real group/token names from tokens/theme.json,
// leaves reference the spectrum objects above rather than duplicating
// TODO_RGB, so filling in real primitive values later flows through every
// semantic field automatically.
${emitColorTree("lightColor", lightColorTree, "lightSpectrum")}

${emitColorTree("darkColor", darkColorTree, "darkSpectrum")}
`;

const footer = `
/**
 * companyTheme — the object every project's ThemeProvider imports.
 *
 * Custom tokens not already in CDS's ThemeVars (e.g. 'typeScale' above)
 * must be declared via the ThemeVarsExtended namespace before use — see
 * the SKILL.md instructions this file ships alongside.
 */
export const companyTheme: Partial<ThemeConfig> = {
  space: spaceScale,
  radius: radiusScale,
  lightSpectrum,
  darkSpectrum,
  lightColor,
  darkColor,
  typography: {
    fontFamily: fontFamily.primary,
    typeScale,
  },
};

export default companyTheme;
`;

const output = [header, spaceSection, radiusSection, fontSection, colorSection, footer]
  .join("\n")
  .replace(/\n{3,}/g, "\n\n");
writeFileSync(OUT_FILE, output);

console.log(`Wrote ${OUT_FILE}`);
console.log(`  spaceScale: ${spaceScale.length} values (${spaceNonConforming.length} non-8-multiples excluded)`);
console.log(`  radiusScale: ${radiusEntries.length} entries`);
console.log(`  typeScale: ${typeScaleRows.length} roles`);
console.log(`  color families (light/dark): ${lightFamilies.size}/${darkFamilies.size}`);
console.log(`  unresolved color values: ${unresolvedColorCount}`);
if (missingColorFamilies.length) console.log(`  missing color families: ${missingColorFamilies.join(", ")}`);

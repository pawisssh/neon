#!/usr/bin/env node
/**
 * generate-theme-config.mjs
 *
 * Mechanically emits ../theme.config.ts (the `neonTheme` overrides
 * object) and ../color-mapping.todo.md (a human handoff doc) from
 * ../tokens.resolved.json and the raw ../tokens/*.json export.
 * Run `node sync-tokens.mjs` first to (re)produce tokens.resolved.json from
 * whatever is currently in ../tokens/.
 *
 * Both outputs are generated files — do not hand-edit them. Change the
 * source token exports in ../tokens/ and re-run this pipeline instead.
 *
 * `neonTheme`'s shape and key names are verified against the real
 * `@coinbase/cds-web@9.26.1` `ThemeConfig`/`ThemeVars` types (checked in a
 * scratch install — the package isn't installed in this repo). Only fields
 * Finnomena's export has real, unambiguous data for are populated; anything
 * else is left absent so `@coinbase/cds-web`'s own `defaultTheme` values
 * flow through at runtime (see ../createTheme.ts). Color specifically
 * is NEVER guessed here — Finnomena's semantic token names (`text-primary`,
 * `icon-on-brand`, ...) share no vocabulary with CDS's semantic slugs (`fg`,
 * `bgPrimary`, `accentBoldBlue`, ...), so mapping one onto the other is a
 * real design decision. color-mapping.todo.md exists so a human can make
 * that call instead.
 *
 * Usage (full regeneration pipeline — run all four in order after changing
 * anything in tokens/*.json):
 *   node scripts/sync-tokens.mjs && node scripts/generate-theme-config.mjs && node scripts/generate-breakpoints-config.mjs && node scripts/install.mjs --sync-starter
 *
 * The 4th step syncs the regenerated theme files into
 * starters/vitejs-cds/src/theme/ — see sync-tokens.mjs's header for why.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const THEME_DIR = join(__dirname, "..");
const TOKENS_DIR = join(THEME_DIR, "tokens");
const OUT_THEME_FILE = join(THEME_DIR, "theme.config.ts");
const OUT_COLOR_TODO_FILE = join(THEME_DIR, "color-mapping.todo.md");

const resolved = JSON.parse(readFileSync(join(THEME_DIR, "tokens.resolved.json"), "utf8"));
const report = JSON.parse(readFileSync(join(THEME_DIR, "tokens.report.json"), "utf8"));
const rawTheme = JSON.parse(readFileSync(join(TOKENS_DIR, "theme.json"), "utf8"));
const rawColors = JSON.parse(readFileSync(join(TOKENS_DIR, "colors.json"), "utf8"));

// ---------------------------------------------------------------------------
// Fixed, verified facts about the real @coinbase/cds-web@9.26.1 ThemeConfig/
// ThemeVars shape (see theme.config.ts's own header for the full citation).
// Hardcoded because they're platform data, not something Finnomena's export
// can tell us — same category as SPACE/BORDER_RADIUS/FONT_ROLES below.
// ---------------------------------------------------------------------------
const CDS_FONT_ROLES = [
  "display1", "display2", "display3",
  "title1", "title2", "title3", "title4",
  "headline", "body", "label1", "label2", "caption", "legal",
];
const CDS_SPECTRUM_HUES = ["blue", "green", "orange", "yellow", "gray", "indigo", "pink", "purple", "red", "teal", "chartreuse"];
const CDS_SPECTRUM_STEPS = [0, 5, 10, 15, 20, 30, 40, 50, 60, 70, 80, 90, 100];
const CDS_SEMANTIC_COLOR_SLUGS = [
  "currentColor",
  "fg", "fgMuted", "fgInverse", "fgPrimary", "fgWarning", "fgPositive", "fgNegative",
  "bg", "bgAlternate", "bgInverse", "bgOverlay", "bgElevation1", "bgElevation2",
  "bgPrimary", "bgPrimaryWash", "bgSecondary", "bgTertiary", "bgSecondaryWash",
  "bgNegative", "bgNegativeWash", "bgPositive", "bgPositiveWash", "bgWarning", "bgWarningWash",
  "bgLine", "bgLineHeavy", "bgLineInverse", "bgLinePrimary", "bgLinePrimarySubtle",
  "accentSubtleRed", "accentBoldRed", "accentSubtleGreen", "accentBoldGreen",
  "accentSubtleBlue", "accentBoldBlue", "accentSubtlePurple", "accentBoldPurple",
  "accentSubtleYellow", "accentBoldYellow", "accentSubtleGray", "accentBoldGray",
  "transparent",
];

// CDS's `space` step-keys, keyed by the exact px value Finnomena's export
// needs to supply. All 15 are required — buildSpace() throws if any go
// missing from a future re-export rather than silently emitting a gap.
const SPACE_KEY_BY_VALUE = {
  0: "0", 2: "0.25", 4: "0.5", 6: "0.75", 8: "1", 12: "1.5", 16: "2",
  24: "3", 32: "4", 40: "5", 48: "6", 56: "7", 64: "8", 72: "9", 80: "10",
};

// CDS's `borderRadius` step-keys. Only the first 9 have a Finnomena
// equivalent (see buildBorderRadius) — "900" (value 56) is intentionally
// left absent.
const BORDER_RADIUS_KEY_BY_VALUE = {
  0: "0", 4: "100", 8: "200", 12: "300", 16: "400",
  24: "500", 32: "600", 40: "700", 48: "800",
};

// Finnomena role name -> CDS font role. Only same-name (or unambiguous)
// correspondences — this is a first-pass, human-reviewable mapping, same
// spirit as color-mapping.todo.md. title4/label1/label2/caption/legal have
// no confident Finnomena source and are deliberately left out (CDS's
// defaultTheme values apply instead).
const FONT_ROLE_MAP = {
  "Display 1": "display1",
  "Display 2": "display2",
  "Display 3": "display3",
  "Title 1": "title1",
  "Title 2": "title2",
  "Title 3": "title3",
  "Headline": "headline",
  "Body": "body",
};

// Standard CSS font-weight naming convention (not Finnomena-specific) —
// Finnomena's export only has variant *names* ("Regular", "SemiBold"), never
// numeric weights. "Heavy" (not "ExtraBold") is the export's own name for
// 800 — confirmed against tokens/font_weight.json's "800 Heavy" entry.
const WEIGHT_NAME_TO_NUMBER = {
  Thin: 100, ExtraLight: 200, Light: 300, Regular: 400, Medium: 500,
  SemiBold: 600, Bold: 700, Heavy: 800, Black: 900,
};
function weightNameToNumber(name) {
  const base = String(name).replace(/\s*Italic$/, "");
  return WEIGHT_NAME_TO_NUMBER[base];
}

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
// 1. space — resolved numeric entries from size.json, reassigned onto CDS's
//    step-key scale by value. All 15 CDS values are a confirmed subset of
//    size.json's resolved values (see color-mapping.todo.md's sibling
//    research, captured in SKILL.md) — this throws instead of silently
//    dropping a step if a future re-export ever loses one.
// ---------------------------------------------------------------------------
function buildSpace() {
  const values = new Set();
  for (const entry of Object.values(resolved)) {
    if (entry.sourceFile === "size.json" && entry.type === "number") values.add(entry.value);
  }
  const space = {};
  for (const [valueStr, key] of Object.entries(SPACE_KEY_BY_VALUE)) {
    const value = Number(valueStr);
    if (!values.has(value)) {
      throw new Error(`buildSpace: required space value ${value}px not found in tokens/size.json — re-check the export`);
    }
    space[key] = value;
  }
  return space;
}

// ---------------------------------------------------------------------------
// 2. borderRadius — resolved entries from radius.json, reassigned onto CDS's
//    "0".."1000" step-keys by value. CDS's "900" step (56px) has no
//    Finnomena equivalent and is left absent. "round" maps to CDS's "1000"
//    key by INTENT (both mean "fully pill/circular"), not by literal value —
//    CDS uses 100000, Finnomena's export uses 200.
// ---------------------------------------------------------------------------
function buildBorderRadius() {
  const RADIUS_KEY = /\(radius-([\w]+)\)/;
  const bySlug = {};
  for (const [path, entry] of Object.entries(resolved)) {
    if (entry.sourceFile !== "radius.json") continue;
    const m = path.match(RADIUS_KEY);
    if (!m) continue;
    bySlug[m[1] === "0" ? "none" : m[1]] = entry.value;
  }
  const borderRadius = {};
  for (const [valueStr, key] of Object.entries(BORDER_RADIUS_KEY_BY_VALUE)) {
    const match = Object.values(bySlug).find((v) => v === Number(valueStr));
    if (match !== undefined) borderRadius[key] = match;
  }
  if ("round" in bySlug) borderRadius["1000"] = 100000; // by intent, not by Finnomena's literal 200
  return borderRadius;
}

// ---------------------------------------------------------------------------
// 3. typography — read from type_primitives.json's Dynamic["Large
//    (Default)"][role] tree (NOT typography.json's own per-role fields,
//    which are self-referential placeholders in this export — see
//    tokens.report.json's missingRootCollections). Only roles in
//    FONT_ROLE_MAP get real data; every other CDS font role is left absent.
// ---------------------------------------------------------------------------
function buildTypography() {
  const fontSize = {};
  const fontWeight = {};
  const lineHeight = {};
  const skippedRoles = [];

  for (const [finnomenaRole, cdsRole] of Object.entries(FONT_ROLE_MAP)) {
    const base = `Dynamic.Large (Default).${finnomenaRole}.`;
    const size = resolved[base + "Size"]?.value;
    const lh = resolved[base + "Line height"]?.value;
    const weightName = resolved[base + "Weight"]?.value;
    if (size === undefined || lh === undefined) {
      skippedRoles.push(`${finnomenaRole} (missing size/line-height data)`);
      continue;
    }
    fontSize[cdsRole] = `${size}px`;
    lineHeight[cdsRole] = `${lh}px`;
    const weightNumber = weightName !== undefined ? weightNameToNumber(weightName) : undefined;
    if (weightNumber !== undefined) fontWeight[cdsRole] = String(weightNumber);
    else skippedRoles.push(`${finnomenaRole} (unrecognized weight name "${weightName}")`);
  }

  const fontFamily = {};
  for (const role of CDS_FONT_ROLES) fontFamily[role] = FONT_FAMILY_PRIMARY;

  return { fontFamily, fontSize, fontWeight, lineHeight, skippedRoles };
}

// ---------------------------------------------------------------------------
// 4. Color reference table (for color-mapping.todo.md, NOT theme.config.ts).
//    Reuses the alias-resolution walk to show a human exactly what each
//    Finnomena semantic leaf currently resolves to, as a reference data
//    point for making the real mapping decision — never emitted into
//    neonTheme itself.
// ---------------------------------------------------------------------------
const EXCLUDED_GROUPS = new Set(["Figma", "Mode", "Colors"]);
const GROUP_NAMES = new Set([...Object.keys(rawTheme.light), ...Object.keys(rawTheme.dark)]);

/** Resolve a "{Family.Shade}" (or intra-theme "{Group.leaf}") alias down to a real [family, shade] pair, or null. */
function resolveFamilyShade(mode, raw, depth = 0) {
  if (depth > 10) return null;
  const fs = parseFamilyShadeAlias(raw);
  if (!fs) return null;
  const [head, tail] = fs;
  if (!GROUP_NAMES.has(head)) return fs;
  const target = rawTheme[mode]?.[head]?.[tail];
  if (!isLeaf(target) || target.type !== "color") return null;
  return resolveFamilyShade(mode, target.value, depth + 1);
}

function primitiveValue(family, shade) {
  const entry = resolved[`${family}.${shade}`];
  return entry && entry.type === "color" ? entry.value : undefined;
}

/** Flat list of {path, family, shade, value} for every resolvable color leaf in theme.json[mode]. */
function buildColorReference(mode) {
  const rows = [];
  function walk(pathParts, node) {
    if (isLeaf(node)) {
      if (node.type !== "color") return;
      const fs = resolveFamilyShade(mode, node.value);
      if (!fs) {
        rows.push({ path: pathParts.join("."), family: null, shade: null, value: null, raw: node.value });
        return;
      }
      const [family, shade] = fs;
      rows.push({ path: pathParts.join("."), family, shade, value: primitiveValue(family, shade) });
      return;
    }
    if (node && typeof node === "object") {
      for (const [key, child] of Object.entries(node)) walk([...pathParts, key], child);
    }
  }
  for (const [group, node] of Object.entries(rawTheme[mode])) {
    if (EXCLUDED_GROUPS.has(group)) continue;
    walk([group], node);
  }
  return rows;
}

// ---------------------------------------------------------------------------
// Build everything
// ---------------------------------------------------------------------------
const space = buildSpace();
const borderRadius = buildBorderRadius();
const { fontFamily, fontSize, fontWeight, lineHeight, skippedRoles } = buildTypography();
const finnomenaFamilies = Object.keys(rawColors);

// ---------------------------------------------------------------------------
// Render theme.config.ts
// ---------------------------------------------------------------------------
const header = `/**
 * neonTheme — Finnomena's override fields for @coinbase/cds-web's
 * ThemeConfig, merged onto CDS's own defaultTheme at runtime by
 * ./createTheme.ts (see that file — ThemeProvider requires a FULL
 * ThemeConfig, and neonTheme here is deliberately partial).
 *
 * GENERATED FILE — do not hand-edit. Regenerate with:
 *   node scripts/sync-tokens.mjs && node scripts/generate-theme-config.mjs
 *
 * Source of truth: the raw Figma Token Studio export in ./tokens/*.json,
 * resolved by ./scripts/sync-tokens.mjs into ./tokens.resolved.json.
 *
 * STATUS (regenerated ${report.generatedAt}):
 *
 *   ✅ space — all 15 of CDS's required step-keys ("0" through "10", plus
 *      "0.25"/"0.5"/"0.75") populated from tokens/size.json.
 *
 *   ✅ borderRadius — 9 of CDS's 11 step-keys ("0" through "800") populated
 *      from tokens/radius.json by value; "1000" (fully round) mapped by
 *      INTENT to Finnomena's "round" slug, not by literal number (CDS uses
 *      100000, Finnomena's export uses 200). "900" (56px) has no Finnomena
 *      equivalent and is left absent — CDS's defaultTheme value flows
 *      through for that one step at runtime.
 *
 *   ✅ fontFamily — fixed to ${JSON.stringify(FONT_FAMILY_PRIMARY)} across all 13 CDS font
 *      roles (a confirmed decision, not the export's actual family name,
 *      "${FONT_FAMILY_EXPORT_NAME}").
 *
 *   ⚠ fontSize / fontWeight / lineHeight — populated for ONLY the CDS font
 *      roles with an unambiguous same-name Finnomena counterpart:
 *      ${Object.entries(FONT_ROLE_MAP).map(([f, c]) => `${c}←"${f}"`).join(", ")}.
 *      This is a first-pass, human-reviewable mapping (${Object.keys(FONT_ROLE_MAP).length} of 13 CDS roles) — title4/label1/label2/
 *      caption/legal have no confident Finnomena source and are left absent
 *      (CDS's defaultTheme values apply instead). fontSize/lineHeight are
 *      emitted as "Npx" strings (Finnomena's exact resolved pixel values —
 *      valid CSS; CDS's own defaultTheme uses rem, but px avoids inventing
 *      an unstated root-font-size assumption). fontWeight is converted from
 *      Finnomena's variant-name strings ("Regular","SemiBold",...) via the
 *      standard CSS numeric-weight convention, not Finnomena-specific data.
 *      ${skippedRoles.length ? `Skipped this run: ${skippedRoles.join("; ")}.` : ""}
 *
 *   ⛔ COLOR — DELIBERATELY NOT POPULATED. lightSpectrum/darkSpectrum/
 *      lightColor/darkColor/lightIllustrationColor/darkIllustrationColor are
 *      not emitted at all. Finnomena's theme.json semantic names
 *      (text-primary, icon-on-brand, ...) share no vocabulary with CDS's
 *      semantic slugs (fg, bgPrimary, accentBoldBlue, ...) — mapping one
 *      onto the other is a real design decision, not a data-mapping
 *      problem, and this generator does not guess it. CDS's own default
 *      brand colors (Coinbase blue, etc.) render until a human fills in
 *      ./color-mapping.todo.md (also regenerated by this script) and this
 *      generator is extended to consume it. Do not tell a user their
 *      mockup's colors are on-brand until that's done.
 *
 *   Left entirely at CDS's default (confirmed: no Finnomena data exists for
 *   these at all — not a judgment call, nothing to draw from): iconSize,
 *   avatarSize, borderWidth (as a general scale — only scattered
 *   per-component stroke-weight overrides exist, not a real scale),
 *   controlSize, textTransform, shadow, fontFamilyMono.
 *
 * DO NOT hand-edit resolved values below without also updating
 * tokens/*.json and re-running the generator — this file should stay a
 * mechanical projection of the Figma export, not a second source of truth.
 */
`;

const spaceSection = `
// ---------------------------------------------------------------------------
// space — resolved from tokens/size.json, keyed to CDS's ThemeVars.Space.
// ---------------------------------------------------------------------------
export const space = {
${Object.entries(space).map(([key, value]) => `  ${jsKey(key)}: ${value},`).join("\n")}
} as const;
`;

const borderRadiusSection = `
// ---------------------------------------------------------------------------
// borderRadius — resolved from tokens/radius.json, keyed to CDS's
// ThemeVars.BorderRadius. See file header for the "900" gap and the
// "round"→"1000" by-intent mapping.
// ---------------------------------------------------------------------------
export const borderRadius = {
${Object.entries(borderRadius).map(([key, value]) => `  ${jsKey(key)}: ${value},`).join("\n")}
} as const;
`;

const typographySection = `
// ---------------------------------------------------------------------------
// Typography — flat per-role maps matching CDS's ThemeVars.FontFamily/
// FontSize/FontWeight/LineHeight (all alias the same 13 role keys). See
// file header for which roles have real Finnomena data vs. are left absent.
// ---------------------------------------------------------------------------
export const fontFamily = {
${Object.entries(fontFamily).map(([key, value]) => `  ${jsKey(key)}: ${JSON.stringify(value)},`).join("\n")}
} as const;

export const fontSize = {
${Object.entries(fontSize).map(([key, value]) => `  ${jsKey(key)}: ${JSON.stringify(value)},`).join("\n")}
} as const;

export const fontWeight = {
${Object.entries(fontWeight).map(([key, value]) => `  ${jsKey(key)}: ${JSON.stringify(value)},`).join("\n")}
} as const;

export const lineHeight = {
${Object.entries(lineHeight).map(([key, value]) => `  ${jsKey(key)}: ${JSON.stringify(value)},`).join("\n")}
} as const;
`;

const footer = `
/**
 * neonTheme — the partial ThemeConfig overrides every project merges onto
 * CDS's defaultTheme via ./createTheme.ts's createNeonTheme(). Deliberately
 * NOT typed as Partial<ThemeConfig> here — see that file for why, and for
 * where the real, complete ThemeConfig gets assembled.
 *
 * Custom tokens not already in CDS's ThemeVars must be declared via the
 * ThemeVarsExtended namespace before use — see the SKILL.md instructions
 * this file ships alongside.
 */
export const neonTheme = {
  space,
  borderRadius,
  fontFamily,
  fontSize,
  fontWeight,
  lineHeight,
};

export default neonTheme;
`;

const themeOutput = [header, spaceSection, borderRadiusSection, typographySection, footer]
  .join("\n")
  .replace(/\n{3,}/g, "\n\n");
writeFileSync(OUT_THEME_FILE, themeOutput);

// ---------------------------------------------------------------------------
// Render color-mapping.todo.md
// ---------------------------------------------------------------------------
const cdsFamilyNameMatches = CDS_SPECTRUM_HUES.filter((hue) =>
  finnomenaFamilies.some((f) => f.toLowerCase() === hue.toLowerCase())
);
const cdsHuesWithNoMatch = CDS_SPECTRUM_HUES.filter((h) => !cdsFamilyNameMatches.includes(h));
const finnomenaFamiliesWithNoCdsHue = finnomenaFamilies.filter(
  (f) => !CDS_SPECTRUM_HUES.some((h) => h.toLowerCase() === f.toLowerCase())
);

function renderColorReferenceSection(mode) {
  const rows = buildColorReference(mode);
  const lines = rows.map((r) =>
    r.family
      ? `- \`${r.path}\` → \`${r.family}.${r.shade}\` = \`${r.value ?? "(no primitive value found)"}\``
      : `- \`${r.path}\` → unresolved alias \`${r.raw}\``
  );
  return lines.join("\n");
}

const colorTodo = `# Color mapping — TODO (human decision required)

**Generated ${report.generatedAt} by \`generate-theme-config.mjs\`. Do not hand-edit
the lists below without re-running the generator — but DO fill in your
mapping decisions in a separate file once made (see "Next step" at the
bottom); this file itself gets overwritten every run.**

Finnomena's design tokens use role/usage-based semantic names
(\`text-primary\`, \`icon-on-brand\`, \`border-disabled\`). CDS's \`ThemeConfig\`
uses a completely different naming system: abstract UI-role slugs mixed with
explicit color-family+intensity slugs (\`fg\`, \`bgPrimary\`, \`accentBoldBlue\`).
There is no shared vocabulary to bridge these automatically — assigning,
for example, which Finnomena shade becomes \`bgPrimary\` vs. \`accentBoldBlue\`
is a brand/design decision. This generator will not guess it. Until someone
does, CDS's own default brand colors (Coinbase blue, etc.) render instead of
Finnomena's.

## 1. CDS spectrum hues (11) needing a Finnomena family assignment

Each hue needs 13 steps assigned (\`${CDS_SPECTRUM_STEPS.join(", ")}\`).

**Same-name Finnomena family exists** (still needs per-step shade
confirmation — same name does not guarantee the intended lightness/hue
position matches CDS's intent at each step):
${cdsFamilyNameMatches.map((h) => `- \`${h}\` ← candidate: Finnomena's \`${finnomenaFamilies.find((f) => f.toLowerCase() === h.toLowerCase())}\` family`).join("\n") || "- (none)"}

**No Finnomena family with a matching name — needs an explicit decision:**
${cdsHuesWithNoMatch.map((h) => `- \`${h}\` — no obvious source`).join("\n") || "- (none)"}

## 2. Finnomena families with no CDS hue slot

These don't fit any of CDS's 11 fixed hues at all — decide whether they
should be dropped, or folded into the closest existing hue:
${finnomenaFamiliesWithNoCdsHue.map((f) => `- \`${f}\``).join("\n") || "- (none)"}

## 3. CDS semantic color slugs (${CDS_SEMANTIC_COLOR_SLUGS.length}) — all UNASSIGNED

Each needs a light-mode and dark-mode value (a spectrum reference once §1 is
resolved, or a direct value):

${CDS_SEMANTIC_COLOR_SLUGS.map((s) => `- \`${s}\``).join("\n")}

## 4. Reference — what Finnomena's own semantic tokens currently resolve to

Not a mapping — just data to inform the decisions above. Read from
\`tokens/theme.json\`, resolved down to a primitive family/shade via the same
alias-walking logic \`generate-theme-config.mjs\` uses internally.

### Light mode

${renderColorReferenceSection("light")}

### Dark mode

${renderColorReferenceSection("dark")}

## Next step

Once a human has decided the mapping, it needs a real place to live and a
generator update to consume it — neither exists yet (deliberately, to avoid
building a mechanism for a decision nobody's made). Options to consider at
that point: a small hand-written \`theme/color-overrides.ts\` merged in by
\`createTheme.ts\` alongside \`theme.config.ts\`'s \`neonTheme\`, or a new
\`tokens/color-mapping.json\` input this script learns to read. Don't build
either speculatively before the mapping itself exists.
`;

writeFileSync(OUT_COLOR_TODO_FILE, colorTodo);

console.log(`Wrote ${OUT_THEME_FILE}`);
console.log(`  space: ${Object.keys(space).length}/15 keys`);
console.log(`  borderRadius: ${Object.keys(borderRadius).length}/11 keys`);
console.log(`  fontFamily: ${Object.keys(fontFamily).length}/13 roles`);
console.log(`  fontSize/fontWeight/lineHeight: ${Object.keys(fontSize).length}/13 roles populated`);
if (skippedRoles.length) console.log(`  skipped roles: ${skippedRoles.join("; ")}`);
console.log(`Wrote ${OUT_COLOR_TODO_FILE}`);
console.log(`  spectrum hues with a name match: ${cdsFamilyNameMatches.length}/${CDS_SPECTRUM_HUES.length}`);
console.log(`  semantic slugs needing assignment: ${CDS_SEMANTIC_COLOR_SLUGS.length}`);

#!/usr/bin/env node
/**
 * install.mjs — deploys Finnomena's CDS theme into a target project.
 *
 * Usage:
 *   node install.mjs <target-dir> --new         # scaffold a new project
 *                                                # from starters/vitejs-cds/
 *   node install.mjs <target-dir>                # theme an existing project
 *                                                # (full CDS)
 *   node install.mjs <target-dir> --css-only     # copy theme.css only
 *                                                # (no CDS install)
 *   node install.mjs --sync-starter              # sync theme files into
 *                                                # starters/vitejs-cds/ itself
 *
 * --new:          copies starters/vitejs-cds/ into <target-dir> verbatim
 *                 (its src/theme/ already carries the 4 theme files — see
 *                 --sync-starter below) and runs npm install. Refuses to
 *                 run into a non-empty directory.
 *
 * (default):      copies the 4 theme files into <target-dir>/src/theme/,
 *                 installs @coinbase/cds-web if not already a dependency.
 *                 Never touches provider wiring or component code.
 *
 * --css-only:     copies only theme.css into <target-dir>/src/theme/ (or
 *                 wherever the project keeps global styles). No
 *                 @coinbase/cds-web install, no React provider needed —
 *                 just CSS custom properties.
 *
 * --sync-starter: takes no <target-dir> — copies the 4 theme files into
 *                 this repo's own starters/vitejs-cds/src/theme/, nothing
 *                 else (no package.json read, no npm call). This is a pure
 *                 file copy, deliberately kept separate from the
 *                 existing-project branch above (which has npm side
 *                 effects) so re-running it after a token regen is always
 *                 safe. Run this as part of the token-regeneration pipeline
 *                 (see sync-tokens.mjs's header) to keep the starter's
 *                 theme files from drifting out of sync.
 */
import { constants, existsSync, mkdirSync, readdirSync, readFileSync, copyFileSync, cpSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { parseArgs } from "node:util";

const __dirname = dirname(fileURLToPath(import.meta.url));
const THEME_DIR = join(__dirname, "..");
const REPO_ROOT = join(__dirname, "..", "..", "..");
const STARTER_DIR = join(REPO_ROOT, "starters", "vitejs-cds");

const THEME_FILES = ["theme.config.ts", "color-overrides.ts", "createTheme.ts", "breakpoints.config.ts"];

const { values, positionals } = parseArgs({
  options: {
    new: { type: "boolean" },
    "css-only": { type: "boolean" },
    "sync-starter": { type: "boolean" },
  },
  strict: true,
  allowPositionals: true,
});
const isNew = values.new === true;
const isCssOnly = values["css-only"] === true;
const isSyncStarter = values["sync-starter"] === true;

if ([isNew, isCssOnly, isSyncStarter].filter(Boolean).length > 1) {
  console.error("--new, --css-only, and --sync-starter are mutually exclusive.");
  process.exit(1);
}

if (positionals.length !== (isSyncStarter ? 0 : 1)) {
  console.error("Usage: node install.mjs <target-dir> [--new | --css-only]");
  console.error("   or: node install.mjs --sync-starter");
  process.exit(1);
}

const targetDir = isSyncStarter ? undefined : resolve(positionals[0]);

function copyThemeFiles(destThemeDir, filenames = THEME_FILES) {
  // Validate every source and destination before making any changes.
  const pending = [];
  for (const file of filenames) {
    const src = join(THEME_DIR, file);
    const dest = join(destThemeDir, file);
    const source = readFileSync(src);
    if (!isSyncStarter && existsSync(dest)) {
      if (!source.equals(readFileSync(dest))) {
        throw new Error(`Refusing to overwrite customized file: ${dest}`);
      }
      continue;
    }
    pending.push({ src, dest });
  }
  mkdirSync(destThemeDir, { recursive: true });
  for (const { src, dest } of pending) {
    copyFileSync(src, dest, isSyncStarter ? 0 : constants.COPYFILE_EXCL);
  }
  console.log(`Copied ${pending.length} theme files into ${destThemeDir}`);
}

function run(cmd, cmdArgs, cwd) {
  console.log(`> ${cmd} ${cmdArgs.join(" ")}`);
  const result = spawnSync(cmd, cmdArgs, { cwd, stdio: "inherit", shell: process.platform === "win32" });
  if (result.error) {
    console.error(`Failed to run "${cmd}": ${result.error.message}`);
    process.exit(1);
  }
  if (result.status !== 0) {
    console.error(`Command failed (exit ${result.status}): ${cmd} ${cmdArgs.join(" ")}`);
    process.exit(result.status ?? 1);
  }
}

if (isSyncStarter) {
  // Pure file copy only — no package.json read, no npm call. Safe to run
  // unconditionally as part of the token-regeneration pipeline.
  copyThemeFiles(join(STARTER_DIR, "src", "theme"));
  console.log("Synced theme files into starters/vitejs-cds/src/theme/.");
} else if (isCssOnly) {
  // CSS-only mode: copy just theme.css, no CDS install
  const destThemeDir = join(targetDir, "src", "theme");
  copyThemeFiles(destThemeDir, ["theme.css"]);
  console.log(
    `\nDone. Import it once (e.g. \`import "./theme/theme.css"\`) and use var(--color-fg), var(--space-2), etc.`
  );
} else if (isNew) {
  if (existsSync(targetDir) && readdirSync(targetDir).length > 0) {
    console.error(`Refusing to scaffold into non-empty directory: ${targetDir}`);
    process.exit(1);
  }
  console.log(`Scaffolding new project into ${targetDir} from ${STARTER_DIR}`);
  cpSync(STARTER_DIR, targetDir, { recursive: true });
  run("npm", ["install"], targetDir);
  console.log(`\nDone. Next: cd ${targetDir} && npm run dev`);
} else {
  const pkgPath = join(targetDir, "package.json");
  if (!existsSync(pkgPath)) {
    console.error(`No package.json found at ${pkgPath} — is this an existing project?`);
    process.exit(1);
  }
  const pkg = JSON.parse(readFileSync(pkgPath, "utf8"));
  copyThemeFiles(join(targetDir, "src", "theme"));
  const hasCds = Boolean(pkg.dependencies?.["@coinbase/cds-web"] || pkg.devDependencies?.["@coinbase/cds-web"]);
  if (hasCds) {
    console.log("@coinbase/cds-web already a dependency — skipping install.");
  } else {
    run("npm", ["install", "@coinbase/cds-web"], targetDir);
  }
  console.log(
    `\nDone. Theme files copied into ${targetDir}/src/theme/. Wire up MediaQueryProvider -> ThemeProvider -> PortalProvider next.`
  );
}

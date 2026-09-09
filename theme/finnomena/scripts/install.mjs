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
 *                 --sync-starter below) and installs its declared
 *                 dependencies. Refuses to run into a non-empty directory.
 *
 * (default):      copies the 4 theme files into <target-dir>/src/theme/
 *                 (or --theme-dir, if given), installs @coinbase/cds-web
 *                 (pinned to the version range declared in
 *                 starters/vitejs-cds/package.json) if not already a
 *                 dependency. Never touches provider wiring or component
 *                 code.
 *
 * --css-only:     copies only theme.css into <target-dir>/src/theme/ (or
 *                 --theme-dir, or wherever the project keeps global
 *                 styles). No @coinbase/cds-web install, no React provider
 *                 needed — just CSS custom properties.
 *
 * --sync-starter: takes no <target-dir> — copies the 4 theme files into
 *                 this repo's own starters/vitejs-cds/src/theme/, nothing
 *                 else (no package.json read, no npm call, no --theme-dir/
 *                 --package-manager/--skip-install support — those only
 *                 apply to modes that take a <target-dir>). This is a pure
 *                 file copy, deliberately kept separate from the
 *                 existing-project branch above (which has npm side
 *                 effects) so re-running it after a token regen is always
 *                 safe. Run this as part of the token-regeneration pipeline
 *                 (see sync-tokens.mjs's header) to keep the starter's
 *                 theme files from drifting out of sync.
 *
 * --theme-dir <project-relative-dir>: overrides the default "src/theme"
 *                 destination for (default)/--css-only. Validated to stay
 *                 inside <target-dir> before anything is written (see
 *                 resolveThemeDir below) — rejects absolute paths, paths
 *                 that resolve outside <target-dir>, and paths that pass
 *                 through a symlinked ancestor that resolves outside
 *                 <target-dir>. Not accepted with --new: the scaffolded
 *                 starter's own source (AppRoot.tsx etc.) imports theme
 *                 files from a fixed "src/theme" path, so moving that
 *                 destination would silently break the scaffolded app.
 *
 * --package-manager <npm|pnpm|yarn|bun>: overrides package-manager
 *                 detection (see project-config.mjs's selectPackageManager)
 *                 for --new's post-scaffold install and (default)'s CDS
 *                 install.
 *
 * --skip-install: scaffold/copy files but never invoke a package manager.
 *                 Applies to --new and (default), the only modes that ever
 *                 run an install. The console output explicitly reports
 *                 dependencies as not installed — this flag must never
 *                 produce an unqualified "Done" success message.
 */
import {
  constants,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  copyFileSync,
  cpSync,
  realpathSync,
} from "node:fs";
import { dirname, join, resolve, relative, isAbsolute } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { spawnSync } from "node:child_process";
import { parseArgs } from "node:util";
import { selectPackageManager, dependencyCommand } from "./project-config.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const THEME_DIR = join(__dirname, "..");
const REPO_ROOT = join(__dirname, "..", "..", "..");
const STARTER_DIR = join(REPO_ROOT, "starters", "vitejs-cds");

const THEME_FILES = ["theme.config.ts", "color-overrides.ts", "createTheme.ts", "breakpoints.config.ts"];
const LOCKFILE_NAMES = ["package-lock.json", "npm-shrinkwrap.json", "pnpm-lock.yaml", "yarn.lock", "bun.lockb", "bun.lock"];

/**
 * Builds the spawnSync options for a given platform, kept as a small pure
 * function — with no dependency on parsed CLI state — so the win32-vs-other
 * branch is independently unit-testable (see tests/install.test.mjs) by
 * importing this module and calling it directly, without actually running
 * on Windows or triggering the CLI logic below (guarded by isMainModule).
 * This is unit-level verification of the branch logic only — it does not
 * exercise a real Windows launch.
 *
 * Only Windows needs `shell: true` for spawnSync to correctly resolve
 * managers installed as .cmd shims (npm, pnpm, yarn, bun all ship this way
 * there).
 */
export function buildSpawnOptions(cwd, platform) {
  return { cwd, stdio: "inherit", shell: platform === "win32" };
}

/**
 * Validates that a project-relative theme directory stays inside
 * targetDir before anything is written. Rejects (throws):
 *   - an absolute themeDirRelative
 *   - a resolved path outside targetDir (via path.relative)
 *   - a path that passes through an existing ancestor symlink resolving
 *     outside targetDir
 * Returns the resolved absolute destination directory on success. Exported
 * (alongside buildSpawnOptions) purely so tests can exercise it directly.
 */
export function resolveThemeDir(baseTargetDir, themeDirRelative) {
  if (isAbsolute(themeDirRelative)) {
    throw new Error(`--theme-dir must be a project-relative path, got an absolute path: ${themeDirRelative}`);
  }
  const resolved = resolve(baseTargetDir, themeDirRelative);
  const rel = relative(baseTargetDir, resolved);
  if (rel === "") {
    throw new Error(`--theme-dir must not resolve to the target directory itself: ${themeDirRelative}`);
  }
  if (rel.startsWith("..") || isAbsolute(rel)) {
    throw new Error(`--theme-dir escapes the target directory: ${themeDirRelative}`);
  }

  // Walk up from the resolved path to find the deepest ancestor that
  // actually exists on disk, then realpath it — if that realpath falls
  // outside targetDir, some ancestor component is a symlink escaping the
  // target directory.
  let ancestor = resolved;
  while (!existsSync(ancestor)) {
    const parent = dirname(ancestor);
    if (parent === ancestor) break; // reached filesystem root, safety net
    ancestor = parent;
  }
  if (existsSync(ancestor) && existsSync(baseTargetDir)) {
    const realAncestor = realpathSync(ancestor);
    const realTarget = realpathSync(baseTargetDir);
    const realRel = relative(realTarget, realAncestor);
    if (realRel.startsWith("..") || isAbsolute(realRel)) {
      throw new Error(
        `--theme-dir resolves outside the target directory via a symlinked ancestor: ${themeDirRelative}`
      );
    }
  }

  return resolved;
}

function copyThemeFiles(destThemeDir, filenames, isSyncStarter) {
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
  const result = spawnSync(cmd, cmdArgs, buildSpawnOptions(cwd, process.platform));
  if (result.error) {
    console.error(`Failed to run "${cmd}": ${result.error.message}`);
    process.exit(1);
  }
  if (result.status !== 0) {
    console.error(`Command failed (exit ${result.status}): ${cmd} ${cmdArgs.join(" ")}`);
    process.exit(result.status ?? 1);
  }
}

/** Reads the CDS dependency's declared version range from the starter's own package.json. */
function declaredCdsVersion() {
  const starterPkg = JSON.parse(readFileSync(join(STARTER_DIR, "package.json"), "utf8"));
  const version = starterPkg.dependencies?.["@coinbase/cds-web"];
  if (!version) {
    throw new Error(`starters/vitejs-cds/package.json does not declare a @coinbase/cds-web version.`);
  }
  return version;
}

/** Lists lockfile basenames present directly in dir (non-recursive, missing dir is fine). */
function findLockfiles(dir) {
  if (!existsSync(dir)) return [];
  const entries = new Set(readdirSync(dir));
  return LOCKFILE_NAMES.filter((name) => entries.has(name));
}

/**
 * Walks up from startDir through parent directories looking for
 * package-manager evidence (a lockfile, or a package.json declaring
 * "packageManager") — the same technique npm/yarn/pnpm/corepack use to
 * discover a workspace root. An individual monorepo app directory (e.g.
 * apps/portal/) typically has neither on its own: the lockfile and the
 * packageManager field usually live only at the workspace root, so
 * checking only the app directory itself finds nothing and silently falls
 * back to npm — which would plant a stray npm-generated lockfile inside a
 * pnpm-managed monorepo.
 *
 * Checks startDir itself first, then each parent in turn. Stops at the
 * first ancestor carrying ANY evidence (a lockfile, or a declared
 * packageManager) and returns it. Gives up (returns no evidence) at
 * whichever comes first: the filesystem root, or an ancestor with no
 * package.json at all — a proxy for "we've left the project tree", so
 * this doesn't walk indefinitely up unrelated parent directories (e.g. a
 * user's home directory).
 *
 * This only widens where evidence is *gathered* — it does not change
 * where a dependency install actually *runs* (still startDir, via this
 * function's caller, resolveManager).
 */
function findPackageManagerEvidence(startDir) {
  let dir = startDir;
  for (;;) {
    const lockfiles = findLockfiles(dir);
    const pkgPath = join(dir, "package.json");
    const hasPkg = existsSync(pkgPath);
    let declared;
    if (hasPkg) {
      try {
        declared = JSON.parse(readFileSync(pkgPath, "utf8")).packageManager;
      } catch {
        // Malformed package.json at this ancestor — no declared evidence here.
      }
    }
    if (lockfiles.length > 0 || declared) {
      return { lockfiles, declared };
    }
    if (!hasPkg) {
      return { lockfiles: [], declared: undefined };
    }
    const parent = dirname(dir);
    if (parent === dir) {
      return { lockfiles: [], declared: undefined };
    }
    dir = parent;
  }
}

/**
 * Resolves the package manager to use for `dir`'s dependency install,
 * walking up to a workspace root for evidence if `dir` itself has none
 * (see findPackageManagerEvidence). The install itself still runs in
 * `dir` — only evidence-gathering walks up.
 */
function resolveManager(dir, packageManagerOverride) {
  const evidence = findPackageManagerEvidence(dir);
  return selectPackageManager({
    declared: evidence.declared,
    lockfiles: evidence.lockfiles,
    override: packageManagerOverride,
  });
}

// Only run the CLI when this file is executed directly (`node install.mjs
// ...`, including the existing tests' spawnSync subprocess invocations) —
// not when it's imported as a module (e.g. by tests importing
// buildSpawnOptions/resolveThemeDir directly), which would otherwise run
// parseArgs against the importing process's own argv. Compared via
// realpathSync (not a bare path.resolve) because Node's module loader
// realpath-resolves import.meta.url, so an invocation through a symlinked
// path (e.g. macOS's /tmp -> /private/tmp) would otherwise never match.
function isRunAsScript() {
  if (!process.argv[1]) return false;
  try {
    return import.meta.url === pathToFileURL(realpathSync(process.argv[1])).href;
  } catch {
    return false;
  }
}
if (isRunAsScript()) {
  main();
}

function main() {
  const { values, positionals } = parseArgs({
    options: {
      new: { type: "boolean" },
      "css-only": { type: "boolean" },
      "sync-starter": { type: "boolean" },
      "theme-dir": { type: "string" },
      "package-manager": { type: "string" },
      "skip-install": { type: "boolean" },
    },
    strict: true,
    allowPositionals: true,
  });
  const isNew = values.new === true;
  const isCssOnly = values["css-only"] === true;
  const isSyncStarter = values["sync-starter"] === true;
  const themeDirOverride = values["theme-dir"];
  const packageManagerOverride = values["package-manager"];
  const skipInstall = values["skip-install"] === true;

  if ([isNew, isCssOnly, isSyncStarter].filter(Boolean).length > 1) {
    console.error("--new, --css-only, and --sync-starter are mutually exclusive.");
    process.exit(1);
  }

  if (positionals.length !== (isSyncStarter ? 0 : 1)) {
    console.error(
      "Usage: node install.mjs <target-dir> [--new | --css-only] [--theme-dir <dir>] [--package-manager <npm|pnpm|yarn|bun>] [--skip-install]"
    );
    console.error("   or: node install.mjs --sync-starter");
    process.exit(1);
  }

  if (isSyncStarter && (themeDirOverride !== undefined || packageManagerOverride !== undefined || skipInstall)) {
    console.error("--theme-dir, --package-manager, and --skip-install are not valid with --sync-starter.");
    process.exit(1);
  }

  if (isNew && themeDirOverride !== undefined) {
    console.error(
      "--theme-dir is not supported with --new: the scaffolded starter's own source imports theme files " +
        "from a fixed src/theme path, so moving that destination would break the scaffolded app."
    );
    process.exit(1);
  }

  const targetDir = isSyncStarter ? undefined : resolve(positionals[0]);

  if (isSyncStarter) {
    // Pure file copy only — no package.json read, no npm call. Safe to run
    // unconditionally as part of the token-regeneration pipeline.
    copyThemeFiles(join(STARTER_DIR, "src", "theme"), THEME_FILES, true);
    console.log("Synced theme files into starters/vitejs-cds/src/theme/.");
  } else if (isCssOnly) {
    // CSS-only mode: copy just theme.css, no CDS install
    const destThemeDir =
      themeDirOverride !== undefined ? resolveThemeDir(targetDir, themeDirOverride) : join(targetDir, "src", "theme");
    copyThemeFiles(destThemeDir, ["theme.css"], false);
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
    const manager = resolveManager(targetDir, packageManagerOverride);
    if (skipInstall) {
      console.log(
        `\n--skip-install: dependencies were NOT installed. Run \`${manager} install\` in ${targetDir} yourself.`
      );
      console.log(`Files copied into ${targetDir}. Dependencies not installed.`);
    } else {
      const hasLockfile = existsSync(join(targetDir, "package-lock.json"));
      const { command, args } = dependencyCommand(manager, [], { ci: hasLockfile });
      run(command, args, targetDir);
      console.log(`\nDone. Next: cd ${targetDir} && ${manager} run dev`);
    }
  } else {
    const pkgPath = join(targetDir, "package.json");
    if (!existsSync(pkgPath)) {
      console.error(`No package.json found at ${pkgPath} — is this an existing project?`);
      process.exit(1);
    }
    const pkg = JSON.parse(readFileSync(pkgPath, "utf8"));
    const destThemeDir =
      themeDirOverride !== undefined ? resolveThemeDir(targetDir, themeDirOverride) : join(targetDir, "src", "theme");
    copyThemeFiles(destThemeDir, THEME_FILES, false);
    const hasCds = Boolean(pkg.dependencies?.["@coinbase/cds-web"] || pkg.devDependencies?.["@coinbase/cds-web"]);
    if (hasCds) {
      console.log("@coinbase/cds-web already a dependency — skipping install.");
    } else if (skipInstall) {
      console.log(
        `\n--skip-install: dependencies were NOT installed. @coinbase/cds-web@${declaredCdsVersion()} still needs to be added.`
      );
    } else {
      const manager = resolveManager(targetDir, packageManagerOverride);
      const { command, args } = dependencyCommand(manager, [`@coinbase/cds-web@${declaredCdsVersion()}`]);
      run(command, args, targetDir);
    }
    const installedNote = skipInstall && !hasCds ? " Dependencies not installed (--skip-install)." : "";
    console.log(
      `\nDone. Theme files copied into ${destThemeDir}. Wire up MediaQueryProvider -> ThemeProvider -> PortalProvider next.${installedNote}`
    );
  }
}

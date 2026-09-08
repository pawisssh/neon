/**
 * project-config.mjs — pure helpers for picking a package manager and
 * building its argv-array commands. No shell interpolation, no filesystem
 * or process access: every input here is an inspection result the caller
 * (install.mjs) has already gathered (a declared `packageManager` field,
 * a list of lockfile basenames found on disk, an explicit CLI override).
 * Keeping this pure makes it cheap to unit test every branch — including
 * conflict/reject cases — without spawning processes or touching a real
 * filesystem.
 */

export const SUPPORTED_MANAGERS = ["npm", "pnpm", "yarn", "bun"];

const LOCKFILE_TO_MANAGER = {
  "package-lock.json": "npm",
  "npm-shrinkwrap.json": "npm",
  "pnpm-lock.yaml": "pnpm",
  "yarn.lock": "yarn",
  "bun.lockb": "bun",
  "bun.lock": "bun",
};

/**
 * Picks a package manager from evidence, in priority order:
 *   1. an explicit override (e.g. --package-manager) — must be supported
 *   2. a declared manager (package.json's "packageManager" field, e.g.
 *      "pnpm@9.0.0") — only honored if it names a supported manager;
 *      an unrecognized declared value is ignored rather than rejected,
 *      falling through to lockfile evidence
 *   3. lockfiles present in the project — must all agree on one manager;
 *      conflicting lockfiles (e.g. both yarn.lock and package-lock.json)
 *      throw rather than silently picking one and creating a second
 *      lockfile alongside it
 *   4. npm, as the default when there's no other evidence
 *
 * @param {object} opts
 * @param {string} [opts.declared] - raw "packageManager" field value, e.g. "pnpm@9.0.0"
 * @param {string[]} [opts.lockfiles] - lockfile basenames found in the project
 * @param {string} [opts.override] - explicit manager choice, e.g. from a CLI flag
 * @returns {'npm'|'pnpm'|'yarn'|'bun'}
 */
export function selectPackageManager({ declared, lockfiles = [], override } = {}) {
  if (override !== undefined) {
    if (!SUPPORTED_MANAGERS.includes(override)) {
      throw new Error(
        `Unsupported --package-manager "${override}". Supported: ${SUPPORTED_MANAGERS.join(", ")}.`
      );
    }
    return override;
  }

  if (declared) {
    const declaredName = String(declared).split("@")[0].trim();
    if (SUPPORTED_MANAGERS.includes(declaredName)) {
      return declaredName;
    }
    // Unsupported/unrecognized declared value — ignore it and fall through
    // to lockfile evidence rather than failing outright.
  }

  const evidence = new Set();
  for (const lockfile of lockfiles) {
    const manager = LOCKFILE_TO_MANAGER[lockfile];
    if (manager) evidence.add(manager);
  }
  if (evidence.size > 1) {
    throw new Error(
      `Conflicting package manager evidence from lockfiles: ${lockfiles.join(", ")}. ` +
        `Resolve by removing the stale lockfile or passing --package-manager explicitly.`
    );
  }
  if (evidence.size === 1) {
    return [...evidence][0];
  }

  return "npm";
}

const ADD_SUBCOMMAND = {
  npm: "install",
  pnpm: "add",
  yarn: "add",
  bun: "add",
};

/**
 * Builds the argv-array command to add dependencies with, or — when
 * `packages` is empty — to install a project's already-declared
 * dependencies (the "new template" case, run once after scaffolding).
 * Always returns an argv array (never a shell string) so callers can pass
 * it straight to `spawnSync(command, args, ...)` without interpolating
 * anything into a shell command line.
 *
 * @param {'npm'|'pnpm'|'yarn'|'bun'} manager
 * @param {string[]} [packages] - version-qualified package specs, e.g. "@coinbase/cds-web@^9.26.1"
 * @returns {{ command: string, args: string[] }}
 */
export function dependencyCommand(manager, packages = []) {
  if (!SUPPORTED_MANAGERS.includes(manager)) {
    throw new Error(`Unsupported package manager "${manager}". Supported: ${SUPPORTED_MANAGERS.join(", ")}.`);
  }
  if (packages.length === 0) {
    return { command: manager, args: ["install"] };
  }
  return { command: manager, args: [ADD_SUBCOMMAND[manager], ...packages] };
}

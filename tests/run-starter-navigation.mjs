#!/usr/bin/env node
/**
 * Runs tests/starter-navigation.test.tsx.
 *
 * Why this isn't picked up by `node --test tests/*.test.mjs` (this repo's
 * usual invocation for its other plain node:test files): that file
 * renders the starter's REAL React/CDS components, which means (a) it's
 * TSX/JSX, which plain Node can't run without a transform, and (b) it
 * needs react/react-dom/@coinbase/cds-web/@coinbase/cds-icons resolved from
 * starters/vitejs-cds/node_modules — the starter's own installed deps, not
 * this repo's (this repo has no root node_modules, and none of that gets
 * added to it: see the header note below on why).
 *
 * No test-runner or testing-library devDependency was added anywhere for
 * this — not to the starter's package.json (it's a shipped manifest, see
 * that file's own comments) and not to this repo either. Two lighter tools
 * already installed do the whole job:
 *
 *   - esbuild, resolved straight out of starters/vitejs-cds/node_modules
 *     (it's vite's own dependency there — present after `npm install` in
 *     that directory, nothing extra to add) — used only to strip TS types
 *     and transform JSX, then bundle the test file together with the
 *     starter's layout components into one Node-runnable ESM file. Local
 *     imports and @coinbase/cds-web/cds-icons (whose package ships
 *     extensionless relative imports Node's own ESM resolver rejects) are
 *     bundled in; react/react-dom/react-dom/server are left external so
 *     Node resolves the SAME instance the starter itself would use, out of
 *     the starter's own node_modules.
 *   - node:test + node:assert/strict (already this repo's convention for
 *     its other 3 test files) — no jsdom, no @testing-library/react. Every
 *     assertion here is about static markup (hrefs, target/rel, aria
 *     attributes, presence/absence of an element), which
 *     react-dom/server's renderToStaticMarkup plus string checks answers
 *     directly — a full interactive-DOM testing library would be more
 *     machinery than what's actually being tested.
 *
 * Usage: node tests/run-starter-navigation.mjs
 * Prereq: npm install --prefix starters/vitejs-cds (installs only what
 * that package.json already declares — nothing added by this script).
 */
import { existsSync, mkdtempSync, rmSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { tmpdir } from "node:os";
import { assembleStarter } from "../scripts/lib/assemble-starter.mjs";

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const starterDir = join(repoRoot, "starters/vitejs-cds");
const starterNodeModules = join(starterDir, "node_modules");
const esbuildEntry = join(starterNodeModules, "esbuild/lib/main.js");

if (!existsSync(esbuildEntry)) {
  console.error(
    `esbuild not found at ${esbuildEntry}.\n` +
      "Run `npm install` inside starters/vitejs-cds first (it installs esbuild " +
      "transitively via vite — no new dependency is added for these tests)."
  );
  process.exit(1);
}

const scratch = mkdtempSync(join(tmpdir(), 'neon-navigation-'));
const assembled = join(scratch, 'app');
const buildDir = mkdtempSync(join(starterNodeModules, '.neon-navigation-'));
const outfile = join(buildDir, 'bundle.mjs');

process.on('exit', () => {
  rmSync(buildDir, { recursive: true, force: true });
  rmSync(scratch, { recursive: true, force: true });
});

await assembleStarter({ sourceRoot: repoRoot, destination: assembled });
const assembledImports = {
  name: 'assembled-test-app',
  setup(build) {
    build.onResolve({ filter: /^@neon-test-app\// }, (args) =>
      build.resolve(join(assembled, 'src', args.path.slice('@neon-test-app/'.length)), {
        kind: args.kind,
        resolveDir: assembled,
      })
    );
  },
};

const { build } = await import(pathToFileURL(esbuildEntry).href);

await build({
  entryPoints: [join(repoRoot, "tests/starter-navigation.test.tsx")],
  bundle: true,
  platform: "node",
  format: "esm",
  jsx: "automatic",
  target: "node18",
  outfile,
  external: ["react", "react-dom", "react-dom/server"],
  plugins: [assembledImports],
  // Resolve bare imports (e.g. @coinbase/cds-web/system) as if this file
  // lived inside starters/vitejs-cds — that's where its real dependencies
  // are installed, not anywhere under the repo root.
  nodePaths: [starterNodeModules],
  loader: { ".css": "empty", ".svg": "dataurl" },
  logLevel: "warning",
});

await import(pathToFileURL(outfile).href);

import assert from "node:assert/strict";
import { existsSync, lstatSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const repoRoot = fileURLToPath(new URL("../", import.meta.url));

/** Walks dir, calling visit(absolutePath, dirent) for every entry, files and directories both. */
function walk(dir, visit) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    visit(full, entry);
    if (entry.isDirectory() && !entry.isSymbolicLink()) walk(full, visit);
  }
}

test("packages complete plugin to directory with spaces and invokes bundled installer", async (t) => {
  const { packagePlugin } = await import("../scripts/package-plugin.mjs");
  // The packaged plugin (tempDir) and every app scaffolded/themed from it
  // below are siblings under one outer scratch dir, not nested inside
  // tempDir itself — assembleStarter (used by --new) rejects a destination
  // inside its own source tree, and tempDir is the packaged installer's
  // source tree once copied there.
  const outerDir = join(repoRoot, "dist-test-scratch " + Date.now());
  const tempDir = join(outerDir, "packaged plugin");
  t.after(() => {
    try {
      rmSync(outerDir, { recursive: true, force: true });
    } catch {}
  });

  const result = await packagePlugin({
    sourceRoot: repoRoot,
    destination: tempDir,
  });

  assert.equal(result.destination, tempDir);
  assert.ok(existsSync(join(tempDir, ".claude-plugin/plugin.json")));
  assert.ok(existsSync(join(tempDir, "theme/css/theme.css")));
  assert.ok(existsSync(join(tempDir, "theme/cds/theme.config.ts")));
  assert.ok(existsSync(join(tempDir, "theme/tokens/theme.json")));
  assert.ok(existsSync(join(tempDir, "scripts/install.mjs")));
  assert.ok(existsSync(join(tempDir, "scripts/assemble-starter.mjs")));
  assert.ok(existsSync(join(tempDir, "scripts/lib/assemble-starter.mjs")));
  assert.ok(existsSync(join(tempDir, "scripts/lib/assets.mjs")));
  assert.ok(existsSync(join(tempDir, "scripts/lib/project-config.mjs")));
  assert.ok(existsSync(join(tempDir, "starters/vitejs-cds/package.json")));
  assert.equal(existsSync(join(tempDir, "starters/vitejs-cds/src/theme")), false);
  assert.ok(existsSync(join(tempDir, "LICENSE")));

  // Gitignored intermediates are excluded even though they may exist
  // locally in the source checkout.
  assert.equal(existsSync(join(tempDir, "theme/tokens.resolved.json")), false);
  assert.equal(existsSync(join(tempDir, "theme/tokens.report.json")), false);

  // Assert manifest skills all exist in packaged output
  const manifest = JSON.parse(readFileSync(join(tempDir, ".claude-plugin/plugin.json"), "utf8"));
  for (const skillPath of manifest.skills) {
    assert.ok(existsSync(join(tempDir, skillPath, "SKILL.md")), `Missing skill ${skillPath}`);
  }

  // Invoke the bundled canonical installer with --new --skip-install, from
  // an unrelated working directory, into a destination outside the
  // packaged copy.
  const installerPath = join(tempDir, "scripts/install.mjs");
  const targetApp = join(outerDir, "scaffolded app");
  const runScaffold = spawnSync(process.execPath, [installerPath, targetApp, "--new", "--skip-install"], {
    cwd: repoRoot,
    encoding: "utf8",
  });
  assert.equal(runScaffold.status, 0, runScaffold.stderr);
  assert.ok(existsSync(join(targetApp, "package.json")));
  assert.ok(existsSync(join(targetApp, "src/theme/createTheme.ts")));
  assert.equal(existsSync(join(targetApp, "node_modules")), false);

  // Existing CDS copy path with --skip-install
  const existingApp = join(outerDir, "existing app");
  mkdirSync(existingApp, { recursive: true });
  writeFileSync(join(existingApp, "package.json"), JSON.stringify({ dependencies: {} }));
  const runExisting = spawnSync(process.execPath, [installerPath, existingApp, "--skip-install"], {
    cwd: repoRoot,
    encoding: "utf8",
  });
  assert.equal(runExisting.status, 0, runExisting.stderr);
  assert.ok(existsSync(join(existingApp, "src/theme/createTheme.ts")));

  // CSS-only path
  const cssApp = join(outerDir, "css app");
  mkdirSync(cssApp, { recursive: true });
  const runCss = spawnSync(process.execPath, [installerPath, cssApp, "--css-only"], {
    cwd: repoRoot,
    encoding: "utf8",
  });
  assert.equal(runCss.status, 0, runCss.stderr);
  assert.ok(existsSync(join(cssApp, "src/theme/theme.css")));

  // Old-path forwarding shim still works from the packaged copy.
  const shimPath = join(tempDir, "theme/finnomena/scripts/install.mjs");
  const shimApp = join(outerDir, "shim app");
  mkdirSync(shimApp, { recursive: true });
  const runShim = spawnSync(process.execPath, [shimPath, shimApp, "--css-only"], {
    cwd: repoRoot,
    encoding: "utf8",
  });
  assert.equal(runShim.status, 0, runShim.stderr);
  assert.match(runShim.stderr, /deprecat/i);
  assert.ok(existsSync(join(shimApp, "src/theme/theme.css")));

  // Verify node_modules / dist are excluded
  assert.equal(existsSync(join(tempDir, "starters/vitejs-cds/node_modules")), false);
  assert.equal(existsSync(join(tempDir, "starters/vitejs-cds/dist")), false);

  // Removing the packaged copy's own claim on the source checkout: nothing
  // above should have written outside outerDir/tempDir (no absolute-path or
  // symlink dependency back into the real repo).
  assert.equal(existsSync(join(repoRoot, "scaffolded app")), false);

  // No file in the packaged tree is a symlink, and no packaged .mjs/.ts
  // file contains a hardcoded reference back to the source checkout's own
  // absolute path — proves the packaged copy has no live dependency on the
  // source repo continuing to exist at its current location.
  walk(tempDir, (full, entry) => {
    assert.equal(entry.isSymbolicLink(), false, `unexpected symlink in packaged output: ${full}`);
    if (entry.isFile() && /\.(mjs|ts|tsx|json)$/.test(full)) {
      const content = readFileSync(full, "utf8");
      assert.ok(!content.includes(repoRoot.replace(/\/$/, "")), `${full} references the source checkout's absolute path`);
    }
  });
});

test("packagePlugin rejects nonempty destination", async () => {
  const { packagePlugin } = await import("../scripts/package-plugin.mjs");
  const tempDir = join(repoRoot, "dist-test-nonempty " + Date.now());
  mkdirSync(tempDir, { recursive: true });
  writeFileSync(join(tempDir, "existing.txt"), "hello");
  try {
    await assert.rejects(
      async () => packagePlugin({ sourceRoot: repoRoot, destination: tempDir }),
      /destination is not empty/i
    );
  } finally {
    const { rmSync } = await import("node:fs");
    rmSync(tempDir, { recursive: true, force: true });
  }
});

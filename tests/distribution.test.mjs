import assert from "node:assert/strict";
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const repoRoot = fileURLToPath(new URL("../", import.meta.url));

test("packages complete plugin to directory with spaces and invokes bundled installer", async (t) => {
  const { packagePlugin } = await import("../scripts/package-plugin.mjs");
  const tempDir = join(repoRoot, "dist-test-spaces " + Date.now());
  t.after(() => {
    try {
      rmSync(tempDir, { recursive: true, force: true });
    } catch {}
  });

  const result = await packagePlugin({
    sourceRoot: repoRoot,
    destination: tempDir,
  });

  assert.equal(result.destination, tempDir);
  assert.ok(existsSync(join(tempDir, ".claude-plugin/plugin.json")));
  assert.ok(existsSync(join(tempDir, "theme/finnomena/theme.css")));
  assert.ok(existsSync(join(tempDir, "starters/vitejs-cds/package.json")));
  assert.ok(existsSync(join(tempDir, "LICENSE")));

  // Assert manifest skills all exist in packaged output
  const manifest = JSON.parse(readFileSync(join(tempDir, ".claude-plugin/plugin.json"), "utf8"));
  for (const skillPath of manifest.skills) {
    assert.ok(existsSync(join(tempDir, skillPath, "SKILL.md")), `Missing skill ${skillPath}`);
  }

  // Invoke bundled installer with --new --skip-install from an unrelated working directory
  const targetApp = join(tempDir, "scaffolded app");
  const installerPath = join(tempDir, "theme/finnomena/scripts/install.mjs");
  const runScaffold = spawnSync(process.execPath, [installerPath, targetApp, "--new", "--skip-install"], {
    cwd: repoRoot,
    encoding: "utf8",
  });
  assert.equal(runScaffold.status, 0, runScaffold.stderr);
  assert.ok(existsSync(join(targetApp, "package.json")));
  assert.ok(existsSync(join(targetApp, "src/theme/createTheme.ts")));
  assert.equal(existsSync(join(targetApp, "node_modules")), false);

  // Existing CDS copy path with --skip-install
  const existingApp = join(tempDir, "existing app");
  mkdirSync(existingApp, { recursive: true });
  writeFileSync(join(existingApp, "package.json"), JSON.stringify({ dependencies: {} }));
  const runExisting = spawnSync(process.execPath, [installerPath, existingApp, "--skip-install"], {
    cwd: repoRoot,
    encoding: "utf8",
  });
  assert.equal(runExisting.status, 0, runExisting.stderr);
  assert.ok(existsSync(join(existingApp, "src/theme/createTheme.ts")));

  // CSS-only path
  const cssApp = join(tempDir, "css app");
  mkdirSync(cssApp, { recursive: true });
  const runCss = spawnSync(process.execPath, [installerPath, cssApp, "--css-only"], {
    cwd: repoRoot,
    encoding: "utf8",
  });
  assert.equal(runCss.status, 0, runCss.stderr);
  assert.ok(existsSync(join(cssApp, "src/theme/theme.css")));

  // Verify node_modules / dist are excluded
  assert.equal(existsSync(join(tempDir, "starters/vitejs-cds/node_modules")), false);
  assert.equal(existsSync(join(tempDir, "starters/vitejs-cds/dist")), false);
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

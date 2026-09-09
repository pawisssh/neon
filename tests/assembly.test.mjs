import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  mkdtempSync, mkdirSync, writeFileSync, readFileSync, readdirSync, rmSync, symlinkSync, existsSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { assembleStarter } from '../scripts/lib/assemble-starter.mjs';
import { CDS_FILES } from '../scripts/lib/assets.mjs';

// Builds a minimal fixture sourceRoot (a "plugin-source" subdirectory,
// distinct from the temp root itself) shaped like the canonical target
// layout (theme/cds/ + starters/vitejs-cds/), independent of the real
// repo's current (pre-migration) theme/finnomena/ layout — assembleStarter
// is written against the target shape, so tests exercise that shape
// directly rather than waiting on the real move to land. Destinations are
// placed as siblings of this sourceRoot (not nested inside it), matching
// real usage where a generated app lives outside the plugin checkout.
function buildFixture(root, { includeStaleThemeDir = false, cdsContent = (name) => `export const marker = ${JSON.stringify(name)};\n` } = {}) {
  const sourceRoot = join(root, 'plugin-source');
  const starterDir = join(sourceRoot, 'starters/vitejs-cds');
  mkdirSync(join(starterDir, 'src/app'), { recursive: true });
  mkdirSync(join(starterDir, 'src/layout'), { recursive: true });
  writeFileSync(join(starterDir, 'package.json'), JSON.stringify({ name: 'finnomena-app', dependencies: { '@coinbase/cds-web': '^9.26.1' } }));
  writeFileSync(join(starterDir, 'src/main.tsx'), 'export const main = true;\n');
  writeFileSync(join(starterDir, 'src/app/App.tsx'), 'export const App = () => null;\n');
  writeFileSync(join(starterDir, 'src/layout/AppShell.tsx'), 'export const AppShell = () => null;\n');

  // Excluded build/VCS artifacts that must never reach the destination.
  mkdirSync(join(starterDir, 'node_modules/some-pkg'), { recursive: true });
  writeFileSync(join(starterDir, 'node_modules/some-pkg/index.js'), 'module.exports = {};\n');
  mkdirSync(join(starterDir, 'dist'), { recursive: true });
  writeFileSync(join(starterDir, 'dist/bundle.js'), 'console.log(1);\n');
  mkdirSync(join(starterDir, '.git'), { recursive: true });
  writeFileSync(join(starterDir, '.git/HEAD'), 'ref: refs/heads/main\n');
  writeFileSync(join(starterDir, '.DS_Store'), 'junk');

  if (includeStaleThemeDir) {
    mkdirSync(join(starterDir, 'src/theme'), { recursive: true });
    writeFileSync(join(starterDir, 'src/theme/createTheme.ts'), 'export const stale = true;\n');
  }

  const cdsDir = join(sourceRoot, 'theme/cds');
  mkdirSync(cdsDir, { recursive: true });
  for (const file of CDS_FILES) {
    writeFileSync(join(cdsDir, file), cdsContent(file));
  }

  return { sourceRoot, starterDir, cdsDir };
}

function fixtureRoot(t) {
  const root = mkdtempSync(join(tmpdir(), 'neon-assembly-test-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  return root;
}

test('assembles starter source plus the 4 canonical CDS files into destination/src/theme', async (t) => {
  const root = fixtureRoot(t);
  const { sourceRoot, cdsDir } = buildFixture(root);
  const destination = join(root, 'employee app');
  const result = await assembleStarter({ sourceRoot, destination });

  assert.equal(result.destination, destination);
  assert.deepEqual([...result.themeFiles].sort(), [...CDS_FILES].sort());
  assert.ok(existsSync(join(destination, 'package.json')));
  assert.ok(existsSync(join(destination, 'src/main.tsx')));
  for (const file of CDS_FILES) {
    assert.deepEqual(
      readFileSync(join(destination, 'src/theme', file)),
      readFileSync(join(cdsDir, file)),
    );
  }
});

test('mutation test: a canonical fixture theme file change appears in a fresh assembly', async (t) => {
  const root = fixtureRoot(t);
  const { sourceRoot } = buildFixture(root);
  const dest1 = join(root, 'first-app');
  await assembleStarter({ sourceRoot, destination: dest1 });
  assert.match(readFileSync(join(dest1, 'src/theme/createTheme.ts'), 'utf8'), /"createTheme\.ts"/);

  // Mutate the canonical source, then assemble again into a fresh target.
  writeFileSync(join(sourceRoot, 'theme/cds/createTheme.ts'), 'export const marker = "mutated";\n');
  const dest2 = join(root, 'second-app');
  await assembleStarter({ sourceRoot, destination: dest2 });
  assert.match(readFileSync(join(dest2, 'src/theme/createTheme.ts'), 'utf8'), /"mutated"/);
  // The first assembly is untouched — assembly is a point-in-time copy, not a live link.
  assert.match(readFileSync(join(dest1, 'src/theme/createTheme.ts'), 'utf8'), /"createTheme\.ts"/);
});

test('excludes node_modules, dist, .git, .DS_Store, and a stale legacy src/theme from the copied starter source', async (t) => {
  const root = fixtureRoot(t);
  const { sourceRoot } = buildFixture(root, { includeStaleThemeDir: true });
  const destination = join(root, 'clean-app');
  await assembleStarter({ sourceRoot, destination });

  assert.equal(existsSync(join(destination, 'node_modules')), false);
  assert.equal(existsSync(join(destination, 'dist')), false);
  assert.equal(existsSync(join(destination, '.git')), false);
  assert.equal(existsSync(join(destination, '.DS_Store')), false);
  // Only the 4 canonical files land at src/theme — no stale leftover file survives alongside them.
  assert.deepEqual(readdirSync(join(destination, 'src/theme')).sort(), [...CDS_FILES].sort());
});

test('accepts a destination path containing spaces', async (t) => {
  const root = fixtureRoot(t);
  const { sourceRoot } = buildFixture(root);
  const destination = join(root, 'a destination with spaces');
  await assembleStarter({ sourceRoot, destination });
  assert.ok(existsSync(join(destination, 'src/theme/theme.config.ts')));
});

test('is independent of process.cwd() — resolves entirely from explicit sourceRoot/destination', async (t) => {
  const root = fixtureRoot(t);
  const { sourceRoot } = buildFixture(root);
  const destination = join(root, 'cwd-independent-app');
  const otherCwd = mkdtempSync(join(tmpdir(), 'neon-assembly-othercwd-'));
  t.after(() => rmSync(otherCwd, { recursive: true, force: true }));
  const originalCwd = process.cwd();
  process.chdir(otherCwd);
  try {
    await assembleStarter({ sourceRoot, destination });
  } finally {
    process.chdir(originalCwd);
  }
  assert.ok(existsSync(join(destination, 'src/theme/breakpoints.config.ts')));
});

test('rejects a non-empty destination without writing anything', async (t) => {
  const root = fixtureRoot(t);
  const { sourceRoot } = buildFixture(root);
  const destination = join(root, 'nonempty-app');
  mkdirSync(destination, { recursive: true });
  writeFileSync(join(destination, 'existing.txt'), 'pre-existing content');
  await assert.rejects(() => assembleStarter({ sourceRoot, destination }), /not empty|non-empty/i);
  assert.equal(existsSync(join(destination, 'package.json')), false);
  assert.deepEqual(readdirSync(destination), ['existing.txt']);
});

test('rejects a symlinked destination', async (t) => {
  const root = fixtureRoot(t);
  const { sourceRoot } = buildFixture(root);
  const realDir = join(root, 'real-target');
  mkdirSync(realDir, { recursive: true });
  const destination = join(root, 'symlinked-app');
  symlinkSync(realDir, destination, 'dir');
  await assert.rejects(() => assembleStarter({ sourceRoot, destination }), /symlink/i);
});

test('rejects a destination inside the source tree', async (t) => {
  const root = fixtureRoot(t);
  const { sourceRoot } = buildFixture(root);
  const destination = join(sourceRoot, 'starters/vitejs-cds/inside-source');
  await assert.rejects(() => assembleStarter({ sourceRoot, destination }), /inside|source/i);
});

test('never invokes a package manager (no node_modules materializes, no PATH needed)', async (t) => {
  const root = fixtureRoot(t);
  const { sourceRoot } = buildFixture(root);
  const destination = join(root, 'no-install-app');
  await assembleStarter({ sourceRoot, destination });
  assert.equal(existsSync(join(destination, 'node_modules')), false);
});

test('CLI wrapper: usage error when no destination is given', () => {
  const cliPath = fileURLToPath(new URL('../scripts/assemble-starter.mjs', import.meta.url));
  const result = spawnSync(process.execPath, [cliPath], {
    encoding: 'utf8', timeout: 5000,
  });
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /usage/i);
});

test('the real source template carries no independently maintained src/theme files', () => {
  const starterThemeDir = fileURLToPath(new URL('../starters/vitejs-cds/src/theme', import.meta.url));
  assert.equal(existsSync(starterThemeDir), false, 'src/theme should not exist in tracked starter source — assembleStarter supplies it from theme/cds/ at assembly time');
});

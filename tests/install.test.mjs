import assert from 'node:assert/strict';
import { test } from 'node:test';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, readdirSync, cpSync, existsSync, rmSync, symlinkSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { buildSpawnOptions, resolveThemeDir } from '../scripts/install.mjs';

// The fixture's plugin source (scripts/, theme/cds/, theme/css/,
// starters/vitejs-cds/) lives under root/plugin-source/, distinct from
// root itself — install.mjs derives its own REPO_ROOT from its script
// location, and assembleStarter (used by --new) rejects a destination
// nested inside that source tree, matching real usage where a generated
// app lives outside the plugin checkout.
function fixture(t) {
  const root = mkdtempSync(join(tmpdir(), 'neon-install-test-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const pluginSource = join(root, 'plugin-source');
  cpSync(new URL('../scripts/', import.meta.url), join(pluginSource, 'scripts'), { recursive: true });
  cpSync(new URL('../theme/cds/', import.meta.url), join(pluginSource, 'theme/cds'), { recursive: true });
  cpSync(new URL('../theme/css/', import.meta.url), join(pluginSource, 'theme/css'), { recursive: true });
  const cdsDir = join(pluginSource, 'theme/cds');
  const target = join(root, 'app');
  mkdirSync(target);
  writeFileSync(join(target, 'package.json'), JSON.stringify({ dependencies: { '@coinbase/cds-web': '^9.26.1' } }));
  const run = (...args) => spawnSync(process.execPath, [join(pluginSource, 'scripts/install.mjs'), ...args], {
    encoding: 'utf8', timeout: 5000,
    env: { ...process.env, PATH: '' }, // Never install dependencies during these tests.
  });
  return { root, pluginSource, cdsDir, target, run };
}

for (const css of [false, true]) {
  test(`preserves customized ${css ? 'CSS' : 'CDS'} files without partial copies`, (t) => {
    const { target, run } = fixture(t);
    const dest = join(target, 'src/theme');
    mkdirSync(dest, { recursive: true });
    const file = join(dest, css ? 'theme.css' : 'breakpoints.config.ts');
    writeFileSync(file, 'custom application theme');
    const result = run(target, ...(css ? ['--css-only'] : []));
    assert.notEqual(result.status, 0);
    assert.equal(readFileSync(file, 'utf8'), 'custom application theme');
    assert.equal(existsSync(join(dest, 'theme.config.ts')), false);
  });
  test(`can install and rerun ${css ? 'CSS' : 'CDS'} mode`, (t) => {
    const { target, cdsDir, pluginSource, run } = fixture(t);
    const args = [target, ...(css ? ['--css-only'] : [])];
    assert.equal(run(...args).status, 0);
    assert.equal(run(...args).status, 0);
    const file = css ? 'theme.css' : 'createTheme.ts';
    const srcDir = css ? join(pluginSource, 'theme/css') : cdsDir;
    assert.deepEqual(readFileSync(join(target, 'src/theme', file)), readFileSync(join(srcDir, file)));
  });
}

for (const args of [['--css-onyl'], ['extra'], ['--new', '--css-only']]) {
  test(`rejects invalid arguments ${args.join(' ')} before writing`, (t) => {
    const { target, root, run } = fixture(t);
    assert.notEqual(run(target, ...args).status, 0);
    assert.equal(existsSync(join(target, 'src')), false);
    assert.equal(existsSync(join(root, 'starters')), false);
  });
}

test('--sync-starter is retired: exits nonzero without touching the filesystem', (t) => {
  const { root, run } = fixture(t);
  const result = run('--sync-starter');
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /assembled from canonical assets/i);
  assert.match(result.stderr, /assemble-starter\.mjs/);
  assert.equal(existsSync(join(root, 'starters')), false);
});

// Sets up a fixture's pluginSource/starters/vitejs-cds/ (source for --new,
// and the manifest declaredCdsVersion() reads from) with a minimal
// package.json declaring a pinned @coinbase/cds-web range, mirroring the
// real repo's starters/vitejs-cds/package.json without needing the whole
// starter tree.
function withStarterManifest(pluginSource, cdsVersion = '^9.26.1') {
  const starterDir = join(pluginSource, 'starters/vitejs-cds');
  mkdirSync(join(starterDir, 'src'), { recursive: true });
  writeFileSync(
    join(starterDir, 'package.json'),
    JSON.stringify({ name: 'finnomena-app', dependencies: { '@coinbase/cds-web': cdsVersion } })
  );
  writeFileSync(join(starterDir, 'src', 'placeholder.txt'), 'starter placeholder file');
  return starterDir;
}

test('buildSpawnOptions: unit-level verification of the win32-vs-other spawn branch (not a real Windows launch)', () => {
  assert.deepEqual(buildSpawnOptions('/tmp/x', 'win32'), { cwd: '/tmp/x', stdio: 'inherit', shell: true });
  assert.deepEqual(buildSpawnOptions('/tmp/x', 'darwin'), { cwd: '/tmp/x', stdio: 'inherit', shell: false });
  assert.deepEqual(buildSpawnOptions('/tmp/x', 'linux'), { cwd: '/tmp/x', stdio: 'inherit', shell: false });
});

test('resolveThemeDir rejects an absolute --theme-dir', () => {
  assert.throws(() => resolveThemeDir('/some/target', '/etc/passwd'));
});

test('resolveThemeDir rejects a --theme-dir that escapes the target directory', () => {
  assert.throws(() => resolveThemeDir('/some/target', '../outside'));
  assert.throws(() => resolveThemeDir('/some/target', 'a/../../outside'));
});

test('resolveThemeDir accepts a nested project-relative --theme-dir', () => {
  assert.equal(resolveThemeDir('/some/target', 'styles/neon'), join('/some/target', 'styles/neon'));
});

test('resolveThemeDir rejects a --theme-dir reached through a symlinked ancestor that escapes the target', (t) => {
  const root = mkdtempSync(join(tmpdir(), 'neon-theme-dir-test-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const target = join(root, 'target');
  const outside = join(root, 'outside');
  mkdirSync(target, { recursive: true });
  mkdirSync(outside, { recursive: true });
  symlinkSync(outside, join(target, 'escape'), 'dir');
  assert.throws(() => resolveThemeDir(target, 'escape/theme'));
});

test('--css-only --theme-dir places theme.css only at the custom destination in a plain HTML project (no src/)', (t) => {
  const { root, run } = fixture(t);
  const target = join(root, 'html-app');
  mkdirSync(target, { recursive: true }); // no package.json, no src/ — plain static HTML project
  const result = run(target, '--css-only', '--theme-dir', 'styles/neon');
  assert.equal(result.status, 0);
  assert.equal(existsSync(join(target, 'styles/neon/theme.css')), true);
  assert.equal(existsSync(join(target, 'src')), false);
});

test('CLI rejects an escaping --theme-dir before writing anything', (t) => {
  const { target, run } = fixture(t);
  const result = run(target, '--css-only', '--theme-dir', '../escaped');
  assert.notEqual(result.status, 0);
  assert.equal(existsSync(join(target, 'src')), false);
  assert.equal(existsSync(join(target, '..', 'escaped')), false);
});

for (const css of [false, true]) {
  test(`default ${css ? 'CSS' : 'CDS'} destination rejects escaping src symlink`, (t) => {
    const { root, target, run } = fixture(t);
    const outside = join(root, 'outside');
    mkdirSync(outside);
    symlinkSync(outside, join(target, 'src'), process.platform === 'win32' ? 'junction' : 'dir');
    const result = run(target, ...(css ? ['--css-only'] : []));
    assert.notEqual(result.status, 0);
    assert.deepEqual(readdirSync(outside), []);
    assert.equal(existsSync(join(target, 'src/theme')), false);
  });
}

for (const css of [false, true]) {
  test(`explicit --theme-dir src/theme rejects escaping src symlink (${css ? 'CSS' : 'CDS'})`, (t) => {
    const { root, target, run } = fixture(t);
    const outside = join(root, 'outside');
    mkdirSync(outside);
    symlinkSync(outside, join(target, 'src'), process.platform === 'win32' ? 'junction' : 'dir');
    const result = run(target, ...(css ? ['--css-only'] : []), '--theme-dir', 'src/theme');
    assert.notEqual(result.status, 0);
    assert.deepEqual(readdirSync(outside), []);
    assert.equal(existsSync(join(target, 'src/theme')), false);
  });
}

for (const css of [false, true]) {
  test(`default ${css ? 'CSS' : 'CDS'} destination rejects a symlink placed at src/theme itself`, (t) => {
    const { root, target, run } = fixture(t);
    const outside = join(root, 'outside');
    mkdirSync(outside);
    mkdirSync(join(target, 'src'));
    symlinkSync(outside, join(target, 'src/theme'), process.platform === 'win32' ? 'junction' : 'dir');
    const result = run(target, ...(css ? ['--css-only'] : []));
    assert.notEqual(result.status, 0);
    assert.deepEqual(readdirSync(outside), []);
  });
}

test('accepts a src symlink that resolves inside the target directory (internal symlink, not an escape)', (t) => {
  const { target, cdsDir, run } = fixture(t);
  const realSrc = join(target, 'real-src');
  mkdirSync(realSrc, { recursive: true });
  symlinkSync(realSrc, join(target, 'src'), process.platform === 'win32' ? 'junction' : 'dir');
  const result = run(target);
  assert.equal(result.status, 0, result.stderr);
  for (const file of ['theme.config.ts', 'color-overrides.ts', 'createTheme.ts', 'breakpoints.config.ts']) {
    assert.deepEqual(readFileSync(join(target, 'src/theme', file)), readFileSync(join(cdsDir, file)));
  }
});

test('rejects --theme-dir combined with --new', (t) => {
  const { root, pluginSource, run } = fixture(t);
  withStarterManifest(pluginSource);
  const newTarget = join(root, 'new-app-with-theme-dir');
  const result = run(newTarget, '--new', '--theme-dir', 'custom');
  assert.notEqual(result.status, 0);
  assert.equal(existsSync(newTarget), false);
});

test('default branch creates src/theme in a src-less React project (package.json present, no src/ yet)', (t) => {
  const { target, cdsDir, run } = fixture(t);
  assert.equal(existsSync(join(target, 'src')), false);
  const result = run(target);
  assert.equal(result.status, 0);
  assert.equal(existsSync(join(target, 'src/theme')), true);
  for (const file of ['theme.config.ts', 'color-overrides.ts', 'createTheme.ts', 'breakpoints.config.ts']) {
    assert.deepEqual(readFileSync(join(target, 'src/theme', file)), readFileSync(join(cdsDir, file)));
  }
});

test('--skip-install scaffolds a new project without ever invoking a package manager', (t) => {
  const { root, pluginSource, run } = fixture(t);
  withStarterManifest(pluginSource);
  const newTarget = join(root, 'new-app');
  const result = run(newTarget, '--new', '--skip-install');
  assert.equal(result.status, 0, result.stderr);
  assert.equal(existsSync(join(newTarget, 'node_modules')), false);
  assert.equal(existsSync(join(newTarget, 'package.json')), true);
  assert.equal(existsSync(join(newTarget, 'src/placeholder.txt')), true);
  assert.equal(existsSync(join(newTarget, 'src/theme/createTheme.ts')), true);
  assert.match(result.stdout, /not installed/i);
});

test('--skip-install on an existing project reports dependencies not installed, never an unqualified Done', (t) => {
  const { root, pluginSource, run } = fixture(t);
  withStarterManifest(pluginSource);
  const target = join(root, 'existing-no-cds');
  mkdirSync(target, { recursive: true });
  writeFileSync(join(target, 'package.json'), JSON.stringify({ dependencies: {} }));
  const result = run(target, '--skip-install');
  assert.equal(result.status, 0);
  assert.equal(existsSync(join(target, 'node_modules')), false);
  assert.equal(existsSync(join(target, 'src/theme/createTheme.ts')), true);
  assert.match(result.stdout, /not installed/i);
});

test('installs CDS pinned to the starter-declared version range, not an unbounded latest', (t) => {
  const { root, pluginSource, run } = fixture(t);
  withStarterManifest(pluginSource, '^9.26.1');
  const target = join(root, 'no-cds-app');
  mkdirSync(target, { recursive: true });
  writeFileSync(join(target, 'package.json'), JSON.stringify({ dependencies: {} }));
  const result = run(target);
  assert.match(result.stdout, /npm install @coinbase\/cds-web@\^9\.26\.1/);
});

test('respects --package-manager override for the CDS install command', (t) => {
  const { root, pluginSource, run } = fixture(t);
  withStarterManifest(pluginSource, '^9.26.1');
  const target = join(root, 'pnpm-override-app');
  mkdirSync(target, { recursive: true });
  writeFileSync(join(target, 'package.json'), JSON.stringify({ dependencies: {} }));
  const result = run(target, '--package-manager', 'pnpm');
  assert.match(result.stdout, /pnpm add @coinbase\/cds-web@\^9\.26\.1/);
});

test('detects pnpm from a lockfile already in the target and uses it for the CDS install command', (t) => {
  const { root, pluginSource, run } = fixture(t);
  withStarterManifest(pluginSource, '^9.26.1');
  const target = join(root, 'pnpm-lockfile-app');
  mkdirSync(target, { recursive: true });
  writeFileSync(join(target, 'package.json'), JSON.stringify({ dependencies: {} }));
  writeFileSync(join(target, 'pnpm-lock.yaml'), '');
  const result = run(target);
  assert.match(result.stdout, /pnpm add @coinbase\/cds-web@\^9\.26\.1/);
});

test('walks up to a workspace root for package-manager evidence when the app directory itself has none', (t) => {
  const { root, pluginSource, run } = fixture(t);
  withStarterManifest(pluginSource, '^9.26.1');
  // apps/portal/ (the "app directory" being installed into) has a
  // package.json but no lockfile and no declared packageManager — exactly
  // the common monorepo shape where that evidence only lives at the
  // workspace root. apps/ also carries a minimal manifest so the walk's
  // "stop at an ancestor with no package.json" safety valve doesn't trip
  // before reaching workspace/, where the real pnpm-lock.yaml lives.
  const workspaceRoot = join(root, 'workspace');
  const appsDir = join(workspaceRoot, 'apps');
  const portalDir = join(appsDir, 'portal');
  mkdirSync(portalDir, { recursive: true });
  writeFileSync(join(appsDir, 'package.json'), JSON.stringify({ private: true }));
  writeFileSync(join(portalDir, 'package.json'), JSON.stringify({ name: 'portal', dependencies: {} }));
  writeFileSync(join(workspaceRoot, 'pnpm-lock.yaml'), '');
  const result = run(portalDir);
  assert.match(result.stdout, /pnpm add @coinbase\/cds-web@\^9\.26\.1/);
  // The install itself still targets portalDir, not the workspace root —
  // only evidence-gathering walked up.
  assert.equal(existsSync(join(portalDir, 'package-lock.json')), false);
  assert.equal(existsSync(join(portalDir, 'pnpm-lock.yaml')), false);
});

test('stops walking upward at an ancestor with no package.json, never reaching a lockfile further up', (t) => {
  const { root, pluginSource, run } = fixture(t);
  withStarterManifest(pluginSource, '^9.26.1');
  // apps/ here has neither a package.json nor a lockfile of its own, so
  // the walk must give up there rather than continuing on to workspace2/,
  // even though a lockfile does exist there — falls back to the npm
  // default instead of silently finding it.
  const workspaceRoot = join(root, 'workspace2');
  const appsDir = join(workspaceRoot, 'apps');
  const portalDir = join(appsDir, 'portal');
  mkdirSync(portalDir, { recursive: true });
  writeFileSync(join(portalDir, 'package.json'), JSON.stringify({ dependencies: {} }));
  writeFileSync(join(workspaceRoot, 'pnpm-lock.yaml'), '');
  const result = run(portalDir);
  assert.match(result.stdout, /npm install @coinbase\/cds-web@\^9\.26\.1/);
});

test('rejects conflicting lockfile evidence instead of silently picking a package manager', (t) => {
  const { root, pluginSource, run } = fixture(t);
  withStarterManifest(pluginSource, '^9.26.1');
  const target = join(root, 'conflict-app');
  mkdirSync(target, { recursive: true });
  writeFileSync(join(target, 'package.json'), JSON.stringify({ dependencies: {} }));
  writeFileSync(join(target, 'yarn.lock'), '');
  writeFileSync(join(target, 'package-lock.json'), '');
  const result = run(target);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /[Cc]onflicting/);
});

test('new-project branch runs npm ci when package-lock.json is present', (t) => {
  const { root, pluginSource, run } = fixture(t);
  withStarterManifest(pluginSource);
  writeFileSync(join(pluginSource, 'starters/vitejs-cds/package-lock.json'), '{}');
  const target = join(root, 'new-ci-app');
  const result = run(target, '--new');
  assert.match(result.stdout, /> npm ci/);
});

test('new-project branch runs npm install when package-lock.json is absent', (t) => {
  const { root, pluginSource, run } = fixture(t);
  withStarterManifest(pluginSource);
  const target = join(root, 'new-install-app');
  const result = run(target, '--new');
  assert.match(result.stdout, /> npm install/);
});

test('--new refuses to scaffold into a non-empty directory', (t) => {
  const { root, pluginSource, run } = fixture(t);
  withStarterManifest(pluginSource);
  const target = join(root, 'nonempty-new-app');
  mkdirSync(target, { recursive: true });
  writeFileSync(join(target, 'existing.txt'), 'pre-existing');
  const result = run(target, '--new', '--skip-install');
  assert.notEqual(result.status, 0);
  assert.deepEqual(readdirSync(target), ['existing.txt']);
});

// Old-path forwarding shim: theme/finnomena/scripts/install.mjs still
// works, forwarding argv/exit status to scripts/install.mjs, with a
// deprecation notice on stderr.
test('old path theme/finnomena/scripts/install.mjs forwards to the canonical installer', (t) => {
  const root = mkdtempSync(join(tmpdir(), 'neon-install-shim-test-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  cpSync(new URL('../scripts/', import.meta.url), join(root, 'scripts'), { recursive: true });
  cpSync(new URL('../theme/', import.meta.url), join(root, 'theme'), { recursive: true });
  const target = join(root, 'css-app');
  mkdirSync(target, { recursive: true });
  const shimPath = join(root, 'theme/finnomena/scripts/install.mjs');
  const result = spawnSync(process.execPath, [shimPath, target, '--css-only'], {
    encoding: 'utf8', timeout: 5000,
    env: { ...process.env, PATH: '' },
  });
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stderr, /deprecat/i);
  assert.equal(existsSync(join(target, 'src/theme/theme.css')), true);
});

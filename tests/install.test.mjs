import assert from 'node:assert/strict';
import { test } from 'node:test';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, readdirSync, cpSync, existsSync, rmSync, symlinkSync, chmodSync, realpathSync } from 'node:fs';
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
    // No --theme-dir flag was passed for this default-destination case, so
    // the error must not blame that flag, and must be a clean console.error
    // message rather than an uncaught throw's Node stack trace.
    assert.doesNotMatch(result.stderr, /--theme-dir/);
    assert.doesNotMatch(result.stderr, /at resolveThemeDir/);
    assert.doesNotMatch(result.stderr, /at main/);
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

test('climbs through a manifest-less grouping directory to reach workspace-root package-manager evidence', (t) => {
  const { root, pluginSource, run } = fixture(t);
  withStarterManifest(pluginSource, '^9.26.1');
  // apps/ here is a bare grouping directory with no package.json of its
  // own at all (common in monorepos that don't put a manifest on every
  // intermediate directory) — the walk must climb straight through it
  // instead of stopping there, reaching workspace3/'s declared
  // packageManager and lockfile.
  const workspaceRoot = join(root, 'workspace3');
  const appsDir = join(workspaceRoot, 'apps');
  const portalDir = join(appsDir, 'portal');
  mkdirSync(portalDir, { recursive: true });
  writeFileSync(join(workspaceRoot, 'package.json'), JSON.stringify({ packageManager: 'pnpm@9.0.0' }));
  writeFileSync(join(workspaceRoot, 'pnpm-lock.yaml'), '');
  writeFileSync(join(portalDir, 'package.json'), JSON.stringify({ dependencies: {} }));
  const result = run(portalDir);
  assert.match(result.stdout, /> pnpm add @coinbase\/cds-web@\^9\.26\.1/);
  // The install itself still targets portalDir, not the workspace root —
  // only evidence-gathering walked up.
  assert.equal(existsSync(join(portalDir, 'package-lock.json')), false);
  assert.equal(existsSync(join(workspaceRoot, 'package-lock.json')), false);
});

test('climbs through a manifest-less grouping directory to reach a yarn workspace root', (t) => {
  const { root, pluginSource, run } = fixture(t);
  withStarterManifest(pluginSource, '^9.26.1');
  // Same manifest-less-apps/ shape as above, but the evidence at the
  // workspace root is a bare yarn.lock (no package.json there either) —
  // proving evidence is found purely from a lockfile even when the
  // directory holding it has no manifest of its own.
  const workspaceRoot = join(root, 'yarn-workspace');
  const appsDir = join(workspaceRoot, 'apps');
  const portalDir = join(appsDir, 'portal');
  mkdirSync(portalDir, { recursive: true });
  writeFileSync(join(workspaceRoot, 'yarn.lock'), '');
  writeFileSync(join(portalDir, 'package.json'), JSON.stringify({ dependencies: {} }));
  const result = run(portalDir);
  assert.match(result.stdout, /> yarn add @coinbase\/cds-web@\^9\.26\.1/);
});

test('local package-manager evidence in the app directory retains priority over different evidence further up', (t) => {
  const { root, pluginSource, run } = fixture(t);
  withStarterManifest(pluginSource, '^9.26.1');
  // portalDir carries its own yarn.lock, while the workspace root above it
  // declares pnpm — the walk must stop at portalDir's own evidence rather
  // than climbing past it to different evidence further up.
  const workspaceRoot = join(root, 'priority-workspace');
  const portalDir = join(workspaceRoot, 'portal');
  mkdirSync(portalDir, { recursive: true });
  writeFileSync(join(workspaceRoot, 'package.json'), JSON.stringify({ packageManager: 'pnpm@9.0.0' }));
  writeFileSync(join(workspaceRoot, 'pnpm-lock.yaml'), '');
  writeFileSync(join(portalDir, 'package.json'), JSON.stringify({ dependencies: {} }));
  writeFileSync(join(portalDir, 'yarn.lock'), '');
  const result = run(portalDir);
  assert.match(result.stdout, /> yarn add @coinbase\/cds-web@\^9\.26\.1/);
});

test('a .git directory boundary stops the walk before reaching evidence further up', (t) => {
  const { root, pluginSource, run } = fixture(t);
  withStarterManifest(pluginSource, '^9.26.1');
  // repoRoot has a .git directory but no package-manager evidence of its
  // own; evidence exists one level further up (outside the repo) and must
  // never be reached — the walk gives up at the .git boundary instead.
  const repoRoot = join(root, 'git-dir-boundary-repo');
  const portalDir = join(repoRoot, 'apps', 'portal');
  mkdirSync(portalDir, { recursive: true });
  mkdirSync(join(repoRoot, '.git'));
  writeFileSync(join(portalDir, 'package.json'), JSON.stringify({ dependencies: {} }));
  writeFileSync(join(root, 'pnpm-lock.yaml'), '');
  const result = run(portalDir);
  assert.match(result.stdout, /> npm install @coinbase\/cds-web@\^9\.26\.1/);
});

test('evidence found exactly at a .git directory boundary is honored', (t) => {
  const { root, pluginSource, run } = fixture(t);
  withStarterManifest(pluginSource, '^9.26.1');
  // repoRoot itself carries both the .git directory AND the evidence —
  // evidence at a directory is returned before the .git boundary check
  // ever stops the walk there.
  const repoRoot = join(root, 'git-dir-boundary-repo2');
  const portalDir = join(repoRoot, 'apps', 'portal');
  mkdirSync(portalDir, { recursive: true });
  mkdirSync(join(repoRoot, '.git'));
  writeFileSync(join(repoRoot, 'package.json'), JSON.stringify({ packageManager: 'pnpm@9.0.0' }));
  writeFileSync(join(repoRoot, 'pnpm-lock.yaml'), '');
  writeFileSync(join(portalDir, 'package.json'), JSON.stringify({ dependencies: {} }));
  const result = run(portalDir);
  assert.match(result.stdout, /> pnpm add @coinbase\/cds-web@\^9\.26\.1/);
});

test('a .git file boundary (git-worktree marker) stops the walk before reaching evidence further up', (t) => {
  const { root, pluginSource, run } = fixture(t);
  withStarterManifest(pluginSource, '^9.26.1');
  // A .git *file* (as used by `git worktree add` checkouts) must stop the
  // walk exactly like a .git directory does — evidence one level further
  // up must never be reached.
  const repoRoot = join(root, 'git-file-boundary-repo');
  const portalDir = join(repoRoot, 'apps', 'portal');
  mkdirSync(portalDir, { recursive: true });
  writeFileSync(join(repoRoot, '.git'), 'gitdir: /elsewhere/.git/worktrees/git-file-boundary-repo\n');
  writeFileSync(join(portalDir, 'package.json'), JSON.stringify({ dependencies: {} }));
  writeFileSync(join(root, 'pnpm-lock.yaml'), '');
  const result = run(portalDir);
  assert.match(result.stdout, /> npm install @coinbase\/cds-web@\^9\.26\.1/);
});

test('evidence found exactly at a .git file boundary (git-worktree marker) is honored', (t) => {
  const { root, pluginSource, run } = fixture(t);
  withStarterManifest(pluginSource, '^9.26.1');
  const repoRoot = join(root, 'git-file-boundary-repo2');
  const portalDir = join(repoRoot, 'apps', 'portal');
  mkdirSync(portalDir, { recursive: true });
  writeFileSync(join(repoRoot, '.git'), 'gitdir: /elsewhere/.git/worktrees/git-file-boundary-repo2\n');
  writeFileSync(join(repoRoot, 'package.json'), JSON.stringify({ packageManager: 'yarn@1.22.19' }));
  writeFileSync(join(repoRoot, 'yarn.lock'), '');
  writeFileSync(join(portalDir, 'package.json'), JSON.stringify({ dependencies: {} }));
  const result = run(portalDir);
  assert.match(result.stdout, /> yarn add @coinbase\/cds-web@\^9\.26\.1/);
});

test(
  'invokes the fake pnpm executable (not npm) in the app directory, resolved via PATH (POSIX only)',
  { skip: process.platform === 'win32' },
  (t) => {
    const { root, pluginSource } = fixture(t);
    withStarterManifest(pluginSource, '^9.26.1');
    const workspaceRoot = join(root, 'posix-workspace');
    const portalDir = join(workspaceRoot, 'apps', 'portal');
    mkdirSync(portalDir, { recursive: true });
    writeFileSync(join(workspaceRoot, 'package.json'), JSON.stringify({ packageManager: 'pnpm@9.0.0' }));
    writeFileSync(join(workspaceRoot, 'pnpm-lock.yaml'), '');
    writeFileSync(join(portalDir, 'package.json'), JSON.stringify({ dependencies: {} }));

    // Private fake-executable bin dir, used only by this one test's
    // subprocess — the shared fixture()'s run() always sets PATH: '' so no
    // other test can ever invoke a real package manager.
    const binDir = join(root, 'fake-bin');
    mkdirSync(binDir, { recursive: true });
    const logFile = join(root, 'invocation.log');
    const makeFakeScript = (name) => {
      const scriptPath = join(binDir, name);
      writeFileSync(
        scriptPath,
        `#!/bin/sh\n{ echo "exe:${name}"; echo "argv:$@"; echo "pwd:$(pwd -P)"; } >> ${JSON.stringify(logFile)}\nexit 0\n`
      );
      chmodSync(scriptPath, 0o755);
    };
    makeFakeScript('npm');
    makeFakeScript('pnpm');

    const result = spawnSync(process.execPath, [join(pluginSource, 'scripts/install.mjs'), portalDir], {
      encoding: 'utf8',
      timeout: 5000,
      env: { ...process.env, PATH: `${binDir}:${process.env.PATH ?? ''}` },
    });
    assert.equal(result.status, 0, result.stderr);

    const log = readFileSync(logFile, 'utf8');
    assert.match(log, /exe:pnpm/);
    assert.doesNotMatch(log, /exe:npm/);
    assert.match(log, /argv:add @coinbase\/cds-web@\^9\.26\.1/);
    const cwdLine = log.split('\n').find((line) => line.startsWith('pwd:'));
    assert.equal(cwdLine, `pwd:${realpathSync(portalDir)}`);

    assert.equal(existsSync(join(portalDir, 'package-lock.json')), false);
    assert.equal(existsSync(join(portalDir, 'pnpm-lock.yaml')), false);
    assert.equal(existsSync(join(workspaceRoot, 'package-lock.json')), false);
  }
);

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
  assert.equal(existsSync(join(target, 'src/theme')), false);
});

test('conflicting lockfile evidence is rejected before writing with --skip-install (no CDS declared)', (t) => {
  const { root, pluginSource, run } = fixture(t);
  withStarterManifest(pluginSource, '^9.26.1');
  const target = join(root, 'conflict-skip-install');
  mkdirSync(target, { recursive: true });
  writeFileSync(join(target, 'package.json'), JSON.stringify({ dependencies: {} }));
  writeFileSync(join(target, 'yarn.lock'), '');
  writeFileSync(join(target, 'package-lock.json'), '');
  const result = run(target, '--skip-install');
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /[Cc]onflicting/);
  assert.equal(existsSync(join(target, 'src/theme')), false);
});

test('conflicting lockfile evidence is rejected before writing even when @coinbase/cds-web is already a dependency', (t) => {
  const { root, pluginSource, run } = fixture(t);
  withStarterManifest(pluginSource, '^9.26.1');
  const target = join(root, 'conflict-has-cds');
  mkdirSync(target, { recursive: true });
  writeFileSync(
    join(target, 'package.json'),
    JSON.stringify({ dependencies: { '@coinbase/cds-web': '^9.26.1' } })
  );
  writeFileSync(join(target, 'yarn.lock'), '');
  writeFileSync(join(target, 'package-lock.json'), '');
  const result = run(target);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /[Cc]onflicting/);
  assert.equal(existsSync(join(target, 'src/theme')), false);
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

// --- Invalid --package-manager override: rejected before any write, in
// every mode, including modes that never touch the manager for anything
// else (--css-only) or never actually run an install (already-has-CDS,
// --skip-install). ---

test('--new rejects an invalid --package-manager override before assembling anything', (t) => {
  const { root, pluginSource, run } = fixture(t);
  withStarterManifest(pluginSource);
  const target = join(root, 'invalid-new');
  const result = run(target, '--new', '--skip-install', '--package-manager', 'invalid');
  assert.notEqual(result.status, 0);
  assert.equal(existsSync(target), false);
});

test('default CDS mode rejects an invalid --package-manager override before writing (existing empty target)', (t) => {
  const { root, run } = fixture(t);
  const target = join(root, 'invalid-empty-target');
  mkdirSync(target, { recursive: true });
  const result = run(target, '--package-manager', 'invalid');
  assert.notEqual(result.status, 0);
  assert.deepEqual(readdirSync(target), []);
});

test('default CDS mode rejects an invalid --package-manager override before writing (existing app, no CDS yet)', (t) => {
  const { root, run } = fixture(t);
  const target = join(root, 'invalid-existing-app');
  mkdirSync(target, { recursive: true });
  const manifestText = JSON.stringify({ dependencies: {} });
  writeFileSync(join(target, 'package.json'), manifestText);
  const before = readdirSync(target).sort();
  const result = run(target, '--package-manager', 'invalid');
  assert.notEqual(result.status, 0);
  assert.equal(existsSync(join(target, 'src/theme')), false);
  assert.deepEqual(readdirSync(target).sort(), before);
  assert.equal(readFileSync(join(target, 'package.json'), 'utf8'), manifestText);
});

test('rejects an invalid --package-manager override before writing even when @coinbase/cds-web is already a dependency', (t) => {
  const { target, run } = fixture(t); // fixture's default target already declares @coinbase/cds-web
  const manifestText = readFileSync(join(target, 'package.json'), 'utf8');
  const before = readdirSync(target).sort();
  const result = run(target, '--package-manager', 'invalid');
  assert.notEqual(result.status, 0);
  assert.equal(existsSync(join(target, 'src/theme')), false);
  assert.deepEqual(readdirSync(target).sort(), before);
  assert.equal(readFileSync(join(target, 'package.json'), 'utf8'), manifestText);
});

test('rejects an invalid --package-manager override before writing with --skip-install', (t) => {
  const { root, run } = fixture(t);
  const target = join(root, 'invalid-skip-install');
  mkdirSync(target, { recursive: true });
  writeFileSync(join(target, 'package.json'), JSON.stringify({ dependencies: {} }));
  const result = run(target, '--skip-install', '--package-manager', 'invalid');
  assert.notEqual(result.status, 0);
  assert.equal(existsSync(join(target, 'src/theme')), false);
});

test('rejects an invalid --package-manager override even in --css-only mode, which never uses the manager', (t) => {
  const { root, run } = fixture(t);
  const target = join(root, 'invalid-css-only');
  mkdirSync(target, { recursive: true });
  const result = run(target, '--css-only', '--package-manager', 'invalid');
  assert.notEqual(result.status, 0);
  assert.equal(existsSync(join(target, 'src/theme')), false);
});

test('a valid retry after an invalid --package-manager value succeeds without manual cleanup', (t) => {
  const { root, pluginSource, run } = fixture(t);
  withStarterManifest(pluginSource);
  const target = join(root, 'retry-new-app');
  const failed = run(target, '--new', '--skip-install', '--package-manager', 'invalid');
  assert.notEqual(failed.status, 0);
  assert.equal(existsSync(target), false);
  const retried = run(target, '--new', '--skip-install');
  assert.equal(retried.status, 0, retried.stderr);
  assert.equal(existsSync(join(target, 'src/theme/createTheme.ts')), true);
});

// --- --new starter-evidence tests: manager evidence is now gathered from
// the starter's own manifest/lockfiles (and, failing that, the future
// destination's ancestry) before assembleStarter ever runs. ---

test('--new inherits root-level pnpm evidence when the starter carries none of its own', (t) => {
  const { root, pluginSource, run } = fixture(t);
  withStarterManifest(pluginSource, '^9.26.1');
  const workspaceRoot = join(root, 'new-workspace');
  const target = join(workspaceRoot, 'apps', 'new-app');
  mkdirSync(workspaceRoot, { recursive: true });
  writeFileSync(join(workspaceRoot, 'package.json'), JSON.stringify({ packageManager: 'pnpm@9.0.0' }));
  writeFileSync(join(workspaceRoot, 'pnpm-lock.yaml'), '');
  const result = run(target, '--new');
  assert.match(result.stdout, /> pnpm install/);
});

test('--new: explicit --package-manager override wins even when the starter has different evidence', (t) => {
  const { root, pluginSource, run } = fixture(t);
  const starterDir = withStarterManifest(pluginSource, '^9.26.1');
  writeFileSync(join(starterDir, 'package-lock.json'), '{}'); // starter's own evidence says npm
  const target = join(root, 'override-new-app');
  const result = run(target, '--new', '--package-manager', 'yarn');
  assert.match(result.stdout, /> yarn install/);
});

test('--new: malformed starter package.json leaves the target directory entirely absent', (t) => {
  const { root, pluginSource, run } = fixture(t);
  const starterDir = withStarterManifest(pluginSource);
  writeFileSync(join(starterDir, 'package.json'), '{ not valid json');
  const target = join(root, 'malformed-starter-app');
  const result = run(target, '--new', '--skip-install');
  assert.notEqual(result.status, 0);
  assert.equal(existsSync(target), false);
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

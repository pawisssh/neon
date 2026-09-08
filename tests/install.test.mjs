import assert from 'node:assert/strict';
import { test } from 'node:test';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, cpSync, existsSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

function fixture(t) {
  const root = mkdtempSync(join(tmpdir(), 'neon-install-test-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const theme = join(root, 'theme/finnomena');
  cpSync(new URL('../theme/finnomena/', import.meta.url), theme, { recursive: true });
  const target = join(root, 'app');
  mkdirSync(target);
  writeFileSync(join(target, 'package.json'), JSON.stringify({ dependencies: { '@coinbase/cds-web': '^9.26.1' } }));
  const run = (...args) => spawnSync(process.execPath, [join(theme, 'scripts/install.mjs'), ...args], {
    encoding: 'utf8', timeout: 5000,
    env: { ...process.env, PATH: '' }, // Never install dependencies during these tests.
  });
  return { root, theme, target, run };
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
    const { target, theme, run } = fixture(t);
    const args = [target, ...(css ? ['--css-only'] : [])];
    assert.equal(run(...args).status, 0);
    assert.equal(run(...args).status, 0);
    const file = css ? 'theme.css' : 'createTheme.ts';
    assert.deepEqual(readFileSync(join(target, 'src/theme', file)), readFileSync(join(theme, file)));
  });
}

for (const args of [['--css-onyl'], ['extra'], ['--sync-starter'], ['--new', '--css-only']]) {
  test(`rejects invalid arguments ${args.join(' ')} before writing`, (t) => {
    const { target, root, run } = fixture(t);
    assert.notEqual(run(target, ...args).status, 0);
    assert.equal(existsSync(join(target, 'src')), false);
    assert.equal(existsSync(join(root, 'starters')), false);
  });
}

test('explicit starter synchronization replaces stale generated files', (t) => {
  const { root, theme, run } = fixture(t);
  const dest = join(root, 'starters/vitejs-cds/src/theme');
  mkdirSync(dest, { recursive: true });
  writeFileSync(join(dest, 'createTheme.ts'), 'stale');
  assert.equal(run('--sync-starter').status, 0);
  assert.deepEqual(readFileSync(join(dest, 'createTheme.ts')), readFileSync(join(theme, 'createTheme.ts')));
});

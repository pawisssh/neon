import assert from 'node:assert/strict';
import { test } from 'node:test';
import { selectPackageManager, dependencyCommand } from '../scripts/lib/project-config.mjs';

test('selects pnpm from a declared packageManager field plus matching lockfile', () => {
  assert.equal(selectPackageManager({ declared: 'pnpm@9.0.0', lockfiles: ['pnpm-lock.yaml'] }), 'pnpm');
});

test('selects yarn from a declared packageManager field alone', () => {
  assert.equal(selectPackageManager({ declared: 'yarn@3.6.4' }), 'yarn');
});

test('selects bun from a bun lockfile alone', () => {
  assert.equal(selectPackageManager({ lockfiles: ['bun.lockb'] }), 'bun');
});

test('selects bun from the text bun.lock variant', () => {
  assert.equal(selectPackageManager({ lockfiles: ['bun.lock'] }), 'bun');
});

test('falls back to npm with no evidence at all', () => {
  assert.equal(selectPackageManager({}), 'npm');
  assert.equal(selectPackageManager(), 'npm');
});

test('an unsupported declared manager is ignored, falling through to lockfile evidence', () => {
  assert.equal(selectPackageManager({ declared: 'cnpm@1.0.0', lockfiles: ['yarn.lock'] }), 'yarn');
});

test('an unsupported declared manager with no other evidence falls back to npm', () => {
  assert.equal(selectPackageManager({ declared: 'cnpm@1.0.0' }), 'npm');
});

test('rejects conflicting lockfile evidence', () => {
  assert.throws(() => selectPackageManager({ lockfiles: ['yarn.lock', 'package-lock.json'] }));
});

test('an explicit override wins even over conflicting lockfiles', () => {
  assert.equal(
    selectPackageManager({ lockfiles: ['yarn.lock', 'package-lock.json'], override: 'pnpm' }),
    'pnpm'
  );
});

test('an explicit override wins over a declared manager', () => {
  assert.equal(selectPackageManager({ declared: 'yarn@3.6.4', override: 'npm' }), 'npm');
});

test('rejects an unsupported explicit override', () => {
  assert.throws(() => selectPackageManager({ override: 'cnpm' }));
});

test('dependencyCommand builds pnpm add for dependency addition', () => {
  assert.deepEqual(dependencyCommand('pnpm', ['@coinbase/cds-web']), {
    command: 'pnpm',
    args: ['add', '@coinbase/cds-web'],
  });
});

test('dependencyCommand builds npm install (not npm add) for dependency addition', () => {
  assert.deepEqual(dependencyCommand('npm', ['@coinbase/cds-web@^9.26.1']), {
    command: 'npm',
    args: ['install', '@coinbase/cds-web@^9.26.1'],
  });
});

test('dependencyCommand builds yarn add and bun add', () => {
  assert.deepEqual(dependencyCommand('yarn', ['pkg']), { command: 'yarn', args: ['add', 'pkg'] });
  assert.deepEqual(dependencyCommand('bun', ['pkg']), { command: 'bun', args: ['add', 'pkg'] });
});

test('dependencyCommand with no packages returns the bare template install command', () => {
  for (const manager of ['npm', 'pnpm', 'yarn', 'bun']) {
    assert.deepEqual(dependencyCommand(manager), { command: manager, args: ['install'] });
    assert.deepEqual(dependencyCommand(manager, []), { command: manager, args: ['install'] });
  }
});

test('dependencyCommand with ci flag runs npm ci for npm, install for others', () => {
  assert.deepEqual(dependencyCommand('npm', [], { ci: true }), { command: 'npm', args: ['ci'] });
  assert.deepEqual(dependencyCommand('npm', [], { ci: false }), { command: 'npm', args: ['install'] });
  assert.deepEqual(dependencyCommand('pnpm', [], { ci: true }), { command: 'pnpm', args: ['install'] });
  assert.deepEqual(dependencyCommand('yarn', [], { ci: true }), { command: 'yarn', args: ['install'] });
  assert.deepEqual(dependencyCommand('bun', [], { ci: true }), { command: 'bun', args: ['install'] });
});

test('dependencyCommand rejects an unsupported manager', () => {
  assert.throws(() => dependencyCommand('cnpm', ['pkg']));
});

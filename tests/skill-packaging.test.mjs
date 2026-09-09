import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { test } from 'node:test';

test('every declared skill is shipped', () => {
  const root = new URL('../', import.meta.url);
  const manifest = JSON.parse(readFileSync(new URL('.claude-plugin/plugin.json', root)));
  for (const path of manifest.skills) {
    assert.ok(existsSync(new URL(`${path}/SKILL.md`, root)), path);
  }
});

test('review skill and its required review resources ship together', () => {
  const root = new URL('../', import.meta.url);
  const manifest = JSON.parse(readFileSync(new URL('.claude-plugin/plugin.json', root)));
  assert.ok(manifest.skills.includes('./skills/neon-review'));
  for (const path of [
    'skills/neon-review/SKILL.md',
    'skills/neon-review/references/review-checks.md',
    'design-md/finnomena/DESIGN.md',
    'theme/cds/color-overrides.ts',
  ]) {
    assert.ok(existsSync(new URL(path, root)), path);
  }
});

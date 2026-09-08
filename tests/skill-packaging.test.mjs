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

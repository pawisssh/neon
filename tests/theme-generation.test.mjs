import assert from 'node:assert/strict';
import { test } from 'node:test';
import { mkdtempSync, mkdirSync, cpSync, readFileSync, existsSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const repoRoot = fileURLToPath(new URL('../', import.meta.url));

// Strips the one line in each generated file whose content is expected to
// change on every run (a generation timestamp) so the rest can be compared
// byte-for-byte against the committed output.
function stripTimestampLine(content) {
  return content
    .split('\n')
    .filter((line) => !/STATUS \(regenerated|^\*\*Generated /.test(line))
    .join('\n');
}

test('regenerating from theme/tokens/*.json reproduces the committed theme/cds/*.ts and color-mapping.todo.md exactly', (t) => {
  const scratch = mkdtempSync(join(tmpdir(), 'neon-theme-generation-test-'));
  t.after(() => rmSync(scratch, { recursive: true, force: true }));

  // Only the inputs (tokens/*.json) and the generator scripts — not the
  // already-generated theme/cds outputs — so the assertions below actually
  // prove regeneration, not just a file copy.
  mkdirSync(join(scratch, 'theme'), { recursive: true });
  cpSync(join(repoRoot, 'theme/tokens'), join(scratch, 'theme/tokens'), { recursive: true });
  cpSync(join(repoRoot, 'theme/scripts'), join(scratch, 'theme/scripts'), { recursive: true });

  const run = (script) => {
    const result = spawnSync(process.execPath, [join(scratch, 'theme/scripts', script)], {
      cwd: join(scratch, 'theme'), encoding: 'utf8', timeout: 15000,
    });
    assert.equal(result.status, 0, `${script} failed:\n${result.stderr}`);
    return result;
  };
  run('sync-tokens.mjs');
  run('generate-theme-config.mjs');
  run('generate-breakpoints-config.mjs');

  // Output locations: tokens.resolved.json/tokens.report.json land as
  // siblings of theme/tokens/ (not inside it); the 3 CDS-tier outputs land
  // in theme/cds/, not directly in theme/.
  assert.ok(existsSync(join(scratch, 'theme/tokens.resolved.json')));
  assert.ok(existsSync(join(scratch, 'theme/tokens.report.json')));
  assert.ok(existsSync(join(scratch, 'theme/cds/theme.config.ts')));
  assert.ok(existsSync(join(scratch, 'theme/cds/breakpoints.config.ts')));
  assert.ok(existsSync(join(scratch, 'theme/cds/color-mapping.todo.md')));

  for (const relFile of ['theme/cds/theme.config.ts', 'theme/cds/breakpoints.config.ts', 'theme/cds/color-mapping.todo.md']) {
    const regenerated = stripTimestampLine(readFileSync(join(scratch, relFile), 'utf8'));
    const committed = stripTimestampLine(readFileSync(join(repoRoot, relFile), 'utf8'));
    assert.equal(regenerated, committed, `${relFile} drifted from a fresh regeneration`);
  }
});

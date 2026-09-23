import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, access, readdir, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { packagePlugin } from '../../scripts/package-plugin.mjs';
import { checkMarkdownLinks } from '../../scripts/lib/markdown-links.mjs';

test('controller and all routed workflows are discoverable in the distribution', async (t) => {
  const destination = await mkdtemp(join(tmpdir(), 'neon-controller-test-'));
  t.after(() => rm(destination, { recursive: true, force: true }));
  await packagePlugin({ destination });
  const claude = JSON.parse(await readFile(join(destination, '.claude-plugin/plugin.json'), 'utf8'));
  const codex = JSON.parse(await readFile(join(destination, '.codex-plugin/plugin.json'), 'utf8'));
  const controller = join(destination, 'skills/neon/SKILL.md');
  const content = await readFile(controller, 'utf8');
  for (const name of ['neon', 'neon-create', 'neon-redesign', 'neon-audit', 'neon-review']) {
    assert.ok(claude.skills.includes(`./skills/${name}`), `${name} registered for Claude`);
    await access(join(destination, codex.skills, name, 'SKILL.md'));
    if (name !== 'neon') assert.ok(content.includes(`../${name}/SKILL.md`), `${name} reachable from controller`);
    await checkMarkdownLinks(join(destination, 'skills', name, 'SKILL.md'));
  }
});

test('distribution contains the shared design contract and conditional CDS guide', async () => {
  const destination = await mkdtemp(join(tmpdir(), 'neon-package-test-'));
  await packagePlugin({ destination });
  await access(join(destination, 'skills/INSTRUCTION.md'));
  await access(join(destination, 'templates/vitejs-cds/src/layout/ResponsivePanes.tsx'));
  await access(join(destination, 'templates/vitejs-cds/src/layout/layout.css'));
  await access(join(destination, 'skills/neon-create/references/cds-integration.md'));
  await assert.rejects(access(join(destination, 'evals')));
});

test('missing required payload fails before writing destination', async () => {
  const sourceRoot = await mkdtemp(join(tmpdir(), 'neon-empty-source-'));
  const destination = await mkdtemp(join(tmpdir(), 'neon-empty-dest-'));
  await assert.rejects(packagePlugin({ sourceRoot, destination }));
  assert.deepEqual(await readdir(destination), []);
});

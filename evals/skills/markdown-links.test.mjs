import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { checkMarkdownLinks } from '../../scripts/lib/markdown-links.mjs';

async function fixture(t, source, destination = '# Existing heading\n') {
  const root = await mkdtemp(join(tmpdir(), 'neon-markdown-'));
  t.after(() => rm(root, { recursive: true, force: true }));
  await mkdir(join(root, 'guide'));
  await writeFile(join(root, 'guide', 'README.md'), destination);
  const file = join(root, 'README.md');
  await writeFile(file, source);
  return file;
}

test('rejects a missing local file with the source and target in the error', async t => {
  const file = await fixture(t, '[Missing](missing.md)');
  await assert.rejects(checkMarkdownLinks(file), error => error.message.includes(file) && error.message.includes('missing.md'));
});

test('rejects a missing heading even when the target file exists', async t => {
  const file = await fixture(t, '[Moved section](guide/README.md#old-heading)');
  await assert.rejects(checkMarkdownLinks(file), /Missing anchor.*guide\/README.md#old-heading/);
});

test('validates same-file anchors and directory README anchors', async t => {
  const file = await fixture(t, '# Start\n[Here](#start)\n[Directory](guide/)\n[Section](guide/#existing-heading)');
  await checkMarkdownLinks(file);
  await writeFile(file, '# Start\n[Missing](#missing)');
  await assert.rejects(checkMarkdownLinks(file), /Missing anchor.*#missing/);
});

test('supports punctuation, inline code and duplicate heading slugs', async t => {
  const file = await fixture(t, '[One](guide/README.md#use-cds-now)\n[Two](guide/README.md#use-cds-now-1)\n[Three](guide/README.md#use-cds-now-1-1)',
    '# Use `CDS` (now)!\n## Use **CDS** (now)!\n## Use CDS now-1\n');
  await checkMarkdownLinks(file);
  await writeFile(file, '[Missing duplicate](guide/README.md#use-cds-now-2)');
  await assert.rejects(checkMarkdownLinks(file), /Missing anchor/);
});

test('ignores external links and code examples, including fake headings', async t => {
  const file = await fixture(t, '[External](https://example.com/path#anchor)\n[Protocol relative](//example.com/path)\n```md\n[Fake](missing.md)\n```\n~~~md\n[Fake](missing-too.md)\n~~~\n`[Inline example](missing-inline.md)`\n[Real](guide/README.md#real)',
    '```md\n# Fake heading\n```\n# Real\n');
  await checkMarkdownLinks(file);
  await writeFile(file, '[Fake anchor](guide/README.md#fake-heading)');
  await assert.rejects(checkMarkdownLinks(file), /Missing anchor/);
});

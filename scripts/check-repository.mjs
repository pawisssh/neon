#!/usr/bin/env node
import { readdir, readFile, access, mkdtemp } from 'node:fs/promises';
import { dirname, resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { tmpdir } from 'node:os';
import { packagePlugin } from './package-plugin.mjs';
import { checkMarkdownLinks } from './lib/markdown-links.mjs';

const sourceRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
async function markdownFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries.map(entry => entry.isDirectory()
    ? markdownFiles(join(directory, entry.name))
    : entry.name.endsWith('.md') ? [join(directory, entry.name)] : []));
  return nested.flat();
}
async function check(root, { includeReadme = false } = {}) {
  const manifest = JSON.parse(await readFile(join(root, '.claude-plugin/plugin.json'), 'utf8'));
  for (const skill of manifest.skills) {
    const file = join(root, skill, 'SKILL.md');
    const content = await readFile(file, 'utf8');
    const frontmatter = content.match(/^---\n([\s\S]*?)\n---/);
    if (!frontmatter || !/^name: [a-z0-9-]+$/m.test(frontmatter[1]) || !/^description: .+$/m.test(frontmatter[1])) {
      throw new Error(`Invalid skill metadata: ${file}`);
    }
  }
  const files = [...await markdownFiles(join(root, 'skills')), join(root, 'design/FINNOMENA.md')];
  if (includeReadme) files.push(join(root, 'README.md'));
  for (const file of files) {
    const content = await readFile(file, 'utf8');
    await checkMarkdownLinks(file);
    for (const match of content.matchAll(/\$\{CLAUDE_PLUGIN_ROOT\}\/([\w./-]+)/g)) {
      await access(join(root, match[1])).catch(() => { throw new Error(`Missing plugin resource in ${file}: ${match[1]}`); });
    }
  }
}
await check(sourceRoot, { includeReadme: true });
const destination = await mkdtemp(join(tmpdir(), 'neon-check-'));
await packagePlugin({ sourceRoot, destination });
await check(destination);
console.log('Skill metadata and resource links pass in source and packaged artifact.');

// Builds the visual-review manifest and reviewer prompt written beside each
// run's screenshots. Brief/rubric text lives in the sibling *-rubric.md
// files (## Brief / ## Rubric sections); the reviewer instructions live in
// report-template.md. Both briefs/rubrics are always included, regardless
// of scene, matching the runner's existing metadata contract.
import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const SCREENSHOT_WIDTHS = [375, 1440, 1920];

function parseBriefAndRubric(markdown) {
  const briefMatch = markdown.match(/## Brief\n\n([\s\S]*?)\n\n## Rubric/);
  const rubricMatch = markdown.match(/## Rubric\n\n([\s\S]*)/);
  if (!briefMatch || !rubricMatch) throw new Error('review source is missing a ## Brief or ## Rubric section');
  const brief = briefMatch[1].trim();
  const rubric = rubricMatch[1].trim().split('\n').map(line => line.replace(/^- /, '').trim()).filter(Boolean);
  return { brief, rubric };
}

export function writeReviewPackage({ output, metadata, scene }) {
  const sceneRoutes = scene === 'functional' ? ['detailed', 'content', 'simple'] : scene === 'immersive' ? ['immersive'] : ['detailed', 'content', 'simple', 'immersive'];
  const functional = parseBriefAndRubric(readFileSync(resolve(here, 'functional-rubric.md'), 'utf8'));
  const immersive = parseBriefAndRubric(readFileSync(resolve(here, 'immersive-rubric.md'), 'utf8'));
  const manifest = {
    scene,
    guideHashes: { functional: metadata.functionalDesignSHA256, immersive: metadata.immersiveDesignSHA256 },
    screenshots: sceneRoutes.flatMap(route => SCREENSHOT_WIDTHS.map(width => `visual/${route}-${width}.png`)),
    briefs: { functional: functional.brief, immersive: immersive.brief },
    rubric: { functional: functional.rubric, immersive: immersive.rubric },
    output: 'Write recognition-report.md beside this manifest.',
  };
  mkdirSync(resolve(output, 'visual'), { recursive: true });
  writeFileSync(resolve(output, 'visual-review-manifest.json'), JSON.stringify(manifest, null, 2));
  writeFileSync(resolve(output, 'visual-review-prompt.md'), readFileSync(resolve(here, 'report-template.md'), 'utf8'));
}

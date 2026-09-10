// Disposable generated showcase: validates harness mechanics, not design quality.
// Faults are injected into served HTML in memory; no fixture files are modified.
import { createServer } from 'node:http';
import { readFileSync, existsSync } from 'node:fs';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
const html = readFileSync(new URL('./fixtures/showcase.html', import.meta.url), 'utf8');
let fault = '';
const server = createServer((req, res) => {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  const css = fault === 'width' ? '.detailed .sidebar{width:390px!important}' : fault === 'logo' ? '[data-testid="logo-header"]{display:none!important}' : fault === 'palette' ? ':root{--palette-yellow-100:#000000!important}' : '';
  res.end(html.replace('</style>', `${css}</style>`));
});
await new Promise((resolve, reject) => { server.once('error', reject); server.listen(0, '127.0.0.1', resolve); });
const url = `http://127.0.0.1:${server.address().port}`;
async function run(label, args=[]) {
  return new Promise((resolve, reject) => {
    let output = '';
    const child = spawn(process.execPath, [fileURLToPath(new URL('../run.mjs', import.meta.url)), '--base-url', url, '--run-label', `harness-selftest-${label}`, ...args], { stdio: ['inherit', 'pipe', 'inherit'] });
    child.stdout.on('data', bytes => { output += bytes; process.stdout.write(bytes); });
    child.on('error', reject);
    child.on('exit', (code, signal) => {
      try {
        const directory = output.match(/Evaluation artifacts: (.+)/)?.[1];
        if (!directory) throw new Error('Runner did not produce an artifact directory');
        const report = JSON.parse(readFileSync(`${directory}/results.json`, 'utf8'));
        resolve({ code: signal ? -1 : code, report, directory });
      } catch (error) { reject(error); }
    });
  });
}
function assertReviewPackage(result, scene, expectedCount) {
  if (result.code !== 0) throw new Error(`${scene} review run failed.`);
  const review = JSON.parse(readFileSync(`${result.directory}/visual-review-manifest.json`, 'utf8'));
  if (review.scene !== scene || review.screenshots.length !== expectedCount || review.screenshots.some(path => !existsSync(`${result.directory}/${path}`))) throw new Error(`${scene} review package is incomplete.`);
}
try {
  const baseline = await run('baseline');
  if (baseline.code !== 0 || baseline.report.stats.expected < 56) throw new Error('Full baseline showcase failed; inspect its report before trusting fault checks.');
  for (const filename of ['visual-review-manifest.json', 'visual-review-prompt.md']) {
    if (!existsSync(`${baseline.directory}/${filename}`)) throw new Error(`Baseline did not create ${filename}.`);
  }
  const review = JSON.parse(readFileSync(`${baseline.directory}/visual-review-manifest.json`, 'utf8'));
  if (review.scene !== 'all' || review.screenshots.length === 0 || !review.rubric.immersive || !review.rubric.functional) throw new Error('Baseline visual-review manifest is incomplete.');
  if (review.screenshots.some(path => !existsSync(`${baseline.directory}/${path}`))) throw new Error('Baseline did not capture every declared visual-review screenshot.');
  assertReviewPackage(await run('functional-review', ['--scene', 'functional']), 'functional', 9);
  assertReviewPackage(await run('immersive-review', ['--scene', 'immersive']), 'immersive', 3);
  fault = 'width';
  const width = await run('width-fault', ['--scene', 'functional', '--grep', 'detailed: desktop geometry and logo$']);
  if (width.code !== 1 || width.report.stats.unexpected !== 1 || !JSON.stringify(width.report).includes('Width must be 360px')) throw new Error('Width fault did not produce the expected geometry failure.');
  fault = 'logo';
  const logo = await run('logo-fault', ['--scene', 'immersive', '--grep', 'immersive components and token contract$']);
  if (logo.code !== 1 || logo.report.stats.unexpected !== 1) throw new Error('Hidden-logo fault did not produce the expected missing-logo failure.');
  fault = 'palette';
  const palette = await run('palette-fault', ['--scene', 'immersive', '--grep', 'immersive components and token contract$']);
  if (palette.code !== 1 || palette.report.stats.unexpected !== 1) throw new Error('Palette fault did not produce the expected token failure.');
  fault = '';
  const restored = await run('restored', ['--scene', 'functional', '--grep', 'detailed: desktop geometry and logo$']);
  if (restored.code !== 0 || restored.report.stats.expected !== 1) throw new Error('Restored showcase failed.');
  console.log('Harness self-test PASS: baseline, width fault, hidden-logo fault, palette fault, restored baseline.');
} finally { fault = ''; server.close(); }

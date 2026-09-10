import { defineConfig } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

if (!process.env.EVAL_OUTPUT) throw new Error('Run through npm test so the document hash is recorded.');
const output = process.env.EVAL_OUTPUT;
const scene = process.env.EVAL_SCENE ?? 'all';
export default defineConfig({
  testDir: './harness/specs',
  testMatch: scene === 'functional' ? ['functional.spec.mjs', 'visual-capture.spec.mjs'] : scene === 'immersive' ? ['immersive.spec.mjs', 'visual-capture.spec.mjs'] : '*.spec.mjs',
  timeout: 25000,
  expect: { timeout: 5000 },
  fullyParallel: true,
  workers: 2,
  retries: 0,
  metadata: JSON.parse(readFileSync(process.env.EVAL_METADATA, 'utf8')),
  outputDir: resolve(output, 'results'),
  reporter: [['list'], ['html', { outputFolder: resolve(output, 'html'), open: 'never' }], ['json', { outputFile: resolve(output, 'results.json') }]],
  use: {
    browserName: 'chromium', baseURL: process.env.EVAL_BASE_URL,
    viewport: { width: 1440, height: 900 },
    screenshot: 'on', trace: 'retain-on-failure',
  },
});

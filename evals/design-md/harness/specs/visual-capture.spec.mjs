import { test, expect } from '@playwright/test';
import { mkdirSync } from 'node:fs';
import { resolve } from 'node:path';

const scene = process.env.EVAL_SCENE ?? 'all';
const routes = scene === 'functional' ? ['detailed', 'content', 'simple'] : scene === 'immersive' ? ['immersive'] : ['detailed', 'content', 'simple', 'immersive'];
const output = resolve(process.env.EVAL_OUTPUT, 'visual');
mkdirSync(output, { recursive: true });
for (const route of routes) for (const width of [375, 1440, 1920]) test(`visual review capture: ${route} ${width}`, async ({ page }) => {
  await page.setViewportSize({ width, height: 900 });
  await page.goto(`/${route}`);
  await expect(page.getByTestId('screen')).toHaveAttribute('data-layout', route);
  await page.screenshot({ path: resolve(output, `${route}-${width}.png`), fullPage: true });
});

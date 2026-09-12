import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");

test("Detailed Layout keeps the frame-confirmed responsive pane contract", async () => {
  const panes = await readFile(join(root, "templates/vitejs-cds/src/layout/layoutPanes.ts"), "utf8");
  const shell = await readFile(join(root, "templates/vitejs-cds/src/layout/AppShell.tsx"), "utf8");

  for (const line of [
    'sm: { content: "hidden", inspector: {} }',
    'md: { content: "hidden", inspector: {} }',
    "lg: { content: 360, inspector: {} }",
    "xl: { content: 360, inspector: {} }",
    "xxl: { content: 360, inspector: {} }",
    "xxxl: { content: 400, inspector: {} }",
    "max: { content: 560, inspector: { capAt: 980 } }",
  ]) {
    assert.ok(panes.includes(line), `missing Detailed Layout pane rule: ${line}`);
  }

  assert.match(shell, /pane\.content !== "hidden"/);
  assert.doesNotMatch(shell, /BottomNav/);
});

test("generated breakpoint tiers match every Detailed Layout boundary", async () => {
  const config = await readFile(join(root, "theme/cds/breakpoints.config.ts"), "utf8");
  const expected = [
    ["sm", 320, 499, 0],
    ["md", 500, 987, 64],
    ["lg", 988, 1079, 64],
    ["xl", 1080, 1271, 240],
    ["xxl", 1272, 1439, 320],
    ["xxxl", 1440, 1919, 360],
    ["max", 1920, 3840, 360],
  ];

  for (const [name, minWidth, maxWidth, sidebarWidth] of expected) {
    assert.ok(
      config.includes(`name: "${name}", minWidth: ${minWidth}, maxWidth: ${maxWidth}, sidebarWidth: ${sidebarWidth}`),
      `missing ${name} breakpoint contract`,
    );
  }
});

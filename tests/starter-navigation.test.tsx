/**
 * Component-render tests for the starter's navigation prop-threading (Task
 * 6 — see .superpowers/sdd/2026-09-09-employee-ui-workflows/task-6-brief.md).
 *
 * Renders the starter's REAL React/CDS components (Sidebar, BottomNav,
 * AppRoot, App) with react-dom/server's renderToStaticMarkup — no jsdom, no
 * @testing-library — and asserts on the resulting markup strings. That's
 * enough for what's under test here: link hrefs, target/rel, aria
 * attributes, and presence/absence of elements: all static-markup
 * questions, not interactive-DOM ones.
 *
 * Not runnable directly with `node --test` (the starter's TSX/JSX needs a
 * transform, and its dependencies live in starters/vitejs-cds/node_modules,
 * not any root node_modules). Run via:
 *
 *   node tests/run-starter-navigation.mjs
 *
 * which esbuild-bundles this file (pulling in the starter's own installed
 * react/react-dom/@coinbase/cds-web/@coinbase/cds-icons — run `npm install`
 * inside starters/vitejs-cds first) and executes the bundle. See that
 * file's header for why a full test-runner/testing-library devDependency
 * was deliberately not added anywhere in this repo for this.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import type { ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { ThemeProvider } from "@coinbase/cds-web/system";
import { createNeonTheme } from '@neon-test-app/theme/createTheme';
import { Sidebar } from '@neon-test-app/layout/Sidebar';
import { BottomNav } from '@neon-test-app/layout/BottomNav';
import { finnomenaEcosystemNav, type NavItem } from '@neon-test-app/layout/navItems';
import { AppRoot } from '@neon-test-app/app/AppRoot';
import { App } from '@neon-test-app/app/App';

const theme = createNeonTheme();

function withTheme(node: ReactNode) {
  return (
    <ThemeProvider theme={theme} activeColorScheme="light">
      {node}
    </ThemeProvider>
  );
}

// A representative, app-specific nav list — deliberately NOT
// finnomenaEcosystemNav — used for both the desktop (Sidebar) and mobile
// (BottomNav) renderers, per the brief's "same supplied navigation list for
// desktop and mobile" requirement.
const nav: NavItem[] = [
  { label: "Dashboard", icon: "home", href: "/dashboard", active: true },
  { label: "Support", icon: "search", href: "https://help.example.com", external: true },
];

/** Returns the single `<a ...>` opening tag whose href matches, or throws. */
function findAnchor(markup: string, href: string): string {
  const tags = markup.match(/<a\b[^>]*>/g) ?? [];
  const found = tags.find((tag) => tag.includes(`href="${href}"`));
  assert.ok(found, `expected an <a> tag with href="${href}" in:\n${markup}`);
  return found as string;
}

for (const [rendererName, render] of [
  ["Sidebar (full width)", () => renderToStaticMarkup(withTheme(<Sidebar width={240} navigation={nav}>{null}</Sidebar>))],
  ["BottomNav", () => renderToStaticMarkup(withTheme(<BottomNav navigation={nav} />))],
] as const) {
  test(`${rendererName}: local nav item has no target/rel`, () => {
    const anchor = findAnchor(render(), "/dashboard");
    assert.ok(!anchor.includes("target="), `local item should not set target: ${anchor}`);
    assert.ok(!anchor.includes("rel="), `local item should not set rel: ${anchor}`);
  });

  test(`${rendererName}: explicit external nav item opens in a new tab safely`, () => {
    const anchor = findAnchor(render(), "https://help.example.com");
    assert.ok(anchor.includes('target="_blank"'), `external item should open a new tab: ${anchor}`);
    assert.ok(
      anchor.includes('rel="noopener noreferrer"'),
      `external item should set rel="noopener noreferrer": ${anchor}`
    );
  });

  test(`${rendererName}: active item gets aria-current="page", inactive item does not`, () => {
    const markup = render();
    const activeAnchor = findAnchor(markup, "/dashboard");
    const inactiveAnchor = findAnchor(markup, "https://help.example.com");
    assert.ok(activeAnchor.includes('aria-current="page"'), `active item: ${activeAnchor}`);
    assert.ok(!inactiveAnchor.includes("aria-current="), `inactive item: ${inactiveAnchor}`);
  });
}

test("Sidebar icon-only (rail) mode keeps an accessible name via aria-label", () => {
  const markup = renderToStaticMarkup(
    withTheme(
      <Sidebar width={64} navigation={nav}>
        {null}
      </Sidebar>
    )
  );
  // Icon-only: the visible label text is not rendered as content...
  assert.ok(!markup.includes(">Dashboard<"), `rail mode should not show label text:\n${markup}`);
  // ...but the link still carries an accessible name for screen readers.
  const anchor = findAnchor(markup, "/dashboard");
  assert.ok(anchor.includes('aria-label="Dashboard"'), `rail item missing aria-label: ${anchor}`);
});

test("Sidebar full-width mode shows the visible label", () => {
  const markup = renderToStaticMarkup(
    withTheme(
      <Sidebar width={240} navigation={nav}>
        {null}
      </Sidebar>
    )
  );
  assert.ok(markup.includes(">Dashboard<"), `full-width mode should show label text:\n${markup}`);
});

test("BottomNav renders no fixed bar at all for empty navigation (not an empty bar)", () => {
  const markup = renderToStaticMarkup(withTheme(<BottomNav navigation={[]} />));
  assert.ok(!markup.includes("<nav"), `expected no <nav> element for empty navigation:\n${markup}`);
});

test("BottomNav renders a fixed bar when navigation is non-empty", () => {
  const markup = renderToStaticMarkup(withTheme(<BottomNav navigation={nav} />));
  assert.ok(markup.includes("<nav"), `expected a <nav> element for non-empty navigation:\n${markup}`);
});

// --- Regression / anti-vacuity checks -------------------------------------
//
// These assert things that would have been FALSE under the OLD
// hardcoded-navItems behavior (every scaffolded app always rendered
// Finnomena's real ecosystem links), proving the change actually took
// effect rather than the tests happening to match whatever was built.

test("default App() no longer ships Finnomena's hardcoded ecosystem links", () => {
  const markup = renderToStaticMarkup(
    <AppRoot>
      <App />
    </AppRoot>
  );
  // Old default `navItems` always linked to these four (plus the Logo's own
  // www.finnomena.com link, which is unrelated to nav items and out of
  // scope for this task — checked individually, not via a blanket
  // "finnomena.com" substring match, so this doesn't false-positive on it).
  for (const deadRoute of [
    "www.finnomena.com/fund/filter",
    "port.finnomena.com/dashboard",
    "auth.finnomena.com/profile",
    "www.finnomena.com/notification/hub",
  ]) {
    assert.ok(!markup.includes(deadRoute), `default App() should not ship ${deadRoute}:\n${markup}`);
  }
  // The starter's default navigation is empty, so at the SSR-default `sm`
  // (phone) tier neither the Sidebar (hidden at sm) nor BottomNav (empty
  // nav) render a <nav> element — under the old behavior BottomNav always
  // rendered a real <nav> with 5 ecosystem links at this tier.
  assert.ok(!markup.includes("<nav"), `default App() should render no nav element:\n${markup}`);
});

test("finnomenaEcosystemNav preset still carries the real ecosystem destinations, opt-in only", () => {
  assert.equal(finnomenaEcosystemNav.length, 5);
  assert.ok(finnomenaEcosystemNav.every((item) => item.external === true));
  const hrefs = finnomenaEcosystemNav.map((item) => item.href);
  assert.deepEqual(hrefs, [
    "https://www.finnomena.com",
    "https://www.finnomena.com/fund/filter",
    "https://port.finnomena.com/dashboard",
    "https://auth.finnomena.com/profile",
    "https://www.finnomena.com/notification/hub",
  ]);
});

test("AppRoot accepts colorScheme prop and configures ThemeProvider with activeColorScheme", () => {
  const lightMarkup = renderToStaticMarkup(
    <AppRoot colorScheme="light">
      <div id="child">Light Content</div>
    </AppRoot>
  );
  assert.ok(lightMarkup.includes("Light Content"));

  const darkMarkup = renderToStaticMarkup(
    <AppRoot colorScheme="dark">
      <div id="child">Dark Content</div>
    </AppRoot>
  );
  assert.ok(darkMarkup.includes("Dark Content"));
});

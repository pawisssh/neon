/**
 * Merges `neonTheme` (theme.config.ts's deliberately partial overrides) onto
 * @coinbase/cds-web's own `defaultTheme` to produce a real, complete
 * ThemeConfig — ThemeProvider's `theme` prop requires the full shape, and
 * there's no first-party merge utility in @coinbase/cds-web/cds-common/
 * cds-utils to do this for us (confirmed by inspecting the published
 * package — createThemeCssVars formats a theme as CSS vars, diffThemes only
 * subtracts, neither merges).
 *
 * `defaultTheme` is reachable via the package's wildcard export
 * (`@coinbase/cds-web/themes/defaultTheme`) rather than one of its
 * documented named subpaths — verified against @coinbase/cds-web@9.26.1.
 *
 * Hand-written, not generated — this merge logic doesn't depend on
 * Finnomena's specific token values, only on neonTheme's shape.
 */
import { defaultTheme } from "@coinbase/cds-web/themes/defaultTheme";
import type { ThemeConfig } from "@coinbase/cds-web";

import { neonTheme } from "./theme.config";

/** One-level-deep field merge — sufficient since every ThemeConfig field is a flat map. */
export function createNeonTheme(): ThemeConfig {
  const merged: Record<string, unknown> = { ...defaultTheme };
  for (const [key, value] of Object.entries(neonTheme)) {
    const base = (defaultTheme as Record<string, unknown>)[key];
    merged[key] =
      value && typeof value === "object" && !Array.isArray(value) && base && typeof base === "object"
        ? { ...base, ...value }
        : value;
  }
  return merged as ThemeConfig;
}

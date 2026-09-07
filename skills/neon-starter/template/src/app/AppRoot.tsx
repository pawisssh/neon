/**
 * Provider setup for @coinbase/cds-web with Finnomena's neonTheme.
 *
 * Provider order matters and must not be changed:
 *   MediaQueryProvider → ThemeProvider → PortalProvider
 *
 * Import paths verified against the real published @coinbase/cds-web@9.26.1
 * package: MediaQueryProvider/ThemeProvider live under the "./system"
 * subpath, PortalProvider under "./overlays".
 *
 * `createNeonTheme()` merges neonTheme's overrides onto CDS's own
 * `defaultTheme` and returns a real, complete ThemeConfig — no unsafe cast
 * needed (see ../theme/createTheme.ts for why that merge is necessary:
 * ThemeProvider requires a full ThemeConfig, not a partial one, and
 * @coinbase/cds-web has no first-party merge helper).
 *
 * Known gap, not yet resolved: `activeColorScheme` is hardcoded to "light"
 * — wire this to real light/dark state before shipping if the app needs
 * dark mode.
 */
import type { ReactNode } from "react";
import { MediaQueryProvider, ThemeProvider } from "@coinbase/cds-web/system";
import { PortalProvider } from "@coinbase/cds-web/overlays";

import { createNeonTheme } from "../theme/createTheme";

export function AppRoot({ children }: { children: ReactNode }) {
  return (
    <MediaQueryProvider>
      <ThemeProvider theme={createNeonTheme()} activeColorScheme="light">
        <PortalProvider>{children}</PortalProvider>
      </ThemeProvider>
    </MediaQueryProvider>
  );
}

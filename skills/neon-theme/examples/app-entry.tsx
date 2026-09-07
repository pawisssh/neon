/**
 * Reference pattern: correct provider setup for any Finnomena app using
 * @coinbase/cds-web with the neonTheme override.
 *
 * Provider order matters and must not be changed:
 *   MediaQueryProvider → ThemeProvider → PortalProvider
 *
 * Import paths verified against the real published @coinbase/cds-web@9.26.1
 * package: MediaQueryProvider/ThemeProvider live under "./system",
 * PortalProvider under "./overlays".
 *
 * `createNeonTheme()` merges neonTheme's overrides onto CDS's own
 * `defaultTheme` and returns a real, complete ThemeConfig — no unsafe cast
 * needed (see ../theme/createTheme.ts for why that merge is necessary:
 * ThemeProvider requires a full ThemeConfig, not a partial one, and
 * @coinbase/cds-web has no first-party merge helper).
 *
 * Font: Finnomena uses IBM Plex Sans Thai company-wide. It is NOT part of
 * the Figma token export, so it's loaded here directly rather than through
 * theme.config.ts's token pipeline. Prefer self-hosting (via @fontsource) in
 * production apps instead of the Google Fonts <link> shown as the quick-start
 * option below.
 */
import type { ReactNode } from "react";
import { MediaQueryProvider, ThemeProvider } from "@coinbase/cds-web/system";
import { PortalProvider } from "@coinbase/cds-web/overlays";

import { createNeonTheme } from "../theme/createTheme";

// Quick-start font loading (swap for a self-hosted @fontsource import before
// shipping to production):
//
//   <link rel="preconnect" href="https://fonts.googleapis.com" />
//   <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
//   <link
//     href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Thai:wght@400;500;600;700&display=swap"
//     rel="stylesheet"
//   />
//
// Self-hosted alternative:
//   npm install @fontsource/ibm-plex-sans-thai
//   import "@fontsource/ibm-plex-sans-thai/400.css";
//   import "@fontsource/ibm-plex-sans-thai/500.css";
//   import "@fontsource/ibm-plex-sans-thai/600.css";
//   import "@fontsource/ibm-plex-sans-thai/700.css";

export function AppRoot({ children }: { children: ReactNode }) {
  return (
    <MediaQueryProvider>
      <ThemeProvider theme={createNeonTheme()} activeColorScheme="light">
        <PortalProvider>{children}</PortalProvider>
      </ThemeProvider>
    </MediaQueryProvider>
  );
}

/**
 * DO NOT do this anywhere in app code — always go through theme tokens:
 *
 *   // ❌ forbidden
 *   <div style={{ color: "#1F3344", padding: 16, borderRadius: 8 }} />
 *
 *   // ✅ correct — semantic tokens from neonTheme via CDS's style props
 *   <Box color="textPrimary" padding="medium" borderRadius="sm" />
 *
 * See SKILL.md for the full rule and how it's enforced.
 */

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

// CDS's required global reset + font-variable styles. Without these,
// `fontFamilyMono`'s CDS-default var(--defaultFont-mono) points at an
// undefined CSS variable, and components render without CDS's base reset.
import "@coinbase/cds-web/globalStyles";
import "@coinbase/cds-web/defaultFontStyles";

import { AppRoot } from "./app/AppRoot";
import { App } from "./app/App";

// Quick-start font loading (swap for a self-hosted @fontsource import before
// shipping to production) — see AppRoot.tsx for the alternative.
const link = document.createElement("link");
link.rel = "stylesheet";
link.href =
  "https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Thai:wght@400;500;600;700&display=swap";
document.head.appendChild(link);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppRoot>
      <App />
    </AppRoot>
  </StrictMode>
);

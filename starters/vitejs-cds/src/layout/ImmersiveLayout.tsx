/**
 * Immersive Layout (Figma node 732:1461) — full-bleed Content only. No
 * Sidebar (the Sidebar View itself is `hidden="true"` in Figma, not just
 * zero-width), no Inspector (also `hidden="true"`). For focus/distraction-
 * free screens — a full-screen editor, a walkthrough, a single-task flow.
 *
 * Confirmed at xxxl: Content 1440, full viewport width, sole visible pane.
 * Only the xxxl frame was read; this pattern is simple enough (no
 * breakpoint-dependent chrome to hide/show) that it's assumed constant
 * across all 7 tiers rather than needing per-tier extrapolation.
 *
 * Unlike the other 4 patterns, this one has no room for the Finnomena nav
 * rail (see ./navItems.ts) — it keeps a single logo-only header instead
 * (./Logo.tsx), with no icons and no `BottomNav`, at every breakpoint.
 */
import type { ReactNode } from "react";
import { Box } from "@coinbase/cds-web/layout";
import { InspectorView } from "./InspectorView";
import { Logo } from "./Logo";

const HEADER_HEIGHT = 64;

export function ImmersiveLayout({ content }: { content: ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", width: "100%" }}>
      <Box
        as="header"
        style={{ height: HEADER_HEIGHT, flexShrink: 0 }}
        display="flex"
        alignItems="center"
        paddingStart={2}
      >
        <Logo />
      </Box>
      <div style={{ flex: 1, minHeight: 0, display: "flex" }}>
        {/* InspectorView is the generic "fill" pane component (Toolbar + scrollable body) — reused here since Immersive Layout is a single full-width pane with no fixed-width sibling. */}
        <InspectorView pane={{}}>{content}</InspectorView>
      </div>
    </div>
  );
}

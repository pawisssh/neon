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
 */
import type { ReactNode } from "react";
import { InspectorView } from "./InspectorView";

export function ImmersiveLayout({ content }: { content: ReactNode }) {
  return (
    <div style={{ display: "flex", height: "100vh", width: "100%" }}>
      {/* InspectorView is the generic "fill" pane component (Toolbar + scrollable body) — reused here since Immersive Layout is a single full-width pane with no fixed-width sibling. */}
      <InspectorView pane={{}}>{content}</InspectorView>
    </div>
  );
}

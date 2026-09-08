/**
 * Detailed Layout — responsive 3-pane app shell (Sidebar / Content /
 * Inspector), driven by ../theme/breakpoints.config.ts (sidebar width per
 * tier) and ./layoutPanes.ts's `detailedLayoutPanes` (Content/Inspector
 * widths per tier — see that file's header for provenance and caveats
 * before relying on exact pixel values). This is the default layout a
 * fresh scaffold boots into — see ./ContentLayout.tsx, ./SimpleLayout.tsx,
 * ./MultiColumnLayout.tsx, and ./ImmersiveLayout.tsx for the other 4 named
 * patterns from the same Figma component set.
 *
 * Bottom Navigation (see ./BottomNav.tsx) renders at the `sm`/phone tier,
 * replacing the Sidebar (hidden at that width) with the same Finnomena
 * ecosystem nav items — see ./navItems.ts.
 */
import type { ReactNode } from "react";
import { useBreakpointTier } from "./useBreakpointTier";
import { detailedLayoutPanes } from "./layoutPanes";
import { breakpoints } from "../theme/breakpoints.config";
import { Sidebar } from "./Sidebar";
import { BottomNav } from "./BottomNav";
import { ContentView } from "./ContentView";
import { InspectorView } from "./InspectorView";

export function AppShell({
  sidebar,
  content,
  inspector,
}: {
  sidebar: ReactNode;
  content: ReactNode;
  inspector: ReactNode;
}) {
  const tier = useBreakpointTier();
  const sidebarWidth = breakpoints.find((b) => b.name === tier)!.sidebarWidth;
  const pane = detailedLayoutPanes[tier];

  return (
    <div style={{ display: "flex", height: "100vh", width: "100%" }}>
      <Sidebar width={sidebarWidth}>{sidebar}</Sidebar>
      {pane.content !== "hidden" && <ContentView width={pane.content}>{content}</ContentView>}
      <InspectorView pane={pane.inspector}>{inspector}</InspectorView>
      <BottomNav />
    </div>
  );
}

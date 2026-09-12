/**
 * Detailed Layout — responsive 3-pane app shell (Sidebar / Content /
 * Inspector), driven by ../theme/breakpoints.config.ts (sidebar width per
 * tier) and ./layoutPanes.ts's `detailedLayoutPanes` (Content/Inspector
 * widths per tier — confirmed against the min/max Figma frames for every
 * tier). This is the default layout a fresh scaffold boots into — see
 * ./ContentLayout.tsx, ./SimpleLayout.tsx,
 * ./MultiColumnLayout.tsx, and ./ImmersiveLayout.tsx for the other 4 named
 * patterns from the same Figma component set.
 *
 * Detailed Layout intentionally does not add Bottom Navigation. At `sm`,
 * the Figma default is Inspector-only; at `md`, it is the Sidebar rail plus
 * Inspector. Product flows that move from a list into this layout must put
 * a clear back/switch action inside the narrow Inspector experience.
 */
import type { ReactNode } from "react";
import { useBreakpointTier } from "./useBreakpointTier";
import { detailedLayoutPanes } from "./layoutPanes";
import { breakpoints } from "../theme/breakpoints.config";
import { Sidebar } from "./Sidebar";
import { ContentView } from "./ContentView";
import { InspectorView } from "./InspectorView";
import type { NavItem } from "./navItems";

export function AppShell({
  sidebar,
  navigation = [],
  content,
  inspector,
}: {
  sidebar: ReactNode;
  navigation?: NavItem[];
  content: ReactNode;
  inspector: ReactNode;
}) {
  const tier = useBreakpointTier();
  const sidebarWidth = breakpoints.find((b) => b.name === tier)!.sidebarWidth;
  const pane = detailedLayoutPanes[tier];

  return (
    <div style={{ display: "flex", height: "100vh", width: "100%" }}>
      <Sidebar width={sidebarWidth} navigation={navigation}>
        {sidebar}
      </Sidebar>
      {pane.content !== "hidden" && <ContentView width={pane.content}>{content}</ContentView>}
      <InspectorView pane={pane.inspector}>{inspector}</InspectorView>
    </div>
  );
}

/**
 * Responsive 3-pane app shell (Sidebar / Content / Inspector), driven by
 * ../theme/breakpoints.config.ts (sidebar width per tier) and
 * ./appShellPanes.ts (Content/Inspector widths per tier — see that file's
 * header for provenance and caveats before relying on exact pixel values).
 *
 * Bottom Navigation exists in the source component set but its activation
 * condition wasn't confirmed from the Figma frame data — intentionally
 * omitted here. Confirm with the design owner before adding it.
 */
import type { ReactNode } from "react";
import { useBreakpointTier } from "./useBreakpointTier";
import { appShellPanes } from "./appShellPanes";
import { breakpoints } from "../theme/breakpoints.config";
import { Sidebar } from "./Sidebar";
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
  const pane = appShellPanes[tier];

  return (
    <div style={{ display: "flex", height: "100vh", width: "100%" }}>
      <Sidebar width={sidebarWidth}>{sidebar}</Sidebar>
      {pane.content !== "hidden" && <ContentView width={pane.content}>{content}</ContentView>}
      <InspectorView pane={pane.inspector}>{inspector}</InspectorView>
    </div>
  );
}

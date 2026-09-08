/**
 * Content Layout — responsive 3-pane shell (Sidebar / Content / Inspector),
 * structurally the mirror of AppShell/Detailed Layout: here Content is the
 * "fill" pane and Inspector is the fixed-width one (opposite of Detailed,
 * where Content is fixed and Inspector fills). See ./layoutPanes.ts's
 * `contentLayoutPanes` header for the Figma provenance and why this reuses
 * Detailed Layout's own confirmed per-tier widths in the swapped role.
 *
 * Reuses ContentView/InspectorView by ROLE, not by name: ContentView (the
 * fixed-width, toolbar-plus-body pane component) renders the `inspector`
 * prop here, and InspectorView (the fill pane component) renders `content`
 * — both components are generic pane shapes, not content-specific in
 * implementation, only in their usual name from AppShell.
 */
import type { ReactNode } from "react";
import { useBreakpointTier } from "./useBreakpointTier";
import { contentLayoutPanes } from "./layoutPanes";
import { breakpoints } from "../theme/breakpoints.config";
import { Sidebar } from "./Sidebar";
import { ContentView } from "./ContentView";
import { InspectorView } from "./InspectorView";

export function ContentLayout({
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
  const pane = contentLayoutPanes[tier];

  return (
    <div style={{ display: "flex", height: "100vh", width: "100%" }}>
      <Sidebar width={sidebarWidth}>{sidebar}</Sidebar>
      {pane.inspector !== "hidden" && <ContentView width={pane.inspector}>{inspector}</ContentView>}
      <InspectorView pane={pane.content}>{content}</InspectorView>
    </div>
  );
}

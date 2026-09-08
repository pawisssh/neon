/**
 * Generic "fill" pane: 64px Toolbar (equal Leading/Trailing halves) +
 * scrollable body. In AppShell/Detailed Layout, always visible, always
 * fills the remaining width — from the `max` tier up, its content caps at
 * `capAt` (980px per the Figma frame) and centers, per ./layoutPanes.ts.
 * Also reused (by role, not by name) as Content Layout's fill Content
 * pane, and as the sole pane in SimpleLayout/ImmersiveLayout.
 */
import type { ReactNode } from "react";
import type { InspectorPane } from "./layoutPanes";

const TOOLBAR_HEIGHT = 64;

export function InspectorView({ pane, children }: { pane: InspectorPane; children: ReactNode }) {
  return (
    <div style={{ flex: 1, minWidth: 0, height: "100%", overflowY: "auto" }}>
      <div
        style={{
          maxWidth: pane.capAt,
          marginInline: pane.capAt ? "auto" : undefined,
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div style={{ height: TOOLBAR_HEIGHT, flexShrink: 0, display: "flex" }}>
          <div style={{ flex: 1 }} />
          <div style={{ flex: 1 }} />
        </div>
        <div style={{ flex: 1, overflowY: "auto" }}>{children}</div>
      </div>
    </div>
  );
}

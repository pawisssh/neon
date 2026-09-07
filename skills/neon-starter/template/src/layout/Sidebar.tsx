/**
 * Sidebar pane: Header (64px) + scrollable Content Area + Footer (64px).
 * Width comes from ../theme/breakpoints.config.ts's `sidebarWidth` per tier
 * (0 = hidden, 64 = icon-rail, >64 = full sidebar) — see AppShell.tsx for
 * how the tier is picked. These widths are structural pane geometry, not
 * color/spacing/radius, so they're read as plain numbers rather than routed
 * through neonTheme's style tokens.
 */
import type { ReactNode } from "react";

const HEADER_FOOTER_HEIGHT = 64;

export function Sidebar({ width, children }: { width: number; children: ReactNode }) {
  if (width === 0) return null;
  const isRail = width === 64;

  return (
    <div
      style={{
        width,
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      <div style={{ height: HEADER_FOOTER_HEIGHT, flexShrink: 0 }} />
      <div style={{ flex: 1, overflowY: "auto" }}>{isRail ? null : children}</div>
      <div style={{ height: HEADER_FOOTER_HEIGHT, flexShrink: 0 }} />
    </div>
  );
}

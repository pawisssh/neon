/**
 * Content pane: 64px Toolbar (equal Leading/Trailing halves) + scrollable
 * body. Hidden entirely below the `lg` tier (see appShellPanes.ts) —
 * Inspector is the sole visible pane on sm/md.
 */
import type { ReactNode } from "react";

const TOOLBAR_HEIGHT = 64;

export function ContentView({ width, children }: { width: number; children: ReactNode }) {
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
      <div style={{ height: TOOLBAR_HEIGHT, flexShrink: 0, display: "flex" }}>
        <div style={{ flex: 1 }} />
        <div style={{ flex: 1 }} />
      </div>
      <div style={{ flex: 1, overflowY: "auto" }}>{children}</div>
    </div>
  );
}

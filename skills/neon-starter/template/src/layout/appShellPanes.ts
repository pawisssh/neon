/**
 * Simultaneous Sidebar/Content/Inspector pane widths for the 3-pane app
 * shell, by breakpoint tier.
 *
 * Sourced from a single Figma frame read (file C9Usn2yP1dRpE9iTxyW3B2, node
 * 732:842, "Layout / Web (v3) / Detailed Layout") — NOT from
 * ../theme/breakpoints.config.ts or theme/tokens/breakpoint.json's own
 * "Detailed Layout" token variant, which models a different, single-active-
 * pane state (its Content View width and Inspector View width are never
 * both nonzero at the same tier). This file is the real, simultaneous
 * 3-pane spec; keep it separate rather than merging the two.
 *
 * Sidebar width itself is NOT duplicated here — read it from
 * ../theme/breakpoints.config.ts's `sidebarWidth` field, which is
 * corroborated against this same Figma frame (0 / 64 / 64 / 240 / 320 / 360
 * / 360 across sm..max, matching exactly).
 *
 * Last verified: this session, against a single get_design_context read.
 * Not yet cross-checked against a rendered screenshot — re-verify before
 * treating these numbers as pixel-final, and update this header's
 * "last verified" note when you do.
 */
import type { BreakpointName } from "../theme/breakpoints.config";

export interface InspectorPane {
  width: "fill";
  /** From this tier up, Inspector's own content caps at this width and centers. */
  capAt?: number;
}

export interface AppShellPaneSpec {
  /** Content pane is always either a fixed width or hidden — Inspector is the one that fills. */
  content: number | "hidden";
  inspector: InspectorPane;
}

export const appShellPanes: Record<BreakpointName, AppShellPaneSpec> = {
  sm: { content: "hidden", inspector: { width: "fill" } },
  md: { content: "hidden", inspector: { width: "fill" } },
  lg: { content: 360, inspector: { width: "fill" } },
  xl: { content: 360, inspector: { width: "fill" } },
  xxl: { content: 360, inspector: { width: "fill" } },
  xxxl: { content: 400, inspector: { width: "fill" } },
  max: { content: 560, inspector: { width: "fill", capAt: 980 } },
};

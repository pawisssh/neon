/**
 * Pane specs for the 5 named layout patterns from Figma (file
 * C9Usn2yP1dRpE9iTxyW3B2, Core Components), by breakpoint tier. Renamed
 * from appShellPanes.ts (which held only the Detailed Layout spec) when
 * the other 4 patterns were added.
 *
 * Sourced from direct Figma frame reads — NOT from
 * theme/tokens/breakpoint.json's own per-variant numbers, which model a
 * different, single-active-pane concept (only one
 * of Content/Inspector is ever nonzero per variant) and don't reliably
 * predict actual pane VISIBILITY in Figma (confirmed: e.g. Simple Layout's
 * token data has Inspector as the nonzero pane, but the real frame shows
 * Content visible and Inspector `hidden="true"`). Pane visibility below
 * comes from Figma's own `hidden` attribute, not the token export.
 *
 * Sidebar width is NOT duplicated here — read it from
 * ../theme/breakpoints.config.ts's `sidebarWidth` field. Note: the raw
 * Figma frames for Content Layout and Multi-column Layout showed a
 * slightly different sidebar width at the 1440px frame (320px) than
 * Detailed/Simple Layout's 360px, which matches breakpoints.config.ts's
 * xxxl value — likely minor drift between component variants in the
 * source file, not an intentional per-pattern difference. Using the
 * shared breakpoints.config.ts value everywhere for a visually consistent
 * app shell across patterns; flag to the design owner if this should
 * actually vary per pattern.
 *
 * Detailed Layout and Content Layout are confirmed against the real Figma
 * frames at every supplied boundary width. Simple, Immersive, and
 * Multi-column Layout are still confirmed only at xxxl; their narrower
 * behavior remains extrapolated and must not be described as pixel-final.
 */
import type { BreakpointName } from "../theme/breakpoints.config";

export interface InspectorPane {
  /** From this tier up, Inspector's own content caps at this width and centers. */
  capAt?: number;
}

export interface DetailedPaneSpec {
  /** Content pane is always either a fixed width or hidden — Inspector is the one that fills. */
  content: number | "hidden";
  inspector: InspectorPane;
}

export interface ContentPaneSpec {
  /** Inspector pane is always either a fixed width or hidden — Content is the one that fills. */
  inspector: number | "hidden";
  content: InspectorPane;
}

/**
 * Detailed Layout (Default) — confirmed directly at 320/499, 500/987,
 * 988/1079, 1080/1271, 1272/1439, 1440, and 1920/2560/3840. SM is
 * Inspector-only. MD adds the 64px Sidebar rail. LG through MAX show all
 * three panes. Content is fixed at 360px for LG-XXL, 400px at XXXL, and
 * 560px at MAX; Inspector fills the remainder and caps at 980px centered
 * from MAX upward. Pane widths stay constant within each tier.
 */
export const detailedLayoutPanes: Record<BreakpointName, DetailedPaneSpec> = {
  sm: { content: "hidden", inspector: {} },
  md: { content: "hidden", inspector: {} },
  lg: { content: 360, inspector: {} },
  xl: { content: 360, inspector: {} },
  xxl: { content: 360, inspector: {} },
  xxxl: { content: 400, inspector: {} },
  max: { content: 560, inspector: { capAt: 980 } },
};

/**
 * Content Layout (node 732:4929) — Sidebar + Content + Inspector, all 3
 * simultaneous, content-weighted (inverse of Detailed: Content is the
 * "fill" pane, Inspector is the fixed-width one — opposite of Detailed
 * Layout's roles).
 *
 * Confirmed directly against Figma `get_metadata` reads at both the min-
 * and max-width frame of every tier (sm 320/499, md 500/987, lg 988/1079,
 * xl 1080/1271, xxl 1272/1439, xxxl 1440, max 1920/2560/3840): sm and md
 * hide Inspector and let Content fill; lg through xxxl show a fixed-width
 * Inspector (360, 360, 360, 400) with Content filling the remainder; max
 * fixes Inspector at 560 and caps Content at 980 centered (confirmed
 * exact at all three max-tier widths). Pane widths are constant across a
 * tier's min/max viewport — no within-tier stretching except Content's
 * cap at max. These values happened to already match what was previously
 * extrapolated from Detailed Layout's sequence; that coincidence is now
 * confirmed rather than assumed.
 *
 * Two spot checks worth calling out: at node 732:5105 ("SM 499px"),
 * Figma's own `hidden` attributes show Sidebar View and Inspector View
 * both hidden with Content View full-width and containing a real
 * (non-hidden) Bottom Navigation frame — confirming the sidebar-to-
 * bottom-navigation handoff this pattern relies on (via ../Sidebar.tsx's
 * width===0 check and ../BottomNav.tsx's tier==="sm" check) actually
 * happens at Figma's own sm boundary, not just in breakpoints.config.ts's
 * numbers. At node 732:5127 ("XXL 1272px"): Sidebar View 320, Content
 * View 592 (fill), Inspector View 360 (fixed) — 320 + 592 + 360 = 1272,
 * confirming the fill math exactly.
 */
export const contentLayoutPanes: Record<BreakpointName, ContentPaneSpec> = {
  sm: { inspector: "hidden", content: {} },
  md: { inspector: "hidden", content: {} },
  lg: { inspector: 360, content: {} },
  xl: { inspector: 360, content: {} },
  xxl: { inspector: 360, content: {} },
  xxxl: { inspector: 400, content: {} },
  max: { inspector: 560, content: { capAt: 980 } },
};

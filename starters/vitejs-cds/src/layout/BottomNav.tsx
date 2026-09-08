/**
 * Mobile bottom navigation bar — renders at the `sm` (phone, sidebarWidth
 * === 0) tier only, replacing the sidebar that's entirely hidden at that
 * width (see ./Sidebar.tsx). Uses the same caller-supplied `navigation`
 * list (see ./navItems.ts's `NavItem`) as the desktop SidebarNav — a single
 * source of truth for menu items, threaded down from the active layout.
 *
 * Renders nothing — not an empty fixed bar — when `navigation` is empty,
 * whether that's because the tier doesn't call for it or because the app
 * hasn't supplied any items yet.
 *
 * Icons use `fgInverse`, not the plain `fg` text color: in this theme
 * `bgPrimary` (this bar's background) is Navy Ink — a near-black dark
 * surface in light mode (see color-overrides.ts's `NAVY_100`), and `fg` is
 * itself near-black in light mode too, which computes to roughly a 1.1:1
 * contrast ratio against it (effectively invisible) — well under WCAG's
 * 3:1 minimum for graphical UI elements. `fgInverse` (white in light mode)
 * against `bgPrimary` computes to roughly 18:1 in the light mode this
 * starter actually ships (see AppRoot.tsx's own noted gap: dark mode isn't
 * wired to `activeColorScheme` yet, so its contrast here isn't chased
 * further). Verified by reading the actual token RGB values, not by
 * assuming the token names implied contrast.
 */
import { Box } from "@coinbase/cds-web/layout";
import { Icon } from "@coinbase/cds-web/icons";
import { useBreakpointTier } from "./useBreakpointTier";
import type { NavItem } from "./navItems";

export function BottomNav({ navigation = [] }: { navigation?: NavItem[] }) {
  const tier = useBreakpointTier();
  if (tier !== "sm" || navigation.length === 0) return null;

  return (
    <Box
      as="nav"
      position="fixed"
      bottom={0}
      left={0}
      right={0}
      height={56}
      zIndex={10}
      background="bgPrimary"
      borderedTop
      display="flex"
      alignItems="center"
      justifyContent="space-around"
    >
      {navigation.map((item) => (
        <Box
          as="a"
          key={item.href}
          href={item.href}
          target={item.external ? "_blank" : undefined}
          rel={item.external ? "noopener noreferrer" : undefined}
          aria-label={item.label}
          aria-current={item.active ? "page" : undefined}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Icon name={item.icon} size="m" color="fgInverse" />
        </Box>
      ))}
    </Box>
  );
}

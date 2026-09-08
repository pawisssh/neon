/**
 * Mobile bottom navigation bar — renders at the `sm` (phone, sidebarWidth
 * === 0) tier only, replacing the sidebar that's entirely hidden at that
 * width (see ./Sidebar.tsx). Uses the same ./navItems.ts list as the
 * desktop SidebarNav — a single source of truth for menu items.
 */
import { Box } from "@coinbase/cds-web/layout";
import { Icon } from "@coinbase/cds-web/icons";
import { useBreakpointTier } from "./useBreakpointTier";
import { navItems } from "./navItems";

export function BottomNav() {
  const tier = useBreakpointTier();
  if (tier !== "sm") return null;

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
      {navItems.map((item) => (
        <Box
          as="a"
          key={item.href}
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
          accessibilityLabel={item.label}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Icon name={item.icon} size="m" color="fg" />
        </Box>
      ))}
    </Box>
  );
}

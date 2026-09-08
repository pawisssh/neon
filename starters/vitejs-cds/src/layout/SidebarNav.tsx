/**
 * Renders Finnomena's ecosystem nav rail (see ./navItems.ts) inside the
 * Sidebar's scrollable content slot. `isRail` switches between icon-only
 * (64px tier) and icon+label (full-width tiers) — see ./Sidebar.tsx.
 */
import { Box } from "@coinbase/cds-web/layout";
import { Icon } from "@coinbase/cds-web/icons";
import { Text } from "@coinbase/cds-web/typography";
import type { NavItem } from "./navItems";

export function SidebarNav({ items, isRail }: { items: NavItem[]; isRail: boolean }) {
  return (
    <Box as="nav" display="flex" flexDirection="column" gap={0.5} padding={1}>
      {items.map((item) => (
        <Box
          as="a"
          key={item.href}
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
          textDecoration="none"
          display="flex"
          alignItems="center"
          gap={1}
          padding={1}
          borderRadius={200}
          justifyContent={isRail ? "center" : "flex-start"}
        >
          <Icon name={item.icon} size="m" color="fg" />
          {!isRail && <Text color="fg">{item.label}</Text>}
        </Box>
      ))}
    </Box>
  );
}

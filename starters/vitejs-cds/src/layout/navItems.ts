/**
 * Finnomena's shared ecosystem navigation rail — the same 5 destinations
 * shown on the left icon rail at trade.finnomena.com, confirmed against the
 * live production site. Icon names are real @coinbase/cds-icons glyphs,
 * checked against the installed @coinbase/cds-web@9.26.1's icon set, not
 * invented — see ./SidebarNav.tsx and ./BottomNav.tsx for where these
 * render.
 */
import type { ComponentProps } from "react";
import { Icon } from "@coinbase/cds-web/icons";

export type NavIconName = ComponentProps<typeof Icon>["name"];

export type NavItem = {
  label: string;
  icon: NavIconName;
  href: string;
};

export const navItems: NavItem[] = [
  { label: "Home", icon: "home", href: "https://www.finnomena.com" },
  { label: "Search", icon: "search", href: "https://www.finnomena.com/fund/filter" },
  { label: "Portfolio", icon: "barChartSimple", href: "https://port.finnomena.com/dashboard" },
  { label: "Profile", icon: "avatar", href: "https://auth.finnomena.com/profile" },
  { label: "Notifications", icon: "bell", href: "https://www.finnomena.com/notification/hub" },
];

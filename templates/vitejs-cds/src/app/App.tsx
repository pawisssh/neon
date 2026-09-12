import { AppShell } from "../layout/AppShell";

// AppShell's `navigation` prop (see ../layout/navItems.ts's `NavItem`)
// drives its Sidebar. Detailed Layout follows the Figma default and does
// not add BottomNav at SM: its narrow state is Inspector-only. Left empty
// here so a fresh scaffold never ships dead links. Replace with your own
// items once real in-app destinations exist, e.g. [{ label: "Home",
// icon: "home", href:
// "/", active: true }]. To link out to Finnomena's own ecosystem instead,
// import `finnomenaEcosystemNav` from "../layout/navItems" and pass it here.
export function App() {
  return (
    <AppShell
      sidebar={null}
      navigation={[]}
      content={<div>Content</div>}
      inspector={<div>Inspector — start building here</div>}
    />
  );
}

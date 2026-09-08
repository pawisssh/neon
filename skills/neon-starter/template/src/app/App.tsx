import { AppShell } from "../layout/AppShell";

export function App() {
  return (
    // Sidebar's logo + Finnomena ecosystem nav render automatically (see
    // ../layout/Sidebar.tsx) — `sidebar` here is only for extra,
    // app-specific content below that nav; leave it `null` if you don't
    // need any.
    <AppShell
      sidebar={null}
      content={<div>Content</div>}
      inspector={<div>Inspector — start building here</div>}
    />
  );
}

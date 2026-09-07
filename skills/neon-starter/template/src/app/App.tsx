import { AppShell } from "../layout/AppShell";

export function App() {
  return (
    <AppShell
      sidebar={<div>Sidebar</div>}
      content={<div>Content</div>}
      inspector={<div>Inspector — start building here</div>}
    />
  );
}

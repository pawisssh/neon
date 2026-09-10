// Oracle values owned by the functional scene: its routes, desktop pane
// geometry, responsive boundary widths, and sidebar-width behavior.
export const functionalRoutes = ['detailed', 'content', 'simple'];
export const desktop = {
  detailed: { sidebar: 360, content: 400, inspector: 680 },
  content: { sidebar: 320, content: 720, inspector: 400 },
  simple: { sidebar: 360, content: 1080 },
};
export const boundaries = [499, 500, 1079, 1080, 1271, 1272, 1439, 1440, 1919, 1920];
export function sidebarWidth(route, width) {
  if (width < 500) return 0;
  if (width < 1080) return 64;
  if (width < 1272) return 240;
  if (width < 1440) return 320;
  return route === 'detailed' || (route === 'simple' && width < 1920) ? 360 : 320;
}

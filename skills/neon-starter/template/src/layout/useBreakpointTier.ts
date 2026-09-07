/**
 * Framework-agnostic breakpoint hook, keyed off ../theme/breakpoints.config.ts
 * (copied in from neon-theme at scaffold time).
 *
 * Whether @coinbase/cds-web's MediaQueryProvider accepts custom breakpoints
 * is unverified in this repo (the package isn't installed/vendored anywhere
 * to check its real API against) — this plain matchMedia-based hook is the
 * default so the app shell doesn't depend on an unverified CDS API surface.
 * If CDS does support custom breakpoints, switching to its own hook is a
 * possible future simplification, not a blocking dependency.
 */
import { useEffect, useState } from "react";
import { breakpoints, type BreakpointName } from "../theme/breakpoints.config";

function tierForWidth(width: number): BreakpointName {
  for (const tier of breakpoints) {
    if (width >= tier.minWidth && width <= tier.maxWidth) return tier.name;
  }
  return breakpoints[breakpoints.length - 1].name;
}

export function useBreakpointTier(): BreakpointName {
  const [tier, setTier] = useState<BreakpointName>(() =>
    typeof window === "undefined" ? breakpoints[0].name : tierForWidth(window.innerWidth)
  );

  useEffect(() => {
    const update = () => setTier(tierForWidth(window.innerWidth));
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return tier;
}

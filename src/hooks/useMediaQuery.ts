"use client";

import { useCallback, useSyncExternalStore } from "react";

export function useMediaQuery(query: string, serverValue = false) {
  const subscribe = useCallback(
    (callback: () => void) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", callback);
      return () => mql.removeEventListener("change", callback);
    },
    [query],
  );

  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => serverValue,
  );
}

/** Tailwind's `lg` breakpoint — the cutoff for pinning and pointer-driven effects. */
export const useIsDesktop = () => useMediaQuery("(min-width: 1024px)");

/** True only for real mice and trackpads, so touch devices skip cursor and tilt effects. */
export const useHasFinePointer = () =>
  useMediaQuery("(hover: hover) and (pointer: fine)");

"use client";

import { useEffect, useState } from "react";

/**
 * Subscribe to a CSS media query.
 * SSR-safe: returns false on the server and first client render, then resolves
 * on mount and stays in sync via the change event.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(query);
    const update = () => setMatches(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [query]);

  return matches;
}

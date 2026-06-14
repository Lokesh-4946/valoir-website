"use client";

import { useEffect, useState } from "react";

/**
 * Returns true when the user prefers reduced motion.
 * SSR-safe: defaults to false, resolves on mount, and listens for changes.
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return reduced;
}

"use client";

import { useMediaQuery } from "./useMediaQuery";

/**
 * Returns true when the user prefers reduced motion.
 * SSR-safe: defaults to false, resolves on mount, and listens for changes.
 */
export function useReducedMotion(): boolean {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}

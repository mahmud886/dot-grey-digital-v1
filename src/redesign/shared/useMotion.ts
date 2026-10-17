"use client";

import { useState } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * Motion that the visitor can stop. Starts paused when the OS asks for reduced motion,
 * and every looping effect in the prototypes exposes `toggle` as a visible Pause button
 * (WCAG 2.2.2).
 */
export function useMotion() {
  const reduced = useReducedMotion();
  const [choice, setChoice] = useState<boolean | null>(null);
  const paused = choice ?? reduced;
  return { paused, reduced, toggle: () => setChoice(!paused) };
}

"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

// Registering twice is a no-op in GSAP, so this is safe from any client module.
gsap.registerPlugin(ScrollTrigger, useGSAP);

export const EASE_OUT = "expo.out";
export const EASE_IN_OUT = "power4.inOut";

export { gsap, ScrollTrigger, useGSAP };
